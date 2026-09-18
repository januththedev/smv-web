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

  // Live site preview rendered inside admin?
  console.log("preview hero:", await page.locator('.admin-preview [data-admin-section="hero"]').count());
  console.log("preview sections:", await page.locator(".admin-preview [data-admin-section]").count());

  // Click the about section -> section drawer opens
  await page.locator('.admin-preview [data-admin-section="about"]').click();
  await page.waitForSelector('text=01 · The house of iron');
  const aboutValue = await page.locator('aside input').first().inputValue();
  console.log("about title field:", aboutValue.slice(0, 40));
  await page.screenshot({ path: "screenshots/admin-section-drawer.png" });
  await page.click('button[aria-label="Close editor"]');

  // Click a program card -> item editor opens
  await page.locator('.admin-preview [data-admin-collection="programs"]').first().click();
  await page.waitForSelector('text=Save item');
  console.log("item editor opened");
  await page.screenshot({ path: "screenshots/admin-edit-item.png" });
  await page.click('button[aria-label="Cancel edit"]');

  // Programs drawer -> Add item form
  await page.locator('.admin-preview [data-admin-section="programs"]').click();
  await page.click('button:has-text("Add item")');
  await page.waitForSelector('text=Add to website');
  console.log("add form opened");
  await page.screenshot({ path: "screenshots/admin-add-item.png" });

  console.log("console errors:", consoleErrors.length ? consoleErrors : "none");
  console.log("ADMIN-QA-OK");
} finally {
  await browser.close();
}
