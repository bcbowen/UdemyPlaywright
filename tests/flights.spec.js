const { test, expect } = require("@playwright/test");

test.only('Clicking Round Trip enables return date', async ( {page}) => {
    const url = "https://rahulshettyacademy.com/dropdownsPractise/"; 
    await page.goto(url); 
    await page.getByRole("radio").nth(1).click(); 
    await page.pause(); 
}); 