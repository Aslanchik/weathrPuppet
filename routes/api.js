const express = require("express");
const router = express.Router();
const puppeteer = require("puppeteer");

router.post("/", async (req, res) => {
  const { location } = req.body;

  //   Need location name, temp, humidity, windspeed and Icon. split by current, day and night.
  let queryData = { };
  try {
    const browser = await puppeteer.launch({ headless:false, args:['--no-sandbox']});
    const page = await browser.newPage();
    await page.goto(`https://www.google.com/`, {waitUntil: 'networkidle2'});
    await page.waitForSelector('input[name=q]');
    await page.$eval('input[name=q]', (el, value) => el.value = value, `${location} weather`);
    await page.keyboard.press('Enter');
    await page.waitForSelector('#wob_tci');

    queryData['icon'] = await page.$eval('#wob_tci', el=>el.src);
    queryData['temp'] = await page.$eval('#wob_tm', el=>el.textContent);
    queryData['description'] = await page.$eval('#wob_dc', el=>el.textContent);
    queryData['humidity'] = await page.$eval('#wob_hm', el=>el.textContent);
    queryData['wind'] = await page.$eval('#wob_ws', el=>el.textContent);
    queryData['percipitation'] = await page.$eval('#wob_pp', el=>el.textContent);
    queryData['sample'] = await page.$eval('#wob_dts', el=>el.textContent);
    console.log(queryData);
    
  } catch (err) {
    console.log(err);
  }

});

module.exports = router;
