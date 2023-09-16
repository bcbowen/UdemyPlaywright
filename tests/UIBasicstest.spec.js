const { test, expect } = require("@playwright/test");

test("Browser Context Playwright test", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  const userField = page.locator("#username");
  const submit = page.locator("#signInBtn");
  await page.goto("https://rahulshettyacademy.com/loginpagePractise");
  // css selector
  await userField.type("ass face");
  await page.locator("[type='password']").type("learning");
  await submit.click();
  await expect(await page.locator("[style*='block']")).toContainText(
    "Incorrect"
  );

  // clear
  await userField.fill("");
  await userField.fill("rahulshettyacademy");
  await submit.click();
  console.log(await page.locator(".card-body a").nth(0).textContent());
});

test("First Playwright test", async ({ page }) => {
  await page.goto("https://google.com");
  // get title - assertion
  console.log(await page.title());
  await expect(page).toHaveTitle("Google");
});

test.only("UI Controls 17-", async ({ page }) => {
  const userField = page.locator("#username");
  const submit = page.locator("#signInBtn");
  await page.goto("https://rahulshettyacademy.com/loginpagePractise");
  const dropdown = page.locator("select.form-control");
  await dropdown.selectOption("consult");
  await page.locator(".radiotextsty").last().click();
  await page.locator("#okayBtn").click();
  await expect(page.locator(".radiotextsty").last()).toBeChecked();
  console.log(await page.locator(".radiotextsty").last().isChecked());
  await page.locator("#terms").click();
  await expect(page.locator("#terms")).toBeChecked();
  await page.locator("#terms").uncheck();
  expect(await page.locator("#terms").isChecked()).toBeFalsy();
  //await page.pause();
});
