import puppeteer from "puppeteer";

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });
await page.screenshot({ path: "screenshot.png", fullPage: false });
await browser.close();
console.log("Screenshot saved to screenshot.png");
