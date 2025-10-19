# 🧠 TradeAlert — AI-Driven Market Insight System

**TradeAlert** is an intelligent, real-time trading companion that continuously analyzes market news and events to help users make smarter decisions.  
Users can create custom **Trackers** (for specific stocks, companies, or economic events), and our backend automatically monitors the latest data, interprets it through **Google Gemini**, and delivers actionable buy/sell insights in real time via **Twilio**.

---

## 🚀 Overview

### Core Features
- **📰 Automated News Scraping**
  - Continuously scrapes live market or event data using Puppeteer + Cheerio.
  - Detects key information related to each user’s Tracker (e.g., “AAPL”, “Tesla Earnings”, “Inflation Report”).
  
- **🤖 AI-Based Decision Engine**
  - Uses **Google Gemini** to summarize and interpret the latest headlines.
  - Classifies sentiment and determines whether to **Buy**, **Sell**, or **Hold**.

- **📱 Real-Time Notifications**
  - Integrates with **Twilio** to deliver instant alerts via WhatsApp or SMS.
  - Keeps users up to date whenever the system detects significant changes.

- **👤 Personalized Trackers**
  - Each user defines their own set of **Trackers** — keywords, tickers, or event names they want to follow.
  - The backend manages these Trackers and maps new market data to each user’s interests.

- **📊 Continuous Monitoring**
  - A background process runs every 30 seconds, scraping new information, comparing it with past results, and triggering AI analysis when relevant.

---
## ⚙️ How It Works

1. **User creates a Tracker**  
   Example: “AAPL”, “FOMC announcement”, or “Oil prices”.

2. **Scraper runs periodically**  
   Fetches and parses relevant market news pages (every 30 seconds by default).

3. **Change detection**  
   Compares new alert text with the last saved alert.  
   If the content has changed, it triggers Gemini analysis.

4. **AI decision generation**  
   Gemini interprets the news, predicts potential market reaction, and outputs an action: **Buy**, **Sell**, or **Hold**.

5. **Twilio notifications**  
   The decision and summary are sent instantly to the user through WhatsApp/SMS.

---

## 🎨 System Design
![Alt text]("./public/design.png" "a title")