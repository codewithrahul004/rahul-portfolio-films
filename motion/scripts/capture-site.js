// Captures the live editlobby.com in headless Chromium: real pixels of the
// real site, nothing recreated. Desktop and mobile full pages, the hero's
// entrance as a frame sequence, and a smooth scroll as a frame sequence.
const puppeteer = require('puppeteer-core');
const fs = require('fs'), path = require('path');
const {execSync} = require('child_process');
const OUT = path.join(__dirname, '..', 'public', process.env.CAP_OUT || 'el');
const BIN = execSync("find node_modules/.remotion -type f -perm +111 -name 'chrome-headless-shell*' | head -1", {cwd: path.join(__dirname, '..')}).toString().trim();
const URL = process.env.CAP_URL || 'https://editlobby.com/';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({executablePath: BIN, headless: true, protocolTimeout: 180000, args: ['--no-sandbox', '--hide-scrollbars', '--disable-gpu', '--font-render-hinting=none']});
  const seq = async (page, dir, count, step) => {
    fs.mkdirSync(path.join(OUT, dir), {recursive: true});
    for (let i = 0; i < count; i++) {
      await step(i);
      await page.screenshot({path: path.join(OUT, dir, `f${String(i).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 92});
    }
  };
  const ONLY = process.argv[2];
  for (const [name, vp] of [['desktop', {width: 1920, height: 1080, deviceScaleFactor: 1}], ['mobile', {width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true}], ['tablet', {width: 1024, height: 1366, deviceScaleFactor: 1, isMobile: true, hasTouch: true}]]) {
    if (ONLY && name !== ONLY) continue;
    const page = await browser.newPage();
    await page.setViewport(vp);
    if (name === 'tablet') await page.setUserAgent('Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1');
    if (name === 'mobile') await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1');
    // the entrance: frames from the moment of navigation
    const nav = page.goto(URL, {waitUntil: 'domcontentloaded', timeout: 60000});
    await seq(page, `${name}_enter`, name === 'desktop' ? 90 : 60, async () => sleep(33));
    await nav.catch(() => {});
    await page.waitForNetworkIdle({idleTime: 1500, timeout: 30000}).catch(() => {});
    await sleep(1500);
    // a marketing popup ("GET 30% OFF") covers the mobile page; it is removed
    // from the DOM for the capture, nothing else on the page is touched
    const dismissPopups = () => page.evaluate(() => {
      for (const el of Array.from(document.querySelectorAll('div, section, aside'))) {
        const t = (el.innerText || '').trim();
        if (/GET 30% OFF/i.test(t) && t.length < 200) { let n = el; while (n.parentElement && n.parentElement !== document.body && getComputedStyle(n).position !== 'fixed') n = n.parentElement; if (getComputedStyle(n).position === 'fixed') { n.style.display = 'none'; return true; } }
      }
      return false;
    });
    await dismissPopups(); await sleep(300);
    const H = await page.evaluate(() => document.documentElement.scrollHeight);
    console.log(name, 'page height', H);
    // full page, scrolled through first so lazy sections have loaded
    for (let y = 0; y < H; y += vp.height) { await page.evaluate((y) => window.scrollTo(0, y), y); await sleep(250); }
    await page.evaluate(() => window.scrollTo(0, 0)); await sleep(800);
    await page.screenshot({path: path.join(OUT, `${name}_full.jpg`), type: 'jpeg', quality: 92, fullPage: true});
    await page.screenshot({path: path.join(OUT, `${name}_hero.jpg`), type: 'jpeg', quality: 92});
    // a slow scroll, eased, as a frame sequence at 30 fps
    const frames = name === 'desktop' ? 360 : 240;
    const maxY = Math.max(0, H - vp.height);
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    await seq(page, `${name}_scroll`, frames, async (i) => {
      const y = Math.round(ease(i / (frames - 1)) * Math.min(maxY, name === 'desktop' ? 5200 : 6000));
      await page.evaluate((y) => window.scrollTo(0, y), y);
      await sleep(20);
    });
    await page.close();
  }
  await browser.close();
  console.log('captured to', OUT);
})().catch((e) => { console.error(e); process.exit(1); });
