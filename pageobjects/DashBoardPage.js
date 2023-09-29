class DashBoardPage {
  constructor(page) {
    this.products = page.locator(".card-body");
    this.productsText = page.locator(".card-body b");
    this.cart = page.locator("[routerlink*='cart']");
  }

  async searchProductAddCart(productName) {
    const titles = await this.productsText.allTextContents();
    console.log(titles);
    const count = await products.count();
    //console.log(count);
    //console.log(productName);
    //await page.pause();
    for (let i = 0; i < count; i++) {
      if ((await products.nth(i).locator("b").textContent()) === productName) {
        // add to cart
        await products.nth(i).locator("text= Add To Cart").click();
        console.log("found");
        break;
      }
    }
  }

  async navigateToCart() {
    await this.cart.click();
  }
}

module.exports = { DashBoardPage };
