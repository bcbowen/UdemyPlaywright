const { test, expect } = require("@playwright/test");
const { PageObjectManager } = require("../pageobjects/PageObjectManager");

test("Client App Login", async ({ page }) => {
  const pageObjectManager = new PageObjectManager(page);
  //js file- Login js, DashboardPage
  const username = "anshika@gmail.com";
  const password = "Iamking@000"
  const productName = 'Zara Coat 4';
  const products = page.locator(".card-body");
  const loginPage = pageObjectManager.getLoginPage();
  await loginPage.goTo();
  await loginPage.validLogin(username, password);
  const dashboardPage = pageObjectManager.getDashboardPage();
  await dashboardPage.searchProductAddCart(productName);
  await dashboardPage.navigateToCart();

  const cartPage = pageObjectManager.getCartPage();
  await cartPage.VerifyProductIsDisplayed(productName);
  await cartPage.Checkout();

  const ordersReviewPage = pageObjectManager.getOrdersReviewPage();
  await ordersReviewPage.searchCountryAndSelect("ind", "India");
  const orderId = await ordersReviewPage.SubmitAndGetOrderId();
  console.log(orderId);
  await dashboardPage.navigateToOrders();
  const ordersHistoryPage = pageObjectManager.getOrdersHistoryPage();
  await ordersHistoryPage.searchOrderAndSelect(orderId);
  expect(orderId.includes(await ordersHistoryPage.getOrderId())).toBeTruthy();
});
