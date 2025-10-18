import { admin } from "../config/firebaseAdmin.js";

export async function verifyFirebaseToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken; // contains uid, email, name, etc.
        next();
    } catch (error) {
        console.error("Error verifying Firebase token:", error);
        res.status(403).json({ error: "Invalid or expired token" });
    }
}
