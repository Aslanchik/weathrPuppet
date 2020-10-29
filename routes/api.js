const express = require("express");
const router = express.Router();
const puppeteer = require("puppeteer");

router.post("/", async (req, res) => {
  const { location } = req.body;

  let queryData = {};

  try {
    // Init puppeteer and go to google.com for weather data
    const browser = await puppeteer.launch({ args:['--no-sandbox']});
    const page = await browser.newPage();
    await page.goto(`https://www.google.com/`, {waitUntil: 'networkidle2'});
    await page.waitForSelector('input[name=q]');
    await page.$eval('input[name=q]', (el, value) => el.value = value, `${location} weather`);
    await page.keyboard.press('Enter');
    await page.waitForSelector('#wob_tci');

    // Get values from page and assign them to keys inside the queryData object
    queryData['icon'] = await page.$eval('#wob_tci', el=> el.src);
    queryData['location'] = await page.$eval('#wob_loc', el=> el.textContent);
    queryData['tempC'] = await page.$eval('#wob_tm', el=> el.textContent);
    queryData['tempF'] = await page.$eval('#wob_ttm', el=> el.textContent);
    queryData['description'] = await page.$eval('#wob_dc', el=> el.textContent);
    queryData['humidity'] = await page.$eval('#wob_hm', el=> el.textContent);
    queryData['wind'] = await page.$eval('#wob_ws', el=> el.textContent);
    queryData['percipitation'] = await page.$eval('#wob_pp', el=>el.textContent);
    queryData['lastUpdated'] = await page.$eval('#wob_dts', el=> el.textContent);

    // Once all promises resolve, send complete object to client 
    res.status(200).json(queryData);
  } catch (err) {
    res.status(400).json({message: err});
  }
});

module.exports = router;
