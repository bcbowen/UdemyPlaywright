const { test, expect } = require("@playwright/test");

test("Assignment 1", async ({ page }) => {
  const userid = "anshika@gmail.com";
  const password = "Iamking@000";
  await page.goto("https://rahulshettyacademy.com/client");
  await page.locator("#userEmail").type(userid);
  await page.locator("#userPassword").type(password);
  await page.locator("#login").click();
  //console.log(await page.locator(".card-body h5 b").first().textContent());
  //await expect(page.locator(".card-body h5 b").first()).toContainText("zara");
  // alternate:
  await page.locator(".card-body b").first().waitFor();
  const titles = await page.locator(".card-body b").allTextContents();
  console.log(titles);
});
