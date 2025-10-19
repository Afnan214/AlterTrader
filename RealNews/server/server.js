import express from "express";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import db from "./models/index.js";
import postRoutes from "./routes/postRoutes.js";
import cors from "cors";
dotenv.config();

const origins = [process.env.FRONTEND_URL, "http://localhost:5173", "http://localhost:5174"];

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: origins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
const sequelize = db.sequelize;
sequelize
  .authenticate()
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.error("❌ DB connection failed:", err));

// Routes
app.use("/api/posts", postRoutes);

app.get("/", (_req, res) => res.send("API running..."));

const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});