-- Savings vs Liability tracker (MySQL 8+)
CREATE DATABASE IF NOT EXISTS finance_tracker CHARACTER SET utf8mb4;
USE finance_tracker;

CREATE TABLE entries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('saving','liability') NOT NULL,
  sl_no INT NOT NULL,                 -- serial number within its side, for manual ordering
  details VARCHAR(150) NOT NULL,      -- e.g. "HDFC Bank FD", "HDFC Housing Loan 8527"
  amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_entries_type ON entries(type, sl_no);

-- Seed with your current spreadsheet data
INSERT INTO entries (type, sl_no, details, amount) VALUES
('saving', 1,  'HDFC Bank FD', 150000.00),
('saving', 2,  'CNSCB FD', 541925.00),
('saving', 3,  'Grow & Upstox Mutual Fund', 543535.00),
('saving', 4,  'SBI Deposit', 112000.00),
('saving', 5,  'TATA insurance', 400000.00),
('saving', 6,  'TATA insurance 2', 200000.00),
('saving', 7,  'PF', 248823.00),
('saving', 8,  'Tech society', 59000.00),
('saving', 9,  'Coin DCX', 6644.00),
('saving', 10, 'Stock', 303731.00),
('saving', 11, 'IDBI bank emergency fund', 18000.00),
('saving', 12, 'Airtel payments bank', 3001.00),
('saving', 13, 'CNSCB SB', 3130.00),
('saving', 14, 'TATA Insurance bonus', 10.65),
('saving', 15, 'IDBI Bank FD1', 10000.00),
('saving', 16, 'Gold CNSCB Bank 6 Gms', 97770.00),
('saving', 17, 'Bracelet 12 Gms', 195540.00),
('saving', 18, 'Room Advance', 30000.00),
('saving', 19, 'CNSCB Locker Deposit', 7500.00),
('liability', 1,  'HDFC Housing Loan 8527', 434345.00),
('liability', 2,  'HDFC Housing Loan 325', 0.00),
('liability', 3,  'HDFC Housing Loan 8534', 682129.00),
('liability', 4,  'HDFC Housing Loan 8940', 686264.00),
('liability', 5,  'HDFC Bullet Loan', 0.00),
('liability', 6,  'Personal loan', 256286.00),
('liability', 7,  'Tech society loans', 30000.00),
('liability', 8,  'jumbo loan', 175592.00),
('liability', 9,  'CNSCB Chitty', 16000.00),
('liability', 10, 'Gold loan CNSCB', 0.00),
('liability', 11, 'TS Chitty', 0.00),
('liability', 12, 'Muthoot Chitty', 0.00),
('liability', 13, 'Eon Car Loan', 162267.00);
