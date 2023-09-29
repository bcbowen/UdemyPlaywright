const { test, expect, request } = require("@playwright/test");
const { ApiUtils } = require("../utils/ApiUtils");
const loginPayload = {
  userEmail: "anishka@gmail.com",
  userPassword: "Iamking@000",
};
const orderPayload = {
  orders: [{ country: "India", productOrderedId: "64c1388c7244490f958d0955" }],
};
let response;
let apiContext;
let webContext;
test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  /*
  apiContext = await request.newContext();
  const apiUtils = new ApiUtils(apiContext, loginPayload);
  response = await apiUtils.createOrder(orderPayload);
  */
  const userid = "anshika@gmail.com";
  const password = "Iamking@000";
  await page.goto("https://rahulshettyacademy.com/client");
  await page.locator("#userEmail").type(userid);
  await page.locator("#userPassword").type(password);
  await page.locator("#login").click();
  await page.waitForLoadState("networkidle");
  await context.storageState({ path: "state.json" });
  await browser.newContext({ storageState: "state.json" });
  webContext = await browser.newContext({ storageState: "state.json" });
});

//test.beforeEach(async () => {});

test("Client App Login", async () => {
  const productName = "zara coat 3";
  const userid = "anshika@gmail.com";
  const password = "Iamking@000";
  const page = await webContext.newPage();
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
    userid
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
