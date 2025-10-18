import express from "express";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import db from "./models/index.js";
import postRoutes from "./routes/postRoutes.js";
import cors from "cors";
dotenv.config();

const origins = ['http://localhost:5173'];



const app = express();
app.use(express.json());

app.use(cors({ origin: origins }));
// Connect to DB
const sequelize = db.sequelize;
sequelize.authenticate()
    .then(() => console.log("✅ Database connected"))
    .catch(err => console.error("❌ DB connection failed:", err));

// Routes
app.use("/api/posts", postRoutes);

app.get("/", (_req, res) => res.send("API running..."));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
