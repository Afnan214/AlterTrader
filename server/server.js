import express from "express";
import cors from "cors";
import { gemini } from "./gemini.js";
import dotenv from "dotenv";
import { addAlert, getAlertsFromUser } from "./postgres.js";
// import { handleIncomingMessage, sendWhatsAppAlert } from "./twilio.js";
import { handleIncomingMessage } from "./twilio.js";

dotenv.config();

//create express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // Important for Twilio webhooks

const port = process.env.PORT || 3000;

// Store user conversation states (in production, use Redis or database)
const userStates = {};
//CORS configuration
const origins = ["http://localhost:5173"];

app.use(cors({ origin: origins }));

app.get("/", async (req, res) => {
  gemini_response = await gemini();
  res.send(gemini_response);
});

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

// 🚨 WEBHOOK: Twilio calls this when user sends a WhatsApp message
app.post("/webhook/whatsapp", async (req, res) => {
  try {
    console.log("📥 Incoming WhatsApp message:");
    console.log(req.body);

    const incomingMsg = req.body.Body || "";
    const from = req.body.From; // Format: whatsapp:+1234567890
    const messageId = req.body.MessageSid;

    // Get or create user state
    const userState = userStates[from] || {};

    // Handle the message
    const { newState } = await handleIncomingMessage(
      incomingMsg,
      from,
      userState
    );

    // Update user state
    userStates[from] = newState;

    console.log(`✅ Message ${messageId} processed`);

    // Respond with empty TwiML (message already sent in handler)
    res.type("text/xml");
    res.send("<Response></Response>");
  } catch (error) {
    console.error("❌ Error handling WhatsApp message:", error);
    res.status(500).send("<Response></Response>");
  }
});

// // Test endpoint to send an alert (for testing)
// app.post("/test/sendalert", async (req, res) => {
//   try {
//     const { alert, reason, link } = req.body;

//     await sendWhatsAppAlert(
//       alert || "BTC reached $70,000!",
//       reason || "Price target hit",
//       link || "https://altertrader.com/btc"
//     );

//     res.json({ success: true, message: "Alert sent!" });
//   } catch (error) {
//     console.error("Error sending alert:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

app.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
  console.log(`📱 WhatsApp webhook: http://localhost:${port}/webhook/whatsapp`);
});
