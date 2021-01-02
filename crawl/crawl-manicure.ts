import puppeteer from 'puppeteer';

const vgmUrl = 'https://shop.nailsjobs.com/pages/shop-the-look';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(vgmUrl);

  const links = await page.$$eval('img', elements => elements.filter(element => {
    console.log('element:', element)
    const parensRegex = /^((?!\().)*$/;
    // @ts-ignore
    // return element.href.includes('.mid') && parensRegex.test(element.textContent);
    // @ts-ignore
  }).map(element => element.href));

  links.forEach(link => console.log(link));

  await browser.close();
})();