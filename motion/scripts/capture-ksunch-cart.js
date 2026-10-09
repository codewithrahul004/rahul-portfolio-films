// The real add-to-cart via WooCommerce's own URL form, then the cart and
// checkout pages as the store renders them. Desktop and mobile.
const puppeteer = require('puppeteer-core');
const path = require('path'); const {execSync} = require('child_process');
const OUT = path.join(__dirname, '..', 'public', 'ksunch');
const BIN = execSync("find node_modules/.remotion -type f -perm +111 -name 'chrome-headless-shell*' | head -1", {cwd: path.join(__dirname, '..')}).toString().trim();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const BASE = 'https://olivedrab-woodpecker-732682.hostingersite.com';
(async () => {
  const browser = await puppeteer.launch({executablePath: BIN, headless: true, protocolTimeout: 180000, args: ['--no-sandbox', '--hide-scrollbars', '--disable-gpu']});
  for (const [dev, vp] of [['desktop', {width: 1920, height: 1080, deviceScaleFactor: 1}], ['mobile', {width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true}]]) {
    const page = await browser.newPage(); await page.setViewport(vp);
    if (dev === 'mobile') await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1');
    const settle = async () => { await page.waitForNetworkIdle({idleTime: 1200, timeout: 30000}).catch(() => {}); await sleep(2000); };
    await page.goto(`${BASE}/product/classic-navy-linen-blend-shirt/?add-to-cart=3056&variation_id=3058&attribute_pa_size=m`, {waitUntil: 'domcontentloaded', timeout: 60000}).catch(() => {});
    await settle();
    await page.screenshot({path: path.join(OUT, `${dev}_addtocart_after.jpg`), type: 'jpeg', quality: 92});
    await page.goto(`${BASE}/cart/`, {waitUntil: 'domcontentloaded', timeout: 60000}).catch(() => {}); await settle();
    await page.screenshot({path: path.join(OUT, `${dev}_cart.jpg`), type: 'jpeg', quality: 92});
    await page.goto(`${BASE}/checkout/`, {waitUntil: 'domcontentloaded', timeout: 60000}).catch(() => {}); await settle();
    await page.screenshot({path: path.join(OUT, `${dev}_checkout.jpg`), type: 'jpeg', quality: 92});
    console.log(dev, 'cart + checkout captured'); await page.close();
  }
  await browser.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
