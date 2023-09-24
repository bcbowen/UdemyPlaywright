const { test, expect, request } = require("@playwright/test");
const { ApiUtils } = require("./utils/ApiUtils");
const loginPayload = {
  userEmail: "anishka@gmail.com",
  userPassword: "Iamking@000",
};
const orderPayload = {
  orders: [{ country: "India", productOrderedId: "64c1388c7244490f958d0955" }],
};
let fakePayloadOrders = { data: [], message: "No Orders" };
let response;
let apiContext;
const getCustomerOrdersUrl =
  "https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*";
test.beforeAll(async () => {
  apiContext = await request.newContext();
  const apiUtils = new ApiUtils(apiContext, loginPayload);
  response = await apiUtils.createOrder(orderPayload);
});

//test.beforeEach(async () => {});

test("Client App Login", async ({ page }) => {
  const Utils = new ApiUtils(apiContext);
  page.addInitScript((value) => {
    window.localStorage.setItem("token", value);
  }, response.token);
  const productName = "zara coat 3";
  const userid = "anshika@gmail.com";
  const password = "Iamking@000";
  const products = page.locator(".card-body");
  await page.goto("https://rahulshettyacademy.com/client");

  await page.route(getCustomerOrdersUrl, async (route) => {
    const response = await page.request.fetch(route.request());
    let body = JSON.stringify(fakePayloadOrders);
    route.fulfill({
      response,
      body,
    });
  });

  // exercise: find order from order history and go to view order
  await page.locator("button[routerlink*='myorders']").click();
  await page.waitForResponse(getCustomerOrdersUrl);

  // without the following line 0 rows will be found:
  await page.locator("tbody").waitFor();
  const orderRows = await page.locator("table.ng-star-inserted tbody tr");
});
