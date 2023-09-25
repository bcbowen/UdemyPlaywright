const { test, expect } = require("@playwright/test");

test("Security test request intercept", async ({ page }) => {
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
  await page.locator("button[routerlink*='myorders']").click();
  await page.route(
    "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
    (route) => {
      route.continue({
        url: "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=1234567890abcdef",
      });
    }
  );
  await page.locator("button:has-text('View')").first().click();
  await expect(page.locator("p").last()).toHaveText(
    "You are not authorize to view this order"
  );
});
