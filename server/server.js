//API imports
const express = require("express");
const cors = require("cors");
//Gemini import
const { gemini } = require("./gemini.js");
//Environment variables
require("dotenv").config();

//create express app
const app = express();
const port = process.env.PORT || 3000;
//CORS configuration
const origins = ["http://localhost:5173"];

app.use(cors({ origin: origins }));

app.get("/", async (req, res) => {
  gemini_response = await gemini();
  res.send(gemini_response);
});

app.post("/addalert", async (req, res) => {
  console.log(req.rawHeaders);
  console.log(req.body);
  //   console.log(req.body.num);

  //   let { num } = req.body;
  //   if (!num) console.log(`No id provided. Num: ${id}`);

  const result = await getUUIDByID(num);
  if (result.rows.length === 0) {
    return res.status(404).json({ message: `ID ${num} not found` });
  }
  console.log(result.rows[0]);

  res.json(result.rows[0]);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
