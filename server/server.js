import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { gemini } from "./gemini.js";
import dotenv from "dotenv";
import { addAlert, getAlertsFromUser } from "./db/alerts.js";
import userRoutes from "./routes/userRoutes.js";
import protectedRoutes from "./routes/protected.js";
import alertRoutes from "./routes/alertRoutes.js";
// import { handleIncomingMessage, sendWhatsAppAlert } from "./twilio.js";
import { handleIncomingMessage } from "./twilio.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import "./webScraper.js"
import { admin } from "./config/firebaseAdmin.js";

dotenv.config();

//create express app
const app = express();
const httpServer = createServer(app);
const origins = ["http://localhost:5173", process.env.FRONTEND_URL]
// Initialize Socket.IO with CORS
const io = new Server(httpServer, {
  cors: {
    origin: origins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: false })); // Important for Twilio webhooks

const PORT = process.env.PORT || 8080;

// Store user conversation states (in production, use Redis or database)
const userStates = {};

// Export function to update user state from other modules
export const updateUserState = (phoneNumber, stateUpdate) => {
  userStates[phoneNumber] = { ...userStates[phoneNumber], ...stateUpdate };
};
// //CORS configuration
// const origins = [process.env.FRONTEND_URL, "http://localhost:5173"];

// app.use(cors({ origin: origins }));

// Socket.IO authentication and connection handling
io.on("connection", async (socket) => {
  console.log("🔌 New socket connection attempt:", socket.id);

  // Get the token from the auth handshake
  const token = socket.handshake.auth.token;

  if (!token) {
    console.log("❌ No token provided, disconnecting socket");
    socket.disconnect();
    return;
  }

  try {
    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;

    console.log(`✅ Socket authenticated for user: ${userId}`);

    // Join user to their own room
    socket.join(userId);

    // Store userId on the socket for later use
    socket.userId = userId;

    socket.on("disconnect", () => {
      console.log(`👋 User ${userId} disconnected`);
    });
  } catch (error) {
    console.error("❌ Socket authentication failed:", error.message);
    socket.disconnect();
  }
});

app.get("/", async (req, res) => {
  gemini_response = await gemini();
  res.send(gemini_response);
});
app.use("/api", protectedRoutes);
app.use("/api/users", userRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/transactions", transactionRoutes(io));

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
      userState,
      io
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

app.get("/webhook/whatsapp", async (req, res) => {
  res.send("hi");
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

// httpServer.listen(port, () => {
//   console.log(`🚀 Server listening on port ${port}`);
//   console.log(`📱 WhatsApp webhook: http://localhost:${port}/webhook/whatsapp`);
//   console.log(`🔌 Socket.IO server ready`);
// });
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});