// render.mjs — renders the Man Your Post social cards + popup screenshots.
// Usage: node render.mjs [cards|popup|all]
import puppeteer from "puppeteer-core";
import fs from "fs"; import path from "path"; import url from "url";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const DIR = path.dirname(url.fileURLToPath(import.meta.url));
const what = process.argv[2] || "all";
const F = '<link href="https://fonts.googleapis.com/css2?family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&family=Source+Sans+3:wght@400;600;700;800&display=swap" rel="stylesheet">';
const A = (f) => "file://" + path.join(DIR, f);
const COVER = A("assets/cover.jpg");
const baseCss = `
*{box-sizing:border-box;margin:0;padding:0}
body{background:#0b0a08;color:#f4ecd9;font-family:'Source Sans 3',Arial,sans-serif;-webkit-font-smoothing:antialiased}
.c{position:relative;overflow:hidden;background:#0b0a08}
.bg{position:absolute;left:0;right:0;background-repeat:no-repeat}
.shade{position:absolute;inset:0}
.ser{font-family:'Libre Caslon Text',Georgia,serif;text-wrap:balance}
.gold{color:#d9b45f}
.eb{font-weight:800;letter-spacing:.28em;text-transform:uppercase;color:#c9a24e;display:flex;align-items:center;gap:18px}
.eb:before,.eb:after{content:'';height:2px;flex:1;background:linear-gradient(90deg,transparent,rgba(201,162,78,.7))}
.eb:after{background:linear-gradient(90deg,rgba(201,162,78,.7),transparent)}
.eb.l:before{display:none}
.cv{border-radius:3px;box-shadow:0 18px 40px rgba(0,0,0,.75),0 0 0 1px rgba(201,162,78,.4),0 0 70px rgba(201,162,78,.22)}
.free{display:inline-block;background:#c9a24e;color:#14110b;font-weight:800;letter-spacing:.18em;text-transform:uppercase;border-radius:3px}
.mark{font-weight:700;letter-spacing:.3em;text-transform:uppercase;color:#a99a76}
`;
const cards = {
  // 1080x1350 — Instagram/Facebook feed (portrait)
  "feed-1080x1350": { w:1080, h:1350, html: `
<div class="c" style="width:1080px;height:1350px">
 <div class="bg" style="top:-330px;height:1650px;background-image:url(${A("art/watchman-gate.jpg")});background-size:1100px auto;background-position:center top"></div>
 <div class="shade" style="background:linear-gradient(180deg,rgba(8,7,5,.92) 0%,rgba(8,7,5,.55) 28%,rgba(8,7,5,0) 46%,rgba(8,7,5,0) 64%,rgba(8,7,5,.9) 80%,#0b0a08 88%)"></div>
 <div style="position:absolute;top:84px;left:80px;right:80px;text-align:center">
  <div class="eb" style="font-size:20px;margin-bottom:34px">To the men of the house</div>
  <div class="ser" style="font-size:64px;line-height:1.12;font-weight:700">Liberalism may be winning in our government.</div>
  <div class="ser gold" style="font-size:64px;line-height:1.12;font-weight:700;margin-top:14px">It doesn’t have to win in your home.</div>
 </div>
 <div style="position:absolute;left:80px;right:80px;bottom:70px;display:flex;align-items:center;gap:44px">
  <img class="cv" src="${COVER}" style="width:170px;transform:rotate(-3deg)">
  <div>
   <div class="ser" style="font-size:54px;font-weight:700;line-height:1.05">Men, man your post.</div>
   <div style="font-size:27px;line-height:1.35;color:#d8ceb6;margin-top:14px">Get Philip Goodwin’s booklet <span class="free" style="font-size:20px;padding:5px 12px;vertical-align:3px">Free</span><br>when you join our email list.</div>
   <div class="mark" style="font-size:18px;margin-top:18px">churchandfamilylife.com</div>
  </div>
 </div>
</div>` },

  // 1080x1080 — square
  "square-1080": { w:1080, h:1080, html: `
<div class="c" style="width:1080px;height:1080px">
 <div class="bg" style="top:-470px;height:1700px;background-image:url(${A("art/watchman-gate.jpg")});background-size:1080px auto;background-position:center top"></div>
 <div class="shade" style="background:linear-gradient(180deg,rgba(8,7,5,.9) 0%,rgba(8,7,5,.45) 30%,rgba(8,7,5,0) 45%,rgba(8,7,5,0) 66%,rgba(8,7,5,.88) 82%,#0b0a08 92%)"></div>
 <div style="position:absolute;top:70px;left:70px;right:70px;text-align:center">
  <div class="ser" style="font-size:54px;line-height:1.13;font-weight:700">Liberalism may be winning in our government.</div>
  <div class="ser gold" style="font-size:54px;line-height:1.13;font-weight:700;margin-top:10px">It doesn’t have to win in your home.</div>
 </div>
 <div style="position:absolute;left:70px;right:70px;bottom:58px;display:flex;align-items:center;gap:36px">
  <img class="cv" src="${COVER}" style="width:128px;transform:rotate(-3deg)">
  <div>
   <div class="ser" style="font-size:44px;font-weight:700;line-height:1.05">Men, man your post.</div>
   <div style="font-size:23px;line-height:1.35;color:#d8ceb6;margin-top:10px">Free booklet when you join our email list.</div>
   <div class="mark" style="font-size:16px;margin-top:10px">churchandfamilylife.com</div>
  </div>
 </div>
</div>` },

  // 1080x1920 — Story / Reel cover
  "story-1080x1920": { w:1080, h:1920, html: `
<div class="c" style="width:1080px;height:1920px">
 <div class="bg" style="top:-120px;height:1900px;background-image:url(${A("art/watchman-gate.jpg")});background-size:auto 1900px;background-position:center top"></div>
 <div class="shade" style="background:linear-gradient(180deg,rgba(8,7,5,.9) 0%,rgba(8,7,5,.4) 26%,rgba(8,7,5,0) 40%,rgba(8,7,5,0) 66%,rgba(8,7,5,.92) 78%,#0b0a08 84%)"></div>
 <div style="position:absolute;top:210px;left:90px;right:90px;text-align:center">
  <div class="eb" style="font-size:22px;margin-bottom:40px">To the men of the house</div>
  <div class="ser" style="font-size:74px;line-height:1.12;font-weight:700">Liberalism may be winning in our government.</div>
  <div class="ser gold" style="font-size:74px;line-height:1.12;font-weight:700;margin-top:18px">It doesn’t have to win in your home.</div>
 </div>
 <div style="position:absolute;left:90px;right:90px;bottom:250px;display:flex;align-items:center;gap:46px">
  <img class="cv" src="${COVER}" style="width:190px;transform:rotate(-3deg)">
  <div>
   <div class="ser" style="font-size:62px;font-weight:700;line-height:1.05">Men, man your post.</div>
   <div style="font-size:30px;line-height:1.35;color:#d8ceb6;margin-top:14px">Get the booklet <span class="free" style="font-size:22px;padding:5px 12px;vertical-align:3px">Free</span><br>when you join our email list.</div>
  </div>
 </div>
 <div class="mark" style="position:absolute;left:0;right:0;bottom:150px;text-align:center;font-size:22px">Tap the link · churchandfamilylife.com</div>
</div>` },

  // 1600x900 — X, Facebook link post, email header
  "wide-1600x900": { w:1600, h:900, html: `
<div class="c" style="width:1600px;height:900px">
 <div class="bg" style="top:-560px;left:560px;right:-60px;height:1650px;background-image:url(${A("art/watchman-gate.jpg")});background-size:1100px auto;background-position:center top"></div>
 <div class="shade" style="background:linear-gradient(90deg,#0b0a08 0%,#0b0a08 36%,rgba(11,10,8,.75) 46%,rgba(11,10,8,0) 62%),linear-gradient(0deg,rgba(11,10,8,.6) 0%,rgba(11,10,8,0) 22%)"></div>
 <div style="position:absolute;top:96px;left:90px;width:780px">
  <div class="eb l" style="font-size:17px;margin-bottom:30px">To the men of the house</div>
  <div class="ser" style="font-size:58px;line-height:1.13;font-weight:700">Liberalism may be winning in our government.</div>
  <div class="ser gold" style="font-size:58px;line-height:1.13;font-weight:700;margin-top:12px">It doesn’t have to win in your home.</div>
  <div style="display:flex;align-items:center;gap:30px;margin-top:52px">
   <img class="cv" src="${COVER}" style="width:122px;transform:rotate(-3deg)">
   <div>
    <div class="ser" style="font-size:40px;font-weight:700">Men, man your post.</div>
    <div style="font-size:22px;color:#d8ceb6;margin-top:8px">Free booklet when you join our email list.</div>
    <div class="mark" style="font-size:15px;margin-top:12px">churchandfamilylife.com</div>
   </div>
  </div>
 </div>
</div>` },

  // 1080x1350 — quote card (second post / carousel slide 2)
  "quote-1080x1350": { w:1080, h:1350, html: `
<div class="c" style="width:1080px;height:1350px">
 <div class="bg" style="top:-260px;height:1650px;background-image:url(${A("art/watchman-lantern.jpg")});background-size:1100px auto;background-position:center top"></div>
 <div class="shade" style="background:linear-gradient(180deg,rgba(8,7,5,.94) 0%,rgba(8,7,5,.7) 36%,rgba(8,7,5,.1) 56%,rgba(8,7,5,0) 66%,rgba(8,7,5,.9) 84%,#0b0a08 92%)"></div>
 <div style="position:absolute;top:100px;left:96px;right:96px;text-align:center">
  <div class="ser gold" style="font-size:150px;line-height:.6;height:70px">“</div>
  <div class="ser" style="font-size:50px;line-height:1.28;font-style:italic">Become a faithful keeper of your own vineyard, a watchful overseer of your household, a diligent shepherd of your flock, and a <span class="gold">courageous defender of your fort.</span>”</div>
  <div class="eb" style="font-size:19px;margin-top:40px">Philip Goodwin · 1655</div>
 </div>
 <div style="position:absolute;left:96px;right:96px;bottom:70px;display:flex;align-items:center;gap:40px">
  <img class="cv" src="${COVER}" style="width:150px;transform:rotate(-3deg)">
  <div>
   <div class="ser" style="font-size:46px;font-weight:700;line-height:1.05">Man Your Post</div>
   <div style="font-size:25px;line-height:1.35;color:#d8ceb6;margin-top:10px">Free when you join our email list.</div>
   <div class="mark" style="font-size:17px;margin-top:14px">churchandfamilylife.com</div>
  </div>
 </div>
</div>` },
};

