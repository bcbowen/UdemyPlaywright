const { test, expect } = require("@playwright/test");
const { PageObjectManager } = require("../pageobjects/PageObjectManager");
const dataSet = JSON.parse(JSON.stringify(require("../utils/placeOrderTestData.json")));

for (data of dataSet) {
  test(`Client App Login for ${data.productName}`, async ({ page }) => {
    const pageObjectManager = new PageObjectManager(page);

    const products = page.locator(".card-body");
    const loginPage = pageObjectManager.getLoginPage();
    await loginPage.goTo();
    await loginPage.validLogin(dataSet.username, dataSet.password);
    const dashboardPage = pageObjectManager.getDashboardPage();
    await dashboardPage.searchProductAddCart(dataSet.productName);
    await dashboardPage.navigateToCart();

    const cartPage = pageObjectManager.getCartPage();
    await cartPage.VerifyProductIsDisplayed(dataSet.productName);
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

}
