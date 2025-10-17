// routes/postRoutes.js
import express from "express";
import db from "../models/index.js";   // Sequelize auto-loads models here

const router = express.Router();

// CREATE a new post
router.post("/", async (req, res) => {
    try {
        const { content, imageUrl } = req.body;

        if (!content) {
            return res.status(400).json({ error: "Content is required" });
        }

        const newPost = await db.Post.create({ content, imageUrl });
        res.status(201).json(newPost);
    } catch (err) {
        console.error("Error creating post:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET all posts
router.get("/", async (_req, res) => {
    try {
        const posts = await db.Post.findAll({ order: [["createdAt", "DESC"]] });
        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to load posts" });
    }
});

export default router;
