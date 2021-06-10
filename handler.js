'use strict';
require('dotenv').config();
const chromium = require('chrome-aws-lambda');
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

const client = new SNSClient();

async function getPoints(username, password) {
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

    await page.goto('https://escolavirtual.pt');
    // await page.screenshot({ path: 'step-1.png' });

    const [buttonEntrar] = await page.$x("//a[contains(., 'Entrar')]");
    await buttonEntrar.click();

    await page.waitForSelector('#username');
    // await page.screenshot({ path: 'step-2.png' });

    await page.$eval('#username', (el, x) => el.value = x, username);
    await page.$eval('#password', (el, x) => el.value = x, password);
    const buttonEntrar2 = await page.$('#kc-login');
    await buttonEntrar2.click();

    await page.waitForSelector('#dashboard-student');
    // await page.screenshot({ path: 'step-3.png' });

    const nameEl = await page.$('h1.welcome-title');
    let welcomeText = await page.evaluate(el => el.textContent, nameEl);
    console.log(welcomeText);
    const namePattern = /Olá, (.+)\!/;
    const [, name] = namePattern.exec(welcomeText);

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

async function sendNotification(subject, text) {
  const params = {
    Subject: subject,
    Message: text,
    TopicArn: process.env.SNS_TOPIC_ARN,
  };
  const command = new PublishCommand(params);
  const result = await client.send(command);
  console.log(result);
}

module.exports.main = async (event) => {
  const { name, points } = await getPoints(process.env.EV_USERNAME, process.env.EV_PASSWORD);
  const text = `${name} tem ${points} pontos em ${new Date().toLocaleString()}`;
  await sendNotification(`Pontos de ${name}`, text);
  return {
    message: text,
  };
};
