import express from "express";
import { verifyFirebaseToken } from "../middleware/verifyFirebaseToken.js";

const router = express.Router();

router.get("/protected", verifyFirebaseToken, (req, res) => {
    res.json({
        message: "✅ You are authenticated",
        firebaseUser: req.user,
    });
});

export default router;
