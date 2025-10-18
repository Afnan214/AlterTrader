import express from "express";
import { verifyFirebaseToken } from "../middleware/verifyFirebaseToken.js";
import { addAlert, getAlertsFromUser } from "../db/alerts.js";

const router = express.Router();

/**
 * POST /api/alerts
 * Create a new alert for the logged-in Firebase user
 */
router.post("/", verifyFirebaseToken, async (req, res) => {
    const { alert } = req.body;
    const userId = req.user.uid; // ✅ Firebase UID

    if (!alert) return res.status(400).json({ error: "Alert text is required" });

    try {
        const newAlert = await addAlert(alert, userId);
        res.status(201).json(newAlert);
    } catch (error) {
        console.error("Error adding alert:", error);
        res.status(500).json({ error: "Failed to add alert" });
    }
});

/**
 * GET /api/alerts
 * Retrieve all alerts for the logged-in Firebase user
 */
router.get("/", verifyFirebaseToken, async (req, res) => {
    const userId = req.user.uid;

    try {
        const alerts = await getAlertsFromUser(userId);
        res.status(200).json(alerts);
    } catch (error) {
        console.error("Error fetching alerts:", error);
        res.status(500).json({ error: "Failed to fetch alerts" });
    }
});

export default router;
