const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader', '--window-size=1440,900']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const errors = [];
  page.on('pageerror', err => errors.push('PAGEERROR: ' + err.message));

  await page.goto('http://localhost:4173', { waitUntil: 'networkidle0', timeout: 60000 });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: '_debug_shots/01_dashboard.png' });

  const clickByText = async (text) => page.evaluate((t) => {
    const els = Array.from(document.querySelectorAll('button'));
    const el = els.find(b => b.textContent.includes(t));
    if (el) { el.click(); return true; }
    return false;
  }, text);

  await clickByText('ورود به آزمایشگاه سه‌بعدی');
  await new Promise(r => setTimeout(r, 2500));
  await page.screenshot({ path: '_debug_shots/02_lab_default.png' });

  await clickByText('فهرست ارگان‌ها');
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: '_debug_shots/03_lab_list.png' });

  // click organ 'کبد' in list
  await clickByText('کبد');
  await new Promise(r => setTimeout(r, 1500));
  await clickByText('اطلاعات');
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: '_debug_shots/04_lab_liver_info.png' });

  await clickByText('کنترل‌ها');
  await new Promise(r => setTimeout(r, 300));
  await clickByText('نمای انفجاری');
  await new Promise(r => setTimeout(r, 1800));
  await page.screenshot({ path: '_debug_shots/05_exploded.png' });
  await clickByText('نمای انفجاری');
  await new Promise(r => setTimeout(r, 1200));

  await clickByText('حالت شفاف');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: '_debug_shots/06_transparent.png' });
  await clickByText('حالت شفاف');

  await clickByText('مسیر غذا');
  await new Promise(r => setTimeout(r, 300));
  await clickByText('شروع مسیر غذا');
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: '_debug_shots/07_journey.png' });

  await clickByText('تور آموزشی');
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: '_debug_shots/08_tour_panel.png' });

  await clickByText('آزمون');
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: '_debug_shots/09_quiz.png' });

  // navigate pages
  await page.evaluate(() => {
    const els = Array.from(document.querySelectorAll('button'));
    const el = els.find(b => b.textContent.trim() === 'درس‌نامه');
    if (el) el.click();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: '_debug_shots/10_lessons.png' });

  await page.evaluate(() => {
    const els = Array.from(document.querySelectorAll('button'));
    const el = els.find(b => b.textContent.trim() === 'پیشرفت من');
    if (el) el.click();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: '_debug_shots/11_progress.png' });

  await page.evaluate(() => {
    const els = Array.from(document.querySelectorAll('button'));
    const el = els.find(b => b.textContent.trim() === 'درباره');
    if (el) el.click();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: '_debug_shots/12_about.png' });

  // mobile viewport check
  await page.setViewport({ width: 390, height: 844 });
  await page.evaluate(() => {
    const els = Array.from(document.querySelectorAll('button'));
    const el = els.find(b => b.textContent.trim() === 'آزمایشگاه آناتومی');
    if (el) el.click();
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: '_debug_shots/13_mobile_lab.png' });

  console.log('ERRORS:', JSON.stringify(errors));
  await browser.close();
})();
