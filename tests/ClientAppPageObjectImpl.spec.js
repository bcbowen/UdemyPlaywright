const { test, expect } = require("@playwright/test");
const { LoginPage } = require("../pageobjects/LoginPage");

test("Client App Login", async ({ page }) => {
  const productName = "zara coat 3";
  const username = "anshika@gmail.com";
  const password = "Iamking@000";
  const products = page.locator(".card-body");
  const loginPage = new LoginPage(page);
  loginPage.goTo();
  loginPage.validLogin(username, password);
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
  await page.locator("text=Checkout").click();
  await page.locator("[placeholder*='Country']").type("ind", { delay: 100 });
  const options = page.locator(".ta-results");
  await options.waitFor();
  const optionsCount = await options.locator("button").count();
  for (let i = 0; i < optionsCount; i++) {
    let text = await options.locator("button").nth(i).textContent();
    if (text === " India") {
      await options.locator("button").nth(i).click();
      break;
    }
  }

  await expect(page.locator(".user__name [type='text']").first()).toHaveText(
    username
  );
  await page.locator(".action__submit").click();

  await expect(page.locator(".hero-primary")).toHaveText(
    " Thankyou for the order. "
  );
  const orderNumber = await page
    .locator(".em-spacer-1 .ng-star-inserted")
    .textContent();
  console.log(orderNumber);

  // exercise: find order from order history and go to view order
  await page.locator("button[routerlink*='myorders']").click();
  // body > app-root > app-myorders > div.container.table-responsive.py-5 > table
  // body > app-root > app-myorders > div.container.table-responsive.py-5 > table > thead
  await page.locator("tbody").waitFor();
  const rows = await page.locator("tbody tr");

  for (let i = 0; i < (await rows.count()); ++i) {
    const rowOrderId = await rows.nth(i).locator("th").textContent();
    if (orderNumber.includes(rowOrderId)) {
      await rows.nth(i).locator("button").first().click();
      break;
    }
  }
  const orderIdDetails = await page.locator(".col-text").textContent();
  expect(orderNumber.includes(orderIdDetails)).toBeTruthy();
});
