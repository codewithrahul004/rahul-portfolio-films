// vrgev.com is a "scroll to advance" deck: ten full-screen sections that
// change on the wheel, with their own transition. Each step is driven the
// way a visitor would (a wheel tick), and the real transition is captured
// as a frame sequence, then the section is held. Desktop and mobile.
const puppeteer = require('puppeteer-core');
const fs = require('fs'), path = require('path'); const {execSync} = require('child_process');
const OUT = path.join(__dirname, '..', 'public', 'vrg', 'site'); fs.mkdirSync(OUT, {recursive: true});
const BIN = execSync("find node_modules/.remotion -type f -perm +111 -name 'chrome-headless-shell*' | head -1", {cwd: path.join(__dirname, '..')}).toString().trim();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const browser = await puppeteer.launch({executablePath: BIN, headless: true, protocolTimeout: 180000, args: ['--no-sandbox', '--hide-scrollbars', '--disable-gpu']});
  for (const [dev, vp] of [['desktop', {width: 1920, height: 1080, deviceScaleFactor: 1}], ['mobile', {width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true}]]) {
    const page = await browser.newPage(); await page.setViewport(vp);
    if (dev === 'mobile') await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1');
    await page.goto('https://www.vrgev.com/', {waitUntil: 'domcontentloaded', timeout: 60000}).catch(() => {});
    await page.waitForNetworkIdle({idleTime: 1500, timeout: 30000}).catch(() => {}); await sleep(3500);
    const dir = path.join(OUT, `${dev}_seq`); fs.mkdirSync(dir, {recursive: true});
    let k = 0; const shot = async () => { await page.screenshot({path: path.join(dir, `f${String(k).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 92}); k++; };
    const marks = [];
    for (let s = 0; s < 10; s++) {
      marks.push(k);
      await page.screenshot({path: path.join(OUT, `${dev}_s${String(s).padStart(2, '0')}.jpg`), type: 'jpeg', quality: 92});
      for (let i = 0; i < 24; i++) { await shot(); await sleep(20); }       // the hold
      if (s === 9) break;
      await page.mouse.move(vp.width / 2, vp.height / 2);
      await page.mouse.wheel({deltaY: 600});
      if (dev === 'mobile') await page.keyboard.press('ArrowDown').catch(() => {});
      for (let i = 0; i < 40; i++) { await shot(); await sleep(16); }       // the transition
      await sleep(600);
    }
    fs.writeFileSync(path.join(OUT, `${dev}_marks.json`), JSON.stringify({marks, frames: k}));
    console.log(dev, 'frames', k, 'section starts', marks.join(' ')); await page.close();
  }
  await browser.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
