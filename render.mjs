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
body{background:#f1eadb;color:#25231a;font-family:'Barlow',Arial,sans-serif;-webkit-font-smoothing:antialiased}
.c{position:relative;overflow:hidden;background:#f1eadb}
.bg{position:absolute;left:0;right:0;background-repeat:no-repeat}
.shade{position:absolute;inset:0}
.ser{font-family:'Oswald',Impact,sans-serif;font-weight:600!important;text-transform:uppercase;letter-spacing:.012em;text-wrap:balance}
.cin{font-family:'Cinzel',Georgia,serif!important;font-weight:800!important;text-transform:none;letter-spacing:.02em}
.q{font-family:'Oswald',sans-serif!important;font-weight:500!important;font-style:normal!important;text-transform:none!important;letter-spacing:.005em}
.gold{color:#4b5530}
.eb{font-weight:800;letter-spacing:.28em;text-transform:uppercase;color:#7a6431;display:flex;align-items:center;gap:18px}
.eb:before,.eb:after{content:'';height:2px;flex:1;background:linear-gradient(90deg,transparent,rgba(122,100,49,.55))}
.eb:after{background:linear-gradient(90deg,rgba(122,100,49,.55),transparent)}
.eb.l:before{display:none}
.cv{border-radius:3px;box-shadow:0 18px 36px rgba(40,30,10,.38),0 2px 6px rgba(40,30,10,.25)}
.hero{border-radius:3px;box-shadow:0 30px 60px rgba(25,20,8,.5),0 8px 18px rgba(25,20,8,.35),0 0 0 1px rgba(255,255,255,.08)}
.free{display:inline-block;background:#3f4728;color:#f1eadb;font-weight:800;letter-spacing:.18em;text-transform:uppercase;border-radius:3px}
.mark{font-weight:700;letter-spacing:.3em;text-transform:uppercase;color:#7a6f55}
`;
const BG = process.env.MYP_BG || "art/painting-main.jpg";
const BG2 = process.env.MYP_BG2 || "art/painting-quote.jpg";
const POS = process.env.MYP_POS || "center 62%";
const POS2 = process.env.MYP_POS2 || "center 62%";
// Painting sits unshaded in its own window; the black-and-gold panel below carries the type and the booklet.
const paint = (img, pos, css) => `<div class="bg" style="${css};background-image:url(${A(img)});background-size:cover;background-position:${pos}"></div>`;
const fadeDown = (top, h) => `<div class="shade" style="top:${top}px;height:${h}px;bottom:auto;background:linear-gradient(180deg,rgba(241,234,219,0),#f1eadb)"></div>`;
const cards = {
  "feed-1080x1350": { w:1080, h:1350, html: `
<div class="c" style="width:1080px;height:1350px">
 ${paint(BG, "center 60%", "top:0;height:700px")}
 ${fadeDown(640,60)}
 <img class="cv hero" src="${COVER}" style="position:absolute;left:405px;top:548px;width:270px">
 <div style="position:absolute;top:1000px;left:70px;right:70px;text-align:center">
  <div class="ser" style="font-size:64px;line-height:1.04;font-weight:700">Liberalism may be winning.</div>
  <div class="ser gold" style="font-size:64px;line-height:1.04;font-weight:700;margin-top:4px">Not under your roof.</div>
  <div class="ser cin" style="font-size:40px;line-height:1.1;margin-top:24px">Men, man your post.</div>
  <div style="font-size:23px;line-height:1.35;color:#4d4636;margin-top:10px">Get Philip Goodwin’s booklet <span class="free" style="font-size:17px;padding:4px 10px;vertical-align:2px">Free</span> when you join our email list.</div>
  <div class="mark" style="font-size:16px;margin-top:14px">churchandfamilylife.com</div>
 </div>
</div>` },

  "square-1080": { w:1080, h:1080, html: `
<div class="c" style="width:1080px;height:1080px">
 ${paint(BG, "center 58%", "top:0;height:560px")}
 ${fadeDown(510,50)}
 <img class="cv hero" src="${COVER}" style="position:absolute;left:440px;top:448px;width:200px">
 <div style="position:absolute;top:782px;left:60px;right:60px;text-align:center">
  <div class="ser" style="font-size:52px;line-height:1.04;font-weight:700">Liberalism may be winning.</div>
  <div class="ser gold" style="font-size:52px;line-height:1.04;font-weight:700;margin-top:2px">Not under your roof.</div>
  <div class="ser cin" style="font-size:32px;line-height:1.1;margin-top:16px">Men, man your post.</div>
  <div style="font-size:20px;line-height:1.35;color:#4d4636;margin-top:8px">Free booklet when you join our email list · <span class="mark" style="font-size:15px">churchandfamilylife.com</span></div>
 </div>
</div>` },

  "story-1080x1920": { w:1080, h:1920, html: `
<div class="c" style="width:1080px;height:1920px">
 ${paint(BG, "center 50%", "top:0;height:900px")}
 ${fadeDown(830,70)}
 <img class="cv hero" src="${COVER}" style="position:absolute;left:345px;top:620px;width:390px">
 <div style="position:absolute;top:1255px;left:60px;right:60px;text-align:center">
  <div class="ser" style="font-size:76px;line-height:1.03;font-weight:700">Liberalism may be winning.</div>
  <div class="ser gold" style="font-size:76px;line-height:1.03;font-weight:700;margin-top:4px">Not under your roof.</div>
  <div class="ser cin" style="font-size:50px;line-height:1.1;margin-top:36px">Men, man your post.</div>
  <div style="font-size:29px;line-height:1.35;color:#4d4636;margin-top:12px">Get the booklet <span class="free" style="font-size:21px;padding:5px 12px;vertical-align:3px">Free</span> when you join our email list.</div>
 </div>
 <div class="mark" style="position:absolute;left:0;right:0;bottom:190px;text-align:center;font-size:22px">Tap the link · churchandfamilylife.com</div>
</div>` },

  "wide-1600x900": { w:1600, h:900, html: `
<div class="c" style="width:1600px;height:900px">
 ${paint(BG, "center 80%", "top:0;bottom:0;left:900px;right:0")}
 <div class="shade" style="left:900px;width:140px;right:auto;background:linear-gradient(90deg,#f1eadb,rgba(241,234,219,0))"></div>
 <div style="position:absolute;top:150px;left:80px;width:560px">
  <div class="ser" style="font-size:72px;line-height:1.02;font-weight:700">Liberalism may be winning.</div>
  <div class="ser gold" style="font-size:72px;line-height:1.02;font-weight:700;margin-top:6px">Not under your roof.</div>
  <div class="ser cin" style="font-size:38px;margin-top:40px">Men, man your post.</div>
  <div style="font-size:22px;color:#4d4636;margin-top:10px">Free booklet when you join our email list.</div>
  <div class="mark" style="font-size:15px;margin-top:14px">churchandfamilylife.com</div>
 </div>
 <img class="cv hero" src="${COVER}" style="position:absolute;left:705px;top:105px;width:446px">
</div>` },

  "quote-1080x1350": { w:1080, h:1350, html: `
<div class="c" style="width:1080px;height:1350px">
 ${paint(BG2, "center 58%", "top:0;height:600px")}
 ${fadeDown(545,55)}
 <img class="cv hero" src="${COVER}" style="position:absolute;left:420px;top:470px;width:240px">
 <div style="position:absolute;top:880px;left:92px;right:92px;text-align:center">
  <div class="ser q" style="font-size:40px;line-height:1.24"><span class="gold">“</span>Become a faithful keeper of your own vineyard, a watchful overseer of your household, a diligent shepherd of your flock, and a <span class="gold">courageous defender of your fort.</span>”</div>
  <div class="eb" style="font-size:18px;margin-top:24px">Philip Goodwin · 1655</div>
  <div style="font-size:23px;line-height:1.35;color:#4d4636;margin-top:22px"><span class="cin" style="font-size:30px;color:#25231a">Man Your Post</span> &nbsp;free when you join our email list</div>
  <div class="mark" style="font-size:16px;margin-top:12px">churchandfamilylife.com</div>
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
      const st = await p.evaluate(() => { const r = document.getElementById("cfl-myp-popup").shadowRoot; r.querySelector('input[name=email]').value = "john@example.com"; r.querySelector("form").requestSubmit(); return 1; });
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
