'use strict';
const chromium = require('chrome-aws-lambda');

const URL = 'https://escolavirtual.pt';

async function trackStudent(username, password) {
  let browser;
  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage();
    page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    });

    // visit page
    await page.goto(URL);
    // await page.screenshot({ path: 'step-1.png' });

    // click on the login button
    const [buttonEntrar] = await page.$x("//a[contains(., 'Entrar')]");
    await buttonEntrar.click();

    // wait for the login form
    await page.waitForSelector('#username');
    // await page.screenshot({ path: 'step-2.png' });

    // fill the inputs
    await page.$eval('#username', (el, x) => el.value = x, username);
    await page.$eval('#password', (el, x) => el.value = x, password);

    // click to confirm the login
    const buttonEntrar2 = await page.$('#kc-login');
    await buttonEntrar2.click();

    // wait for the home page
    await page.waitForSelector('#dashboard-student');
    // await page.screenshot({ path: 'step-3.png' });

    // get student's name
    const nameEl = await page.$('h1.welcome-title');
    let welcomeText = await page.evaluate(el => el.textContent, nameEl);
    console.log(welcomeText);
    const namePattern = /Olá, (.+)\!/;
    const [, name] = namePattern.exec(welcomeText);

    // get student's points
    const pointsEl = await page.$('#gami-point .gami-item');
    let pointsText = await page.evaluate(el => el.textContent, pointsEl)
    const numberPattern = /(\d+)/;
    const [, points] = numberPattern.exec(pointsText);

    return {
      name,
      points
    };
  } finally {
    if (browser) {
      browser.close();
    }
  }
}

module.exports = {
  trackStudent,
};
