import * as cheerio from "cheerio";
import pino from "pino";
import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";
import { gemini, triggerAlerts } from "./gemini.js";

// ---------------------- Config ----------------------
const BASE_URL = "http://localhost:5174/";
const OUT_DIR = "out";
const USER_AGENT = "MockNewsScraper/1.0";
const SCRAPE_INTERVAL = 10 * 1000; // 10 seconds

// ---------------------- Logger ----------------------
const log = pino({
    level: "info",
    transport: { target: "pino-pretty", options: { colorize: true } },
});

// ---------------------- Globals ----------------------
let lastAlertText = null; // to compare changes between scrapes

// ---------------------- Helpers ----------------------
async function fetchHtml(url, ua) {
    const browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setUserAgent(ua);

    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

    const html = await page.content();
    await browser.close();

    return html;
}

function ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function serializeAlerts($, baseUrl) {
    const $el = $("[class*='alert'], .alert, alert").first();
    if (!$el.length) return [];

    const text = $el.text().trim().replace(/\s+/g, " ");
    const classList = ($el.attr("class") || "").trim();
    const tag = $el.get(0).tagName;

    const links = [];
    $el.find("a[href]").each((_, a) => {
        const $a = $(a);
        links.push({
            text: $a.text().trim(),
            href: new URL($a.attr("href"), baseUrl).toString(),
        });
    });

    return [
        {
            tag,
            classList,
            text,
            links,
        },
    ];
}

function writeJson(outdir, url, alerts) {
    ensureDir(outdir);
    const safeHost = new URL(url).hostname.replace(/[^a-z0-9.-]/gi, "_");
    const file = path.join(outdir, `alerts_${safeHost}_latest.json`);

    fs.writeFileSync(
        file,
        JSON.stringify(
            {
                scrapedAt: new Date().toISOString(),
                url,
                count: alerts.length,
                alerts,
            },
            null,
            2
        )
    );
    return file;
}

// ---------------------- Core Scraper ----------------------
async function scrapeOnce() {
    try {
        log.info(`Scraping ${BASE_URL} ...`);
        const html = await fetchHtml(BASE_URL, USER_AGENT);
        const $ = cheerio.load(html);
        const alerts = serializeAlerts($, BASE_URL);

        if (alerts.length > 0) {
            // console.log(alerts);
            const currentAlertText = alerts[0].text;

            // Compare with previous alert text
            if (lastAlertText === currentAlertText) {
                log.info("No change in alert text since last scrape.");
            } else {
                await triggerAlerts(alerts[0].text, BASE_URL);
                log.info("🆕 Alert text changed or first run, updating record.");
                lastAlertText = currentAlertText;
            }
        } else {
            log.warn("No alert element found on page.");
        }

        // Save output (optional)
        const file = writeJson(OUT_DIR, BASE_URL, alerts);
        log.info(`Wrote ${alerts.length} alert(s) to ${file}`);
    } catch (err) {
        log.error(err, "Scrape failed.");
    }
}

// ---------------------- Handlers ----------------------

// ---------------------- Runner ----------------------
function startScrapingLoop() {
    log.info(`Starting scraper loop (every ${SCRAPE_INTERVAL / 1000}s)...`);
    scrapeOnce(); // immediate run
    setInterval(() => {
        log.info("🔁 Running periodic scrape...");
        scrapeOnce();
    }, SCRAPE_INTERVAL);
}

startScrapingLoop();
// Keep process alive
process.stdin.resume();