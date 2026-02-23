const puppeteer = require('puppeteer');

const BASE = 'http://localhost:3000';
const PATHS = ['/legal', '/privacy', '/accessibility', '/en/legal', '/en/privacy', '/en/accessibility'];

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  for (const path of PATHS) {
    const url = BASE + path;
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await page.waitForSelector('h1', { timeout: 5000 }).catch(() => {});
      const h1 = await page.$$eval('h1', els => els.map(e => e.textContent.trim()));
      const h2 = await page.$$eval('h2', els => els.map(e => e.textContent.trim()));
      console.log('URL:', url);
      console.log('  h1:', h1.length ? h1.join(' | ') : '(no h1 found)');
      if (h2.length) {
        console.log('  h2 (first 5):', h2.slice(0, 5).join(' | '));
      } else {
        console.log('  h2: (none found)');
      }
    } catch (err) {
      console.error('Error loading', url, err.message);
    }
    console.log('---');
  }
  await browser.close();
})();
