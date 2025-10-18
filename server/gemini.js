import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import fs from "fs/promises";
import { getAllAlerts } from "./db/alerts.js";

dotenv.config();

// create the client with your API key directly (no object wrapper)
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function loadRecentNews() {
  const raw = await fs.readFile(
    "../client/out/alerts_localhost_latest.json",
    "utf8"
  );
  const data = JSON.parse(raw);

  // Grab all the text values
  // const texts = data.alerts.map((a) => a.text);
  const url = data.url;
  const alertText = data.alerts[0].text;
  // const alertText = texts.join("\n");

  // Return it if you want to use it elsewhere
  return [alertText, url];
}

async function findTriggeredAlerts() {
  // function that will read all table rows and compare against recent news if it exsits
  // need a new table to check if recent news is unique
  const alerts = await getAllAlerts();
  console.log(alerts);
  const [recentNews, source] = await loadRecentNews();

  for (const alert of alerts) {
    const shouldTrigger = await shouldTriggerAlert(alert.alert, recentNews);
    console.log(shouldTrigger);
    console.log(recentNews);
    if (shouldTrigger) {
      const message = await createTriggerAlertMessage(
        alert.alert,
        recentNews,
        alert.source
      );
      console.log(message);
    }
  }
  return null;
}

findTriggeredAlerts();

async function shouldTriggerAlert(alert, recentNews) {
  const prompt = `Determine if this piece news is related to what the user is tracking
\n\
Rules:\n\
- Output only "Yes" or "No".\n\
- Do not explain your reasoning.\n\
- Ignore irrelevant content or non-financial topics.\n\
\n What the user is tracking: \n' 
    ${alert} 
    "\n News Article: \n" +
    ${recentNews}`;
  console.log(prompt);
  const responseText = callGemini(prompt);
  if (responseText == "Yes") {
    return true;
  } else {
    return false;
  }
}

async function createTriggerAlertMessage(alert, recentNews, source) {
  const prompt =
    "You are an expert financial analyst.\n\
Read the following news article and explain how it relates to the alert that was triggered.\n\
Your explanation must be concise, factual, and no longer than 40 words.\n\
Do not include extra commentary or formatting.\n\
\n\
Alert:\n " +
    alert +
    " \n\
\n\
News:\n " +
    recentNews;

  const responseText = callGemini(prompt);
  const message = `🚨 *Alert Triggered*
━━━━━━━━━━━━━━━
📊 ${alert}
💡 Reason: ${responseText}
🔗 ${source}


━━━━━━━━━━━━━━━
Reply with:
📈 *BUY* - to purchase
📉 *SELL* - to sell  
ℹ️ *INFO* - more details
❌ *DISMISS* - ignore alert`;

  return message;
}

async function callGemini(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);

    const text = await result.response.text();
    return text;
  } catch (error) {
    console.error("Gemini API error:", error);
  }
}

export async function gemini() {
  try {
    // get a specific model instance first
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let alert = "Donald Trump effects on the stock market";
    const [recentNews, source] = await loadRecentNews();

    // now call generateContent() on that model
    const prompt =
      'You are an expert financial analyst.\n\
Read the following news article carefully.\n\
\n\
Determine if this news is related to the stock market AND specifically relevant to the company the user wants to track (for example, Amazon).\n\
If the news is likely to have an impact—positive or negative—on that company’s stock performance, respond with "Yes".\n\
If the news is not related to the stock market or does not appear to impact that company, respond with "No".\n\
\n\
Rules:\n\
- Output only "Yes" or "No".\n\
- Do not explain your reasoning.\n\
- Ignore irrelevant content or non-financial topics.\n\
\n What to track: \n' +
      alert +
      "\n News Article: \n" +
      recentNews;

    const result = await model.generateContent(prompt);

    // response.text() returns a Promise<string> - await it once
    const text = await result.response.text();

    console.log(text);

    if (text == "Yes") {
      const structuredPrompt =
        "You are an expert financial analyst.\n\
Read the following news article and explain how it relates to the alert that was triggered.\n\
Your explanation must be concise, factual, and no longer than 40 words.\n\
Do not include extra commentary or formatting.\n\
\n\
Alert:\n " +
        alert +
        " \n\
\n\
News:\n " +
        recentNews;

      const res = await model.generateContent(structuredPrompt);
      const geminiReasoning = await res.response.text();

      const message = `🚨 *Alert Triggered*
━━━━━━━━━━━━━━━
📊 ${alert}
💡 Reason: ${geminiReasoning}
🔗 ${source}


━━━━━━━━━━━━━━━
Reply with:
📈 *BUY* - to purchase
📉 *SELL* - to sell  
ℹ️ *INFO* - more details
❌ *DISMISS* - ignore alert`;

      console.log(message);
    }

    // optionally handle the answer
    // if (text.trim().toLowerCase() === "yes") { ... }

    return text;
    // display the model’s text output
  } catch (error) {
    console.error("Gemini API error:", error);
  }
}
