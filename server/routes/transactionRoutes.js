import express from "express";
import { pool } from "../postgres.js";
import { verifyFirebaseToken } from "../middleware/verifyFirebaseToken.js";

const router = express.Router();

// Create transaction
router.post("/", verifyFirebaseToken, async (req, res) => {
    const { transactionType, amount, ticker } = req.body;
    const userId = req.user.uid;
    try {
        const { rows } = await pool.query(
            `INSERT INTO transactions (user_id, transactionType, amount, ticker)
       VALUES ($1, $2, $3, $4) RETURNING *;`,
            [userId, transactionType, amount, ticker]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error("Error adding transaction:", err);
        res.status(500).json({ error: "Failed to add transaction" });
    }
});

// Get user's transactions
router.get("/", verifyFirebaseToken, async (req, res) => {
    const userId = req.user.uid;
    try {
        const { rows } = await pool.query(
            `SELECT * FROM transactions WHERE user_id = $1 ORDER BY transactionDate DESC;`,
            [userId]
        );
        res.json(rows);
    } catch (err) {
        console.error("Error fetching transactions:", err);
        res.status(500).json({ error: "Failed to fetch transactions" });
    }
});

export default router;
