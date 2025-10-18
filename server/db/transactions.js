import { pool } from "./postgresSetup.js"

/**
 * Create a new transaction for a user
 * @param {string} userId - Firebase UID of the user
 * @param {string} transactionType - BUY or SELL
 * @param {number} amount - Transaction amount
 * @param {string} ticker - Stock ticker
 */
export async function createTransaction(userId, transactionType, amount, ticker) {
    try {
        const query = `
      INSERT INTO transactions (user_id, transactionType, amount, ticker)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
        const values = [userId, transactionType, amount, ticker];
        const { rows } = await pool.query(query, values);
        return rows[0];
    } catch (err) {
        console.error("❌ Error creating transaction:", err);
        throw err;
    }
}

/**
 * Fetch all transactions for a given user
 * @param {string} userId - Firebase UID of the user
 */
export async function getTransactionsByUser(userId) {
    try {
        const query = `
      SELECT * FROM transactions
      WHERE user_id = $1
      ORDER BY transactionDate DESC;
    `;
        const { rows } = await pool.query(query, [userId]);
        return rows;
    } catch (err) {
        console.error("❌ Error fetching transactions:", err);
        throw err;
    }
}
