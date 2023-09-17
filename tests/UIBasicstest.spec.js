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

test("UI Controls 17-", async ({ page }) => {
  const userField = page.locator("#username");
  const submit = page.locator("#signInBtn");
  const documentLink = page.locator("[href*='documents-request']");
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
  await expect(documentLink).toHaveAttribute("class", "blinkingText");
  //<a href="https://rahulshettyacademy.com/documents-request" class="blinkingText" target="_blank">Free Access to InterviewQues/ResumeAssistance/Material</a>
  await expect(documentLink).toHaveText(
    "Free Access to InterviewQues/ResumeAssistance/Material"
  );
  //await page.pause();
});

test("Child Window handling", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://rahulshettyacademy.com/loginpagePractise");
  const documentLink = page.locator("[href*='documents-request']");
  const [newPage] = await Promise.all([
    context.waitForEvent("page"),
    documentLink.click(),
  ]);
  const text = await newPage.locator(".red").textContent();
  // text: Please email us at mentor@rahulshettyacademy.com with below template to receive response
  // split domain from text
  const arrayText = text.split("@");
  const domain = arrayText[1].split(" ")[0];
  console.log(text);
  console.log(domain);
  await page.locator("#username").type(domain);
  await page.pause();
});
