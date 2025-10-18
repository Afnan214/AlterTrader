import express from "express";
import { pool } from "../db/postgresSetup.js";
import { verifyFirebaseToken } from "../middleware/verifyFirebaseToken.js";
import {
  createTransaction,
  getTransactionsByUser,
} from "../db/transactions.js";
import { getUserById, updateUserBalance } from "../db/users.js";

// Export a function that accepts the io instance
export default function (io) {
  const router = express.Router();

  /**
   * @route POST /api/transactions
   * @desc Create a new transaction
   */
  router.post("/", verifyFirebaseToken, async (req, res) => {
    const { transactionType, amount, ticker } = req.body;
    const userId = req.user.uid;

    try {
      // Get current user balance
      const user = await getUserById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Update balance based on transaction type
      const newBalance =
        transactionType === "BUY"
          ? user.balance - amount
          : user.balance + amount;

      // Update balance in database
      await updateUserBalance(userId, newBalance);

      // Create the transaction
      const newTransaction = await createTransaction(
        userId,
        transactionType,
        amount,
        ticker
      );

      // Emit the new transaction and balance to the user's room via WebSocket
      io.to(userId).emit("newTransaction", newTransaction);
      io.to(userId).emit("balanceUpdate", newBalance);
      console.log(
        `📤 Emitted newTransaction and balance to user ${userId}:`,
        newTransaction,
        `New balance: ${newBalance}`
      );

      res.status(201).json(newTransaction);
    } catch (err) {
      console.error("Error creating transaction:", err);
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

  return router;
}
