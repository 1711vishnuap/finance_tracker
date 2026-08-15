const express = require('express');
const cors = require('cors');
require('dotenv').config();

const entryRoutes = require('./routes/entries');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', entryRoutes);
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Finance tracker API running on port ${PORT}`));
