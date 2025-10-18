CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(128) NOT NULL,
  transactionType VARCHAR(10) CHECK (transactionType IN ('BUY', 'SELL')) NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  ticker VARCHAR(10) NOT NULL,
  transactionDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
