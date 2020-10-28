const express = require("express");
const router = express.Router();
const puppeteer = require("puppeteer");

router.post("/", async (req, res) => {
  const { location } = req.body;

  //   Need location name, temp, humidity, windspeed and Icon. split by day and night
  let queryData = [];

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`https://www.accuweather.com/`);
    let input = await page.waitForSelector(".search-input");
    await page.$eval(
      "input[name=query]",
      (el, value) => (el.value = value),
      location
    );
    await page.keyboard.press(String.fromCharCode(13));
    await page.waitForNavigation();
    await page.click(".cur-con-weather-card");
    await page.waitForNavigation();
    let data = await page.evaluate(() => {});
  } catch (err) {
    console.log("error");
  }
});

module.exports = router;
