/* One-off interactive QA of the /admin click-to-edit UI against the local dev server. */
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

const base = "http://127.0.0.1:8080";
mkdirSync("screenshots", { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const consoleErrors = [];
page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
page.on("pageerror", (error) => consoleErrors.push(String(error)));

try {
  await page.goto(`${base}/admin`, { waitUntil: "networkidle" });
  await page.fill('input[type="password"]', process.env.ADMIN_PASSWORD_QA ?? "smv-admin-qa-9182");
  await page.click('button:has-text("Open admin")');
  await page.waitForSelector('text=Website control', { timeout: 15000 });
  await page.screenshot({ path: "screenshots/admin-top.png" });

  // Section editors rendered?
  const pageTextCount = await page.locator('input[value*="The house of iron"]').count();
  console.log("home.about.title editor present:", pageTextCount > 0);

  // Gallery card + item rows
  const galleryCard = page.locator('section', { hasText: 'Gallery (photos & videos)' }).first();
  console.log("gallery card:", await galleryCard.count());
  console.log("gallery Edit buttons:", await galleryCard.locator('button:has-text("Edit")').count());

  // Open the first gallery item editor
  await galleryCard.locator('button:has-text("Edit")').first().click();
  await page.waitForSelector('text=Save item');
  const srcValue = await page.locator('section:has-text("Gallery (photos & videos)") input').first().inputValue();
  console.log("first gallery src field:", srcValue.slice(0, 60));
  await page.screenshot({ path: "screenshots/admin-edit-item.png" });
  await page.click('button[aria-label="Cancel edit"]');

  // Add-item form
  await galleryCard.locator('button:has-text("Add item")').click();
  await page.waitForSelector('text=Add to website');
  console.log("add form opened with fields:", await galleryCard.locator('select').count(), "select;",
    await galleryCard.locator('input[type="file"]').count(), "file input");
  await page.screenshot({ path: "screenshots/admin-add-item.png" });
  await page.click('button[aria-label="Cancel edit"]');

  console.log("console errors:", consoleErrors.length ? consoleErrors : "none");
  console.log("ADMIN-QA-OK");
} finally {
  await browser.close();
}
