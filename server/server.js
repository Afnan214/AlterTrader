import express from "express";
import cors from "cors";
import { gemini } from "./gemini.js";
import dotenv from "dotenv";
import { addAlert, getAlertsFromUser } from "./db/alerts.js";
import userRoutes from "./routes/userRoutes.js";
import protectedRoutes from "./routes/protected.js";
import alertRoutes from "./routes/alertRoutes.js";

dotenv.config();

//create express app
const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;
//CORS configuration
const origins = ["http://localhost:5173"];

app.use(cors({ origin: origins }));

app.get("/", async (req, res) => {
  gemini_response = await gemini();
  res.send(gemini_response);
});
app.use("/api", protectedRoutes);
app.use("/api/users", userRoutes);
app.use("/api/alerts", alertRoutes);


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
