import puppeteer from "puppeteer";

async function openBrowser() {
  const browser = await puppeteer.launch({
    headless: "new",
  });
  const page = await browser.newPage();
  await page.goto("https://cessi.org.ar/socios/");

  // Evaluar la página para extraer los enlaces
  const allLinks = await page.evaluate(() => {
    // Seleccionar todos los elementos que cumplen con los criterios
    const elements = document.querySelectorAll(".row .col-6.col-md-2 a.w-100");

    // Extraer los href de cada enlace
    const links = Array.from(elements).map((el) => el.href);

    return links;
  });

  for (const link of allLinks) {
    await page.goto(link);

    const linkedinLink = await page.evaluate(() => {
      // Seleccionar todos los elementos con la clase "social-item" que contienen enlaces
      const socialElements = document.querySelectorAll(".social-item a");

      // Buscar el enlace que contenga "linkedin.com" en su href
      const linkedinElement = Array.from(socialElements).find((el) => el.href.includes("linkedin.com"));

      return linkedinElement ? linkedinElement.href : null;
    });

    console.log(`LinkedIn link on ${link}: ${linkedinLink}`);
  }

  await browser.close();
}

openBrowser();
