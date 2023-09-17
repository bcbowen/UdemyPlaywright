const { test, expect } = require("@playwright/test");

test("Client App Login", async ({ page }) => {
  const productName = "zara coat 3";
  const userid = "anshika@gmail.com";
  const password = "Iamking@000";
  const products = page.locator(".card-body");
  await page.goto("https://rahulshettyacademy.com/client");
  await page.locator("#userEmail").type(userid);
  await page.locator("#userPassword").type(password);
  await page.locator("#login").click();
  await page.waitForLoadState("networkidle");

  await page.locator(".card-body b").first().waitFor();
  const count = await products.count();
  console.log(count);
  console.log(productName);
  //await page.pause();
  for (let i = 0; i < count; i++) {
    if ((await products.nth(i).locator("b").textContent()) === productName) {
      // add to cart
      await products.nth(i).locator("text= Add To Cart").click();
      console.log("found");
      break;
    }
  }
  await page.locator("[routerlink*='cart']").click();
  await page.locator("div li").first().waitFor();
  expect(
    page.locator(`h3:has-text("${productName}")`).isVisible()
  ).toBeTruthy();
});
