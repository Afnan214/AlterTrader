import axios from "axios";
import * as cheerio from "cheerio";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import pino from "pino";
import fs from "fs";
import path from "path";
import dayjs from "dayjs";
import puppeteer from "puppeteer";

// ---------- CLI ----------
const argv = yargs(hideBin(process.argv))
  .option("url", {
    type: "string",
    demandOption: true,
    describe: "URL of mock news site",
  })
  .option("outdir", {
    type: "string",
    default: "out",
    describe: "Directory to write JSON to",
  })
  .option("watch", {
    type: "number",
    describe: "Poll interval in seconds (omit for one-off)",
  })
  .option("userAgent", {
    type: "string",
    default: "MockNewsScraper/1.0",
    describe: "Custom User-Agent",
  })
  .help().argv;

const log = pino({
  level: "info",
  transport: { target: "pino-pretty", options: { colorize: true } },
});

// ---------- Helpers ----------
async function fetchHtml(url, ua) {
  const browser = await puppeteer.launch({
    headless: "new", // no visible browser window
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setUserAgent(ua);

  // Go to the page and wait for all JS to load
  await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

  // Optional: wait for any element with class "alert" to appear
  try {
    await page.waitForSelector(".alert", { timeout: 5000 });
  } catch {
    // if no alerts appear, it's fine
  }

  // Get the rendered HTML
  const html = await page.content();
  await browser.close();

  return html;
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function serializeAlerts($, baseUrl) {
  // Select:
  //  - any element with a class that contains 'alert'
  //  - literal <alert> tags
  const nodes = $("[class*='alert'], .alert, alert");
  const results = [];

  nodes.each((i, el) => {
    const $el = $(el);

    // Try to grab inner text and any link inside the alert
    const text = $el.text().trim().replace(/\s+/g, " ");
    const classList = ($el.attr("class") || "").trim();
    const tag = $el.get(0).tagName;

    // If there’s a <a> inside, capture its href & anchor text
    const links = [];
    $el.find("a[href]").each((_, a) => {
      const $a = $(a);
      links.push({
        text: $a.text().trim(),
        href: new URL($a.attr("href"), baseUrl).toString(),
      });
    });

    // Capture any data-* attributes that look relevant for an alert system
    const dataAttrs = {};
    for (const [k, v] of Object.entries($el.attr())) {
      if (k.startsWith("data-")) dataAttrs[k] = v;
    }

    results.push({
      tag,
      classList,
      text,
      links,
      data: dataAttrs,
    });
  });

  return results;
}

function writeJson(outdir, url, alerts) {
  ensureDir(outdir);

  // Make filename stable (no timestamp)
  const safeHost = new URL(url).hostname.replace(/[^a-z0-9.-]/gi, "_");
  const file = path.join(outdir, `alerts_${safeHost}_latest.json`);

  // Write (overwrites existing file)
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

// ---------- Core ----------
async function runOnce(url, ua, outdir) {
  log.info(`Fetching: ${url}`);
  const html = await fetchHtml(url, ua);
  const $ = cheerio.load(html);

  const alerts = serializeAlerts($, url);
  log.info(`Found ${alerts.length} alert node(s).`);

  const file = writeJson(outdir, url, alerts);
  log.info(`Wrote ${alerts.length} alert(s) to ${file}`);
}

async function main() {
  const { url, userAgent, outdir, watch } = argv;
  if (!watch) {
    await runOnce(url, userAgent, outdir);
    return;
  }

  // Polling mode
  log.info(`Watching ${url} every ${watch}s ... (Ctrl+C to stop)`);
  await runOnce(url, userAgent, outdir);
  const interval = setInterval(async () => {
    try {
      await runOnce(url, userAgent, outdir);
    } catch (e) {
      log.error(e, "Error during polling run");
    }
  }, watch * 1000);

  // Graceful exit
  process.on("SIGINT", () => {
    clearInterval(interval);
    log.info("Stopped.");
    process.exit(0);
  });
}

main().catch((e) => {
  log.error(e);
  process.exit(1);
});
main();
