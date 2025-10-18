import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNTSID;
const authToken = process.env.TWILIO_AUTHTOKEN;
const whatsAppNumber = process.env.WHATSAPP_NUMBER;

export const sendWhatsAppMessage = async (message) => {
  const client = twilio(accountSid, authToken);

  const response = await client.messages.create({
    body: message,
    from: "whatsapp:+14155238886",
    to: `whatsapp:+1${whatsAppNumber}`,
  });

  console.log(response);
};
