import twilio from "twilio";
import dotenv from "dotenv";
import { getAllUsers, getUserById, updateUserBalance } from "./db/users.js";

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNTSID;
const authToken = process.env.TWILIO_AUTHTOKEN;
const whatsAppNumber = process.env.WHATSAPP_NUMBER;

export const sendWhatsAppMessage = async (
  message,
  phoneNumber = whatsAppNumber
) => {
  const client = twilio(accountSid, authToken);

  const response = await client.messages.create({
    body: message,
    from: "whatsapp:+14155238886",
    to: `whatsapp:+1${phoneNumber}`,
  });

  console.log("Message sent:", response.sid);
  return response;
};

// // Send WhatsApp Alert with interactive button options
// export const sendWhatsAppAlert = async (alert, reason, link) => {
//   const message = `🚨 *Alert Triggered*
// ━━━━━━━━━━━━━━━
// 📊 ${alert}
// 💡 Reason: ${reason}
// 🔗 ${link}

// ━━━━━━━━━━━━━━━
// Reply with:
// 📈 *BUY* - to purchase
// 📉 *SELL* - to sell
// ℹ️ *INFO* - more details
// ❌ *DISMISS* - ignore alert`;

//   return await sendWhatsAppMessage(message);
// };

// Handle when user wants to buy
export const buyMessage = async () => {
  const message =
    "💰 How much do you want to buy?\n\nType the amount in USD (e.g., 100)";
  return await sendWhatsAppMessage(message);
};

// Execute buy order
export const buyStock = async (amount, stockSymbol = "BTC") => {
  const [firstUser] = await getAllUsers();
  const id = firstUser.id;
  const userBalance = firstUser.balance;
  const newBalance = userBalance - amount;
  updateUserBalance(id, newBalance);

  const message = `✅ *Purchase Confirmed*\n\nBought $${amount} worth of ${stockSymbol}\n\nYour order has been executed!`;

  return await sendWhatsAppMessage(message);
};

// Handle when user wants to sell
export const sellMessage = async () => {
  const message =
    "💵 How much do you want to sell?\n\nType the amount in USD (e.g., 100)";
  return await sendWhatsAppMessage(message);
};

// Execute sell order
export const sellStock = async (amount, stockSymbol = "BTC") => {
  const [firstUser] = await getAllUsers();
  const id = firstUser.id;
  const userBalance = firstUser.balance;
  const newBalance = userBalance + amount;
  updateUserBalance(id, newBalance);

  const message = `✅ *Sale Confirmed*\n\nSold $${amount} worth of ${stockSymbol}\n\nYour order has been executed!`;
  return await sendWhatsAppMessage(message);
};

// Send info about the alert
export const sendAlertInfo = async (stockSymbol = "BTC") => {
  const message = `📊 *${stockSymbol} Information*
━━━━━━━━━━━━━━━
Current Price: $67,234
24h Change: +3.5%
Volume: $42.3B
Market Cap: $1.32T

Reply *BUY* or *SELL* to trade`;

  return await sendWhatsAppMessage(message);
};

// Handle incoming messages - this will be called from webhook
export const handleIncomingMessage = async (
  incomingMsg,
  from,
  userState = {}
) => {
  const msg = incomingMsg.trim().toUpperCase();

  // Check if user is in a state (e.g., waiting for amount)
  if (userState.waitingForBuyAmount) {
    const amount = parseFloat(incomingMsg);
    if (!isNaN(amount) && amount > 0) {
      await buyStock(amount, userState.stockSymbol);
      return { newState: {} }; // Clear state
    } else {
      await sendWhatsAppMessage(
        "❌ Invalid amount. Please enter a number (e.g., 100)"
      );
      return { newState: userState };
    }
  }

  if (userState.waitingForSellAmount) {
    const amount = parseFloat(incomingMsg);
    if (!isNaN(amount) && amount > 0) {
      await sellStock(amount, userState.stockSymbol);
      return { newState: {} }; // Clear state
    } else {
      await sendWhatsAppMessage(
        "❌ Invalid amount. Please enter a number (e.g., 100)"
      );
      return { newState: userState };
    }
  }

  // Handle commands
  switch (msg) {
    case "BUY":
      await buyMessage();
      return { newState: { waitingForBuyAmount: true, stockSymbol: "BTC" } };

    case "SELL":
      await sellMessage();
      return { newState: { waitingForSellAmount: true, stockSymbol: "BTC" } };

    case "INFO":
      await sendAlertInfo();
      return { newState: {} };

    case "DISMISS":
      await sendWhatsAppMessage("✓ Alert dismissed");
      return { newState: {} };

    case "HELP":
      const helpMsg = `🤖 *AlterTrader Commands*
━━━━━━━━━━━━━━━
*BUY* - Purchase stock
*SELL* - Sell stock
*INFO* - Get stock info
*PRICE* - Current prices
*ALERTS* - View your alerts
*HELP* - Show this menu`;
      await sendWhatsAppMessage(helpMsg);
      return { newState: {} };

    case "PRICE":
      await sendWhatsAppMessage("📊 BTC: $67,234 | ETH: $2,456 | SOL: $142");
      return { newState: {} };

    case "ALERTS":
      await sendWhatsAppMessage(
        "🔔 You have 3 active alerts:\n• BTC > $70,000\n• ETH < $2,400\n• SOL > $150"
      );
      return { newState: {} };

    default:
      await sendWhatsAppMessage(
        "❓ I didn't understand that. Reply *HELP* for commands."
      );
      return { newState: {} };
  }
};
