// render.mjs — renders the Man Your Post social cards + popup screenshots.
// Usage: node render.mjs [cards|popup|all]
import puppeteer from "puppeteer-core";
import fs from "fs"; import path from "path"; import url from "url";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const DIR = path.dirname(url.fileURLToPath(import.meta.url));
const what = process.argv[2] || "all";
const F = '<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Cinzel:wght@700;800;900&family=Barlow:ital,wght@0,400;0,500;0,600;0,700;0,800;1,500&display=swap" rel="stylesheet">';
const A = (f) => "file://" + path.join(DIR, f);
const COVER = A("assets/cover.jpg");
const baseCss = `
*{box-sizing:border-box;margin:0;padding:0}
body{background:#0b0a08;color:#f4ecd9;font-family:'Barlow',Arial,sans-serif;-webkit-font-smoothing:antialiased}
.c{position:relative;overflow:hidden;background:#0b0a08}
.bg{position:absolute;left:0;right:0;background-repeat:no-repeat}
.shade{position:absolute;inset:0}
.ser{font-family:'Oswald',Impact,sans-serif;font-weight:600!important;text-transform:uppercase;letter-spacing:.012em;text-wrap:balance}
.cin{font-family:'Cinzel',Georgia,serif!important;font-weight:800!important;text-transform:none;letter-spacing:.02em}
.q{font-family:'Oswald',sans-serif!important;font-weight:500!important;font-style:normal!important;text-transform:none!important;letter-spacing:.005em}
.gold{color:#d9b45f}
.eb{font-weight:800;letter-spacing:.28em;text-transform:uppercase;color:#c9a24e;display:flex;align-items:center;gap:18px}
.eb:before,.eb:after{content:'';height:2px;flex:1;background:linear-gradient(90deg,transparent,rgba(201,162,78,.7))}
.eb:after{background:linear-gradient(90deg,rgba(201,162,78,.7),transparent)}
.eb.l:before{display:none}
.cv{border-radius:3px;box-shadow:0 18px 40px rgba(0,0,0,.75),0 0 0 1px rgba(201,162,78,.4),0 0 70px rgba(201,162,78,.22)}
.free{display:inline-block;background:#c9a24e;color:#14110b;font-weight:800;letter-spacing:.18em;text-transform:uppercase;border-radius:3px}
.mark{font-weight:700;letter-spacing:.3em;text-transform:uppercase;color:#a99a76}
`;
const BG = process.env.MYP_BG || "art/painting-main.jpg";
const BG2 = process.env.MYP_BG2 || "art/painting-quote.jpg";
const POS = process.env.MYP_POS || "center 62%";
const POS2 = process.env.MYP_POS2 || "center 62%";
// Painting sits unshaded in its own window; the black-and-gold panel below carries the type and the booklet.
const paint = (img, pos, css) => `<div class="bg" style="${css};background-image:url(${A(img)});background-size:cover;background-position:${pos}"></div>`;
const fadeDown = (top, h) => `<div class="shade" style="top:${top}px;height:${h}px;bottom:auto;background:linear-gradient(180deg,rgba(11,10,8,0),#0b0a08)"></div>`;
const cards = {
  "feed-1080x1350": { w:1080, h:1350, html: `
<div class="c" style="width:1080px;height:1350px">
 ${paint(BG, "center 66%", "top:0;height:760px")}
 ${fadeDown(600,170)}
 <div style="position:absolute;top:735px;left:80px;right:80px;text-align:center">
  <div class="eb" style="font-size:19px;margin-bottom:24px">To the men of the house</div>
  <div class="ser" style="font-size:60px;line-height:1.06;font-weight:700">Liberalism may be winning in our government.</div>
  <div class="ser gold" style="font-size:60px;line-height:1.06;font-weight:700;margin-top:8px">It doesn’t have to win in your home.</div>
 </div>
 <div style="position:absolute;left:80px;right:80px;bottom:62px;display:flex;align-items:center;gap:40px">
  <img class="cv" src="${COVER}" style="width:150px;transform:rotate(-3deg)">
  <div>
   <div class="ser cin" style="font-size:46px;line-height:1.05">Men, man your post.</div>
   <div style="font-size:25px;line-height:1.35;color:#d8ceb6;margin-top:12px">Get Philip Goodwin’s booklet <span class="free" style="font-size:19px;padding:5px 12px;vertical-align:3px">Free</span><br>when you join our email list.</div>
   <div class="mark" style="font-size:17px;margin-top:14px">churchandfamilylife.com</div>
  </div>
 </div>
</div>` },

  "square-1080": { w:1080, h:1080, html: `
<div class="c" style="width:1080px;height:1080px">
 ${paint(BG, "center 64%", "top:0;height:640px")}
 ${fadeDown(500,150)}
 <div style="position:absolute;top:615px;left:70px;right:70px;text-align:center">
  <div class="ser" style="font-size:54px;line-height:1.06;font-weight:700">Liberalism may be winning in our government.</div>
  <div class="ser gold" style="font-size:54px;line-height:1.06;font-weight:700;margin-top:6px">It doesn’t have to win in your home.</div>
 </div>
 <div style="position:absolute;left:70px;right:70px;bottom:40px;display:flex;align-items:center;gap:34px">
  <img class="cv" src="${COVER}" style="width:108px;transform:rotate(-3deg)">
  <div>
   <div class="ser cin" style="font-size:38px;line-height:1.05">Men, man your post.</div>
   <div style="font-size:22px;line-height:1.35;color:#d8ceb6;margin-top:8px">Free booklet when you join our email list.</div>
   <div class="mark" style="font-size:15px;margin-top:10px">churchandfamilylife.com</div>
  </div>
 </div>
</div>` },

  "story-1080x1920": { w:1080, h:1920, html: `
<div class="c" style="width:1080px;height:1920px">
 ${paint(BG, "center 75%", "top:0;height:1060px")}
 ${fadeDown(880,190)}
 <div style="position:absolute;top:1010px;left:60px;right:60px;text-align:center">
  <div class="eb" style="font-size:21px;margin-bottom:28px">To the men of the house</div>
  <div class="ser" style="font-size:70px;line-height:1.05;font-weight:700">Liberalism may be winning in our government.</div>
  <div class="ser gold" style="font-size:70px;line-height:1.05;font-weight:700;margin-top:10px">It doesn’t have to win in your home.</div>
 </div>
 <div style="position:absolute;left:90px;right:90px;bottom:215px;display:flex;align-items:center;gap:44px">
  <img class="cv" src="${COVER}" style="width:170px;transform:rotate(-3deg)">
  <div>
   <div class="ser cin" style="font-size:52px;line-height:1.05">Men, man your post.</div>
   <div style="font-size:29px;line-height:1.35;color:#d8ceb6;margin-top:12px">Get the booklet <span class="free" style="font-size:21px;padding:5px 12px;vertical-align:3px">Free</span><br>when you join our email list.</div>
  </div>
 </div>
 <div class="mark" style="position:absolute;left:0;right:0;bottom:140px;text-align:center;font-size:22px">Tap the link · churchandfamilylife.com</div>
</div>` },

  "wide-1600x900": { w:1600, h:900, html: `
<div class="c" style="width:1600px;height:900px">
 ${paint(BG, "center 80%", "top:0;bottom:0;left:760px;right:0")}
 <div class="shade" style="left:760px;width:160px;right:auto;background:linear-gradient(90deg,#0b0a08,rgba(11,10,8,0))"></div>
 <div style="position:absolute;top:92px;left:84px;width:660px">
  <div class="eb l" style="font-size:16px;margin-bottom:28px">To the men of the house</div>
  <div class="ser" style="font-size:62px;line-height:1.06;font-weight:700">Liberalism may be winning in our government.</div>
  <div class="ser gold" style="font-size:62px;line-height:1.06;font-weight:700;margin-top:10px">It doesn’t have to win in your home.</div>
  <div style="display:flex;align-items:center;gap:28px;margin-top:48px">
   <img class="cv" src="${COVER}" style="width:116px;transform:rotate(-3deg)">
   <div>
    <div class="ser cin" style="font-size:36px">Men, man your post.</div>
    <div style="font-size:21px;color:#d8ceb6;margin-top:8px">Free booklet when you join our email list.</div>
    <div class="mark" style="font-size:15px;margin-top:12px">churchandfamilylife.com</div>
   </div>
  </div>
 </div>
</div>` },

  "quote-1080x1350": { w:1080, h:1350, html: `
<div class="c" style="width:1080px;height:1350px">
 ${paint(BG2, "center 64%", "top:0;height:790px")}
 ${fadeDown(630,170)}
 <div style="position:absolute;top:770px;left:92px;right:92px;text-align:center">
  <div class="ser q" style="font-size:44px;line-height:1.25"><span class="gold">“</span>Become a faithful keeper of your own vineyard, a watchful overseer of your household, a diligent shepherd of your flock, and a <span class="gold">courageous defender of your fort.</span>”</div>
  <div class="eb" style="font-size:18px;margin-top:26px">Philip Goodwin · 1655</div>
 </div>
 <div style="position:absolute;left:92px;right:92px;bottom:58px;display:flex;align-items:center;gap:38px">
  <img class="cv" src="${COVER}" style="width:118px;transform:rotate(-3deg)">
  <div>
   <div class="ser cin" style="font-size:42px;line-height:1.05">Man Your Post</div>
   <div style="font-size:24px;line-height:1.35;color:#d8ceb6;margin-top:10px">Free when you join our email list.</div>
   <div class="mark" style="font-size:16px;margin-top:12px">churchandfamilylife.com</div>
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
