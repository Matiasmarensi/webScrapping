import puppeteer from "puppeteer";

async function openBrowser() {
  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://cessi.org.ar/socios/");
    await browser.close();
  })();
}

openBrowser();
