const express = require('express');
const pool = require('../db');

const router = express.Router();

// GET /api/entries?type=saving
router.get('/entries', async (req, res) => {
  const { type } = req.query;
  let sql = 'SELECT * FROM entries';
  const params = [];
  if (type) { sql += ' WHERE type = ?'; params.push(type); }
  sql += ' ORDER BY type, sl_no';
  const [rows] = await pool.query(sql, params);
  res.json(rows);
});

// GET /api/summary  -> totals + net worth, matches the spreadsheet's bottom row
router.get('/summary', async (req, res) => {
  const [[savingRow]] = await pool.query(
    `SELECT COALESCE(SUM(amount),0) AS total FROM entries WHERE type = 'saving'`
  );
  const [[liabilityRow]] = await pool.query(
    `SELECT COALESCE(SUM(amount),0) AS total FROM entries WHERE type = 'liability'`
  );
  const totalSavings = Number(savingRow.total);
  const totalLiability = Number(liabilityRow.total);
  res.json({
    total_savings: totalSavings,
    total_liability: totalLiability,
    net_worth: totalSavings - totalLiability
  });
});

// POST /api/entries  { type, details, amount }
router.post('/entries', async (req, res) => {
  try {
    const { type, details, amount } = req.body;
    if (!type || !details || amount === undefined) {
      return res.status(400).json({ error: 'type, details and amount are required' });
    }
    if (!['saving', 'liability'].includes(type)) {
      return res.status(400).json({ error: 'type must be saving or liability' });
    }
    const [[{ maxSl }]] = await pool.query(
      `SELECT COALESCE(MAX(sl_no),0) AS maxSl FROM entries WHERE type = ?`, [type]
    );
    const [result] = await pool.query(
      `INSERT INTO entries (type, sl_no, details, amount) VALUES (?, ?, ?, ?)`,
      [type, maxSl + 1, details, amount]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not create entry' });
  }
});

// PUT /api/entries/:id  { details, amount }
router.put('/entries/:id', async (req, res) => {
  try {
    const { details, amount } = req.body;
    await pool.query(
      `UPDATE entries SET details = COALESCE(?, details), amount = COALESCE(?, amount) WHERE id = ?`,
      [details ?? null, amount ?? null, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not update entry' });
  }
});

// DELETE /api/entries/:id
router.delete('/entries/:id', async (req, res) => {
  await pool.query('DELETE FROM entries WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

module.exports = router;
