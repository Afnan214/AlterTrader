import express from "express";
import { pool } from "../db/postgresSetup.js";
import { verifyFirebaseToken } from "../middleware/verifyFirebaseToken.js";
import {
    createTransaction,
    getTransactionsByUser,
} from "../db/transactions.js";

const router = express.Router();

/**
 * @route POST /api/transactions
 * @desc Create a new transaction
 */
router.post("/", verifyFirebaseToken, async (req, res) => {
    const { transactionType, amount, ticker } = req.body;
    const userId = req.user.uid;

    try {
        const newTransaction = await createTransaction(
            userId,
            transactionType,
            amount,
            ticker
        );
        res.status(201).json(newTransaction);
    } catch (err) {
        res.status(500).json({ error: "Failed to add transaction" });
    }
});

/**
 * @route GET /api/transactions
 * @desc Get all transactions for logged-in user
 */
router.get("/", verifyFirebaseToken, async (req, res) => {
    const userId = req.user.uid;

    try {
        const transactions = await getTransactionsByUser(userId);
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch transactions" });
    }
});

export default router;
