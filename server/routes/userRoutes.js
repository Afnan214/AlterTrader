import express from "express";
import { createUser, getAllUsers, getUserById, updateUserBalance, deleteUser } from "../db/users.js";
import { verifyFirebaseToken } from "../middleware/verifyFirebaseToken.js";
const router = express.Router();

// POST /api/users
router.post("/", verifyFirebaseToken, async (req, res) => {
    const { id, username, email, balance } = req.body;
    console.log("📩 Received data:", { id, username, email, balance });

    try {
        const newUser = await createUser(id, username, email, balance || 0);
        res.status(201).json(newUser);
    } catch (err) {
        console.error("Error creating user:", err);
        res.status(500).json({ error: "Failed to create user" });
    }
});

// GET /api/users
router.get("/", async (_req, res) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

// GET /api/users/:id
router.get("/:id", async (req, res) => {
    try {
        const user = await getUserById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch user" });
    }
});

// PUT /api/users/:id/balance
router.put("/:id/balance", async (req, res) => {
    try {
        const updated = await updateUserBalance(req.params.id, req.body.balance);
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: "Failed to update balance" });
    }
});

// DELETE /api/users/:id
router.delete("/:id", async (req, res) => {
    try {
        const deleted = await deleteUser(req.params.id);
        res.json(deleted);
    } catch (err) {
        res.status(500).json({ error: "Failed to delete user" });
    }
});

export default router;
