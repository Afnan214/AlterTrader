import express from "express";
import cors from "cors";
import { gemini } from "./gemini.js";
import dotenv from "dotenv";
import { addAlert } from "./postgres.js";

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

app.post("/addalert", async (req, res) => {
  console.log("in /addalert");
  console.log(req.rawHeaders);
  console.log(req.body);
  //   console.log(req.body.num);

  let { alert } = req.body;
  if (!alert) console.log(`No id provided. Alert: ${alert}`);

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
