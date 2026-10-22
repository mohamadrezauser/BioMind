const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--use-gl=swiftshader',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--enable-unsafe-swiftshader',
      '--window-size=1440,900'
    ]
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const logs = [];
  page.on('console', msg => logs.push(msg.text()));
  page.on('pageerror', err => logs.push('PAGEERROR: ' + err.message));
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle0', timeout: 60000 });
  // click "ورود به آزمایشگاه سه‌بعدی"
  await new Promise(r => setTimeout(r, 1500));
  const clicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent.includes('ورود به آزمایشگاه'));
    if (btn) { btn.click(); return true; }
    return false;
  });
  logs.push('clicked lab button: ' + clicked);
  await new Promise(r => setTimeout(r, 3500));
  await page.screenshot({ path: '/tmp/dashboard.png' });
  await page.screenshot({ path: '/tmp/lab.png' });
  console.log(JSON.stringify(logs, null, 2));
  await browser.close();
})();
