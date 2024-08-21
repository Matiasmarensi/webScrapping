import puppeteer from "puppeteer";
import ExcelJS from "exceljs";

const saveExcel = async (data) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("LinkedIn Links");

    worksheet.columns = [
      { header: "Name", key: "name", width: 30 },
      { header: "LinkedIn Link", key: "linkedinLink", width: 50 },
    ];

    data.forEach((item) => {
      worksheet.addRow({ name: item.name, linkedinLink: item.linkedinLink });
    });

    await workbook.xlsx.writeFile("linkedin_links.xlsx");
    console.log("Excel file created successfully!");
  } catch (error) {
    console.log("Error writing Excel file:", error);
  }
};

async function openBrowser() {
  const browser = await puppeteer.launch({
    headless: "new",
  });
  const page = await browser.newPage();
  await page.goto("https://cessi.org.ar/socios/");

  // Evaluar la página para extraer los enlaces
  const allLinks = await page.evaluate(() => {
    const elements = document.querySelectorAll(".row .col-6.col-md-2 a.w-100");
    const links = Array.from(elements).map((el) => el.href);
    return links;
  });

  let data = [];

  // Limitar a 2 elementos
  const limitedLinks = allLinks.slice(0, 2);

  for (const link of limitedLinks) {
    await page.goto(link);

    const linkedinLink = await page.evaluate(() => {
      const socialElements = document.querySelectorAll(".social-item a");
      const linkedinElement = Array.from(socialElements).find((el) => el.href.includes("linkedin.com"));
      return linkedinElement ? linkedinElement.href : null;
    });

    if (!linkedinLink) continue;

    const cleanedLink = linkedinLink.endsWith("/") ? linkedinLink.slice(0, -1) : linkedinLink;
    const name = cleanedLink.split("/").pop().split("?")[0];

    data.push({ name, linkedinLink });
    console.log({ name, linkedinLink });
  }

  await browser.close();
  await saveExcel(data);
}

openBrowser();