const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new", userDataDir: "/tmp/myp-render-profile", args: ["--no-sandbox","--disable-gpu","--allow-file-access-from-files"] });
try {
  if (what === "cards" || what === "all") {
    fs.mkdirSync(path.join(DIR, "social"), { recursive: true });
    for (const [name, c] of Object.entries(cards)) {
      const p = await browser.newPage();
      await p.setViewport({ width: c.w, height: c.h, deviceScaleFactor: 1 });
      const file = path.join(DIR, "social", "_" + name + ".html");
      fs.writeFileSync(file, "<!doctype html><meta charset=utf-8>" + F + "<style>" + baseCss + "</style>" + c.html);
      await p.goto("file://" + file, { waitUntil: "networkidle0" });
      await p.evaluate(() => document.fonts.ready);
      await new Promise(r => setTimeout(r, 300));
      await p.screenshot({ path: path.join(DIR, "social", name + ".jpg"), type: "jpeg", quality: 90, clip: { x:0, y:0, width:c.w, height:c.h } });
      fs.unlinkSync(file);
      console.log("card", name);
      await p.close();
    }
  }
  if (what === "popup" || what === "all") {
    for (const [mode, vp] of [["desktop",{width:1440,height:900,deviceScaleFactor:1}],["mobile",{width:390,height:844,deviceScaleFactor:2,isMobile:true,hasTouch:true}]]) {
      const p = await browser.newPage();
      await p.setViewport(vp);
      const errs = []; p.on("pageerror", e => errs.push(String(e)));
      await p.goto("file://" + path.join(DIR, "demo.html"), { waitUntil: "networkidle0" });
      await p.evaluate(() => document.fonts.ready);
      await new Promise(r => setTimeout(r, 3200));
      await p.screenshot({ path: path.join(DIR, "assets", "popup-" + mode + ".png") });
      const st = await p.evaluate(() => { const r = document.getElementById("cfl-myp-popup").shadowRoot; r.querySelector('input[name=fname]').value = "John"; r.querySelector('input[name=email]').value = "john@example.com"; r.querySelector("form").requestSubmit(); return 1; });
      await new Promise(r => setTimeout(r, 1500));
      await p.screenshot({ path: path.join(DIR, "assets", "popup-" + mode + "-success.png") });
      // Escape closes + focus returns
      await p.keyboard.press("Escape"); await new Promise(r => setTimeout(r, 600));
      const closed = await p.evaluate(() => getComputedStyle(document.getElementById("cfl-myp-popup").shadowRoot.querySelector(".bd")).display);
      console.log("popup", mode, "errors:", errs.length ? errs : "none", "afterEsc:", closed);
      await p.close();
    }
  }
} finally { await browser.close(); }
