// drinkfunc.shop (Wix): waits past the site's loader before any frame is
// taken, then captures home, the shop, a product page, and the real
// add-to-cart and cart. Desktop and mobile. Real pixels only.
const puppeteer = require('puppeteer-core');
const fs = require('fs'), path = require('path');
const {execSync} = require('child_process');
const OUT = path.join(__dirname, '..', 'public', 'func');
const BIN = execSync("find node_modules/.remotion -type f -perm +111 -name 'chrome-headless-shell*' | head -1", {cwd: path.join(__dirname, '..')}).toString().trim();
fs.mkdirSync(OUT, {recursive: true});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const PAGES = {
  home: 'https://www.drinkfunc.shop/',
  shop: 'https://www.drinkfunc.shop/category/all-products',
  product: 'https://www.drinkfunc.shop/product-page/func-cola-pack-of-4',
  grape: 'https://www.drinkfunc.shop/product-page/func-grape-flavour-drink',
};
(async () => {
  const browser = await puppeteer.launch({executablePath: BIN, headless: true, protocolTimeout: 180000, args: ['--no-sandbox', '--hide-scrollbars', '--disable-gpu']});
  const seq = async (page, dir, count, step) => { fs.mkdirSync(path.join(OUT, dir), {recursive: true}); for (let i = 0; i < count; i++) { await step(i); await page.screenshot({path: path.join(OUT, dir, `f${String(i).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 92}); } };
  const ONLY = process.argv[2];
  for (const [dev, vp] of [['desktop', {width: 1920, height: 1080, deviceScaleFactor: 1}], ['mobile', {width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true}]]) {
    if (ONLY && dev !== ONLY) continue;
    const page = await browser.newPage();
    await page.setViewport(vp);
    if (dev === 'mobile') await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1');
    const settle = async () => {
      await page.waitForNetworkIdle({idleTime: 1500, timeout: 30000}).catch(() => {});
      await sleep(4500); /* the loader */
      // the 15% promo lightbox: closed with its own close button, as a visitor would
      for (let k = 0; k < 3; k++) {
        const closed = await page.evaluate(() => {
          const b = Array.from(document.querySelectorAll('button,[role="button"],[aria-label]')).find((e) => /close/i.test(e.getAttribute('aria-label') || '') && e.getBoundingClientRect().width > 0);
          if (b) { b.click(); return true; } return false;
        });
        if (!closed) break; await sleep(900);
      }
      await page.keyboard.press('Escape').catch(() => {}); await sleep(500);
      await page.evaluate(() => {
        for (const el of Array.from(document.querySelectorAll('div,section'))) {
          const t = (el.innerText || '').trim();
          if (/GET 15% OFF/i.test(t) && /USE CODE/i.test(t) && t.length < 120) {
            let n = el; while (n.parentElement && n.parentElement !== document.body && getComputedStyle(n).position !== 'fixed') n = n.parentElement;
            if (getComputedStyle(n).position === 'fixed') n.style.display = 'none';
          }
        }
        for (const el of Array.from(document.querySelectorAll('[role="dialog"],[data-testid*="lightbox" i],[id*="lightbox" i]'))) el.style.display = 'none';
        document.body.style.overflow = 'auto';
      });
      await sleep(400);
    };
    for (const [name, url] of Object.entries(PAGES)) {
      if (process.env.ONLY_PAGE && name !== process.env.ONLY_PAGE) continue;
      await page.goto(url, {waitUntil: 'domcontentloaded', timeout: 60000}).catch(() => {});
      await settle();
      const H = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < H; y += vp.height) { await page.evaluate((y) => window.scrollTo(0, y), y); await sleep(200); }
      await page.evaluate(() => window.scrollTo(0, 0)); await sleep(800);
      await page.screenshot({path: path.join(OUT, `${dev}_${name}_full.jpg`), type: 'jpeg', quality: 92, fullPage: true});
      await page.screenshot({path: path.join(OUT, `${dev}_${name}_hero.jpg`), type: 'jpeg', quality: 92});
      const frames = dev === 'desktop' ? 300 : 200;
      const maxY = Math.max(0, H - vp.height);
      const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
      await seq(page, `${dev}_${name}_scroll`, frames, async (i) => { await page.evaluate((y) => window.scrollTo(0, y), Math.round(ease(i / (frames - 1)) * Math.min(maxY, dev === 'desktop' ? 4200 : 5000))); await sleep(16); });
      console.log(dev, name, 'height', H);
    }
    if (process.env.ONLY_PAGE) { await page.close(); continue; }
    // the real add to cart: on the product page, click the button, then the cart
    await page.goto(PAGES.product, {waitUntil: 'domcontentloaded', timeout: 60000}).catch(() => {});
    await settle();
    const btn = await page.evaluateHandle(() => Array.from(document.querySelectorAll('button')).find((b) => /add to cart/i.test(b.innerText)));
    const el = btn.asElement();
    if (el) {
      await el.evaluate((b) => b.scrollIntoView({block: 'center'})); await sleep(600);
      await page.screenshot({path: path.join(OUT, `${dev}_addtocart_before.jpg`), type: 'jpeg', quality: 92});
      await el.click(); await sleep(2500);
      await page.screenshot({path: path.join(OUT, `${dev}_addtocart_after.jpg`), type: 'jpeg', quality: 92});
      await page.goto('https://www.drinkfunc.shop/cart-page', {waitUntil: 'domcontentloaded', timeout: 60000}).catch(() => {});
      await settle();
      await page.screenshot({path: path.join(OUT, `${dev}_cart.jpg`), type: 'jpeg', quality: 92});
      console.log(dev, 'cart captured');
    } else console.log(dev, 'no add to cart button found');
    await page.close();
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
