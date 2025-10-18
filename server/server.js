import express from "express";
import cors from "cors";
import { gemini } from "./gemini.js";
import dotenv from "dotenv";
import { addAlert, getAlertsFromUser } from "./postgres.js";
import userRoutes from "./routes/userRoutes.js";
import protectedRoutes from "./routes/protected.js";

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
app.post("/getalerts", async (req, res) => {
  console.log("in /getalerts");

  let { user_id } = req.body;
  if (!user_id) {
    console.log(`No id provided. user_id: ${user_id}`);
    return res.status(400).json({ message: "user_id is required" });
  }

  const response = await getAlertsFromUser(user_id);

  if (response.rows.length === 0) {
    return res
      .status(404)
      .json({ message: `No alerts found for user ID ${user_id}` });
  }

  console.log(`Found ${response.rows.length} alerts for user ${user_id}`);

  res.json(response.rows);
});

app.post("/addalert", async (req, res) => {
  console.log("in /addalert");
  console.log(req.rawHeaders);
  console.log(req.body);
  //   console.log(req.body.num);

  let { alert } = req.body;
  if (!alert) console.log(`No alert provided. Alert: ${alert}`);

  addAlert(alert);

  //   const result = await getUUIDByID(num);
  //   if (result.rows.length === 0) {
  //     return res.status(404).json({ message: `ID ${num} not found` });
  //   }
  //   console.log(result.rows[0]);

  //   res.json(result.rows[0]);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
