/*!
 * Church & Family Life — "Man Your Post" free-booklet email popup  (v1, 2026-11-04)
 * Drop-in, no dependencies. Renders inside a Shadow DOM so site CSS can't bleed in.
 *
 * Install (Exo):
 *   <script>window.MYP_POPUP = { endpoint: "…", method: "mailchimp-jsonp" };</script>
 *   <script src="/js/myp-popup.js" defer></script>
 *
 * Open it on demand:  any link to  ?free=man-your-post  or  #man-your-post
 *                     or call  window.CFLManYourPost.open()
 */
(function () {
  "use strict";
  if (window.CFLManYourPost) return;

  var CFG = Object.assign({
    // Where the email goes. Empty string = demo mode (no network call, shows success).
    endpoint: "",
    // "json"            -> POST {firstName,email,tags[]} as JSON to endpoint (CFL API / ESP webhook)
    // "mailchimp-jsonp" -> endpoint is the Mailchimp embedded-form action URL (…list-manage.com/subscribe/post?u=…&id=…)
    method: "json",
    tag: "giveaway-man-your-post",
    delayMs: 9000,          // auto-open after N ms on the page…
    scrollPct: 0.45,        // …or after scrolling this far, whichever comes first
    exitIntent: true,       // desktop: open when the cursor heads for the tab bar
    snoozeDays: 7,          // after a close, stay quiet this long
    minPagesBeforeAuto: 1,  // auto-open on the Nth page view or later
    excludePaths: ["/checkout", "/cart", "/account", "/login", "/register", "/donate"],
    productUrl: "https://churchandfamilylife.com/products/6ac6570d68c8897ef2d80484",
    coverUrl: "https://cfl-mango.s3.us-east-1.amazonaws.com/assets/products/6ac6570d68c8897ef2d80484/image.jpg",
    privacyUrl: "https://churchandfamilylife.com/privacy",
    offerLine: "Free digital copy, delivered to your inbox.",
    demo: false
  }, window.MYP_POPUP || {});

  var KEY = "cfl_myp_popup_v1";
  var store = {
    get: function () { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } },
    set: function (o) { try { localStorage.setItem(KEY, JSON.stringify(Object.assign(store.get(), o))); } catch (e) {} }
  };

  function forced() {
    var q = new URLSearchParams(location.search);
    return q.get("free") === "man-your-post" || location.hash === "#man-your-post";
  }
  function excluded() {
    var p = location.pathname.toLowerCase();
    return CFG.excludePaths.some(function (x) { return p.indexOf(x) === 0; });
  }
  function eligible() {
    var s = store.get();
    if (s.subscribed) return false;
    if (s.closedAt && Date.now() - s.closedAt < CFG.snoozeDays * 864e5) return false;
    if ((s.views || 0) < CFG.minPagesBeforeAuto) return false;
    return !excluded();
  }

  var CSS = "\
:host{all:initial}\
*{box-sizing:border-box}\
.bd{position:fixed;inset:0;z-index:2147483000;background:rgba(8,7,5,.72);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);display:flex;align-items:center;justify-content:center;padding:24px;opacity:0;transition:opacity .35s ease}\
.bd.on{opacity:1}\
.dlg{position:relative;width:100%;max-width:820px;display:grid;grid-template-columns:300px 1fr;background:#0f0e0c;color:#efe6d2;border:1px solid rgba(201,162,78,.45);box-shadow:0 30px 80px rgba(0,0,0,.6),inset 0 0 0 1px rgba(255,255,255,.03);border-radius:6px;overflow:hidden;transform:translateY(14px) scale(.985);transition:transform .45s cubic-bezier(.2,.8,.2,1);font-family:'Source Sans 3','Helvetica Neue',Arial,sans-serif}\
.bd.on .dlg{transform:none}\
.art{position:relative;background:radial-gradient(120% 80% at 50% 38%,#3a2d14 0%,#16120b 55%,#0a0908 100%);display:flex;align-items:center;justify-content:center;padding:34px 28px;overflow:hidden}\
.cover{position:relative;z-index:1;width:100%;max-width:210px;aspect-ratio:1080/1669;object-fit:cover;border-radius:2px;box-shadow:0 22px 40px rgba(0,0,0,.7),0 0 0 1px rgba(201,162,78,.35),0 0 60px rgba(201,162,78,.18);transform:rotate(-2.5deg)}\
.ribbon{position:absolute;z-index:2;top:22px;left:-38px;transform:rotate(-38deg);background:#c9a24e;color:#14110b;font:800 12px/1 'Source Sans 3',Arial,sans-serif;letter-spacing:.22em;padding:7px 48px;box-shadow:0 4px 12px rgba(0,0,0,.4)}\
.body{padding:40px 42px 30px}\
.eyebrow{font-size:12px;font-weight:700;letter-spacing:.24em;text-transform:uppercase;color:#c9a24e;margin:0 0 14px;display:flex;align-items:center;gap:10px}\
.eyebrow:after{content:'';flex:1;height:1px;background:linear-gradient(90deg,rgba(201,162,78,.6),transparent)}\
h2{text-wrap:balance;font-family:'Libre Caslon Text',Georgia,'Times New Roman',serif;font-weight:700;font-size:29px;line-height:1.17;margin:0 0 14px;color:#f4ecd9;letter-spacing:-.005em}\
h2 em{font-style:normal;color:#d9b45f;display:block;margin-top:4px}\
.dlg:focus{outline:none}\
.cta{font-family:'Libre Caslon Text',Georgia,serif;font-size:19px;line-height:1.35;margin:0 0 14px;color:#efe6d2}\
.cta b{color:#d9b45f;font-weight:700;white-space:nowrap}\
.lede{font-size:15.5px;line-height:1.55;color:#c8bea8;margin:0 0 20px}\
.lede i{color:#e6dcc4}\
form{display:grid;grid-template-columns:1fr 1.35fr;gap:10px;margin:0}\
input{width:100%;font:inherit;font-size:16px;color:#f4ecd9;background:#1a1814;border:1px solid #3b3529;border-radius:4px;padding:13px 14px;outline:none;transition:border-color .2s,box-shadow .2s}\
input::placeholder{color:#7f7663}\
input:focus{border-color:#c9a24e;box-shadow:0 0 0 3px rgba(201,162,78,.2)}\
button.go{grid-column:1/-1;font:800 15px/1 'Source Sans 3',Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#14110b;background:linear-gradient(180deg,#dcb766,#c39a45);border:0;border-radius:4px;padding:16px 18px;cursor:pointer;box-shadow:0 6px 18px rgba(201,162,78,.25);transition:transform .15s,filter .15s}\
button.go:hover{filter:brightness(1.06);transform:translateY(-1px)}\
button.go:disabled{opacity:.6;cursor:wait;transform:none}\
.fine{font-size:12.5px;line-height:1.45;color:#8a816d;margin:12px 0 0}\
.fine a{color:#b59a5e}\
.err{grid-column:1/-1;color:#f0a58a;font-size:13.5px;margin:0}\
.err:empty{display:none}\
.no{display:block;margin:12px auto 0;background:none;border:0;color:#8a816d;font:inherit;font-size:13px;text-decoration:underline;text-underline-offset:3px;cursor:pointer;padding:6px}\
.no:hover{color:#c8bea8}\
.x{position:absolute;top:10px;right:10px;width:40px;height:40px;border-radius:50%;border:0;background:transparent;color:#a99f88;font-size:26px;line-height:40px;cursor:pointer;z-index:3}\
.x:hover{background:rgba(255,255,255,.06);color:#f4ecd9}\
.ok{display:none}\
.ok h3{font-family:'Libre Caslon Text',Georgia,serif;font-size:28px;margin:0 0 10px;color:#f4ecd9}\
.ok p{font-size:16px;line-height:1.55;color:#c8bea8;margin:0 0 16px}\
.ok .vs{font-family:'Libre Caslon Text',Georgia,serif;font-style:italic;color:#d9b45f;font-size:17px;border-left:2px solid #c9a24e;padding-left:14px;margin:18px 0 22px}\
.ok a.btn{display:inline-block;color:#14110b;background:#c9a24e;text-decoration:none;font-weight:800;letter-spacing:.1em;text-transform:uppercase;font-size:13px;padding:13px 18px;border-radius:4px}\
.done .form-area{display:none}.done .ok{display:block}\
:focus-visible{outline:2px solid #e3c47a;outline-offset:2px}\
.tag{display:none;position:relative;z-index:1;font-size:12px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:#14110b;background:#c9a24e;padding:6px 10px;border-radius:3px;align-self:center}\
@media (max-width:720px){\
 .bd{align-items:flex-end;padding:0}\
 .dlg{grid-template-columns:1fr;max-width:none;border-radius:16px 16px 0 0;border-left:0;border-right:0;border-bottom:0;max-height:92vh;overflow:auto;transform:translateY(40px)}\
 .art{padding:18px 20px 0;background:linear-gradient(180deg,#2a2112,#0f0e0c);justify-content:flex-start;gap:16px}\
 .cover{max-width:62px;transform:rotate(-3deg)}\
 .form-area .eyebrow{display:none}\
 input{padding:12px 14px}\
 .fine{font-size:12px}\
 .ribbon{display:none}\
 .tag{display:block}\
 .body{padding:14px 20px 20px}\
 h2{font-size:23px;margin-bottom:10px}\
 .cta{font-size:17px;margin-bottom:10px}\
 .lede{font-size:14.5px;line-height:1.5;margin-bottom:14px}\
 form{grid-template-columns:1fr}\
}\
@media (prefers-reduced-motion:reduce){.bd,.dlg{transition:none}}";

  var HTML = '\
<div class="bd" part="backdrop">\
 <div class="dlg" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="myp-h" aria-describedby="myp-d">\
  <button class="x" type="button" aria-label="Close">&times;</button>\
  <div class="art"><span class="ribbon">FREE</span><img class="cover" alt="Man Your Post by Philip Goodwin, edited by Scott T. Brown" src=""><span class="tag">Free booklet</span></div>\
  <div class="body">\
   <div class="form-area">\
    <p class="eyebrow">A free booklet for husbands &amp; fathers</p>\
    <h2 id="myp-h">Liberalism may be winning in our government. <em>It doesn&rsquo;t have to win in your home.</em></h2>\
    <p class="cta">Men, fortify your household. <b>Man your post.</b></p>\
    <p class="lede" id="myp-d">Join the Church &amp; Family Life email list and we&rsquo;ll send you Philip Goodwin&rsquo;s <i>Man Your Post</i>&mdash;a short, bracing call from Joshua 24:15 to lead your family in the worship of God.</p>\
    <form novalidate>\
     <input name="fname" type="text" autocomplete="given-name" placeholder="First name" aria-label="First name">\
     <input name="email" type="email" autocomplete="email" placeholder="Email address" aria-label="Email address" required>\
     <p class="err" role="alert"></p>\
     <button class="go" type="submit">Send my free copy</button>\
    </form>\
    <p class="fine"><span class="offer"></span> You&rsquo;ll also receive occasional emails from Church &amp; Family Life. Unsubscribe anytime. <a class="priv" href="#" target="_blank" rel="noopener">Privacy</a></p>\
    <button class="no" type="button">No thanks</button>\
   </div>\
   <div class="ok" aria-live="polite">\
    <p class="eyebrow">You&rsquo;re in</p>\
    <h3>Check your inbox.</h3>\
    <p>Your free copy of <i>Man Your Post</i> is on its way. Read it this week&mdash;then read it with your family.</p>\
    <p class="vs">&ldquo;But as for me and my house, we will serve the Lord.&rdquo; &mdash;Joshua 24:15</p>\
    <a class="btn shop" href="#">Print copies for your men&rsquo;s group &rarr;</a>\
   </div>\
  </div>\
 </div>\
</div>';

  var host, root, bd, dlg, lastFocus, isOpen = false, autoArmed = false;

  function fonts() {
    if (document.getElementById("myp-fonts")) return;
    var l = document.createElement("link");
    l.id = "myp-fonts"; l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&family=Source+Sans+3:wght@400;600;700;800&display=swap";
    document.head.appendChild(l);
  }

  function build() {
    if (host) return;
    fonts();
    host = document.createElement("div");
    host.id = "cfl-myp-popup";
    root = host.attachShadow({ mode: "open" });
    root.innerHTML = "<style>" + CSS + "</style>" + HTML;
    bd = root.querySelector(".bd"); dlg = root.querySelector(".dlg");
    root.querySelector(".cover").src = CFG.coverUrl;
    root.querySelector(".offer").textContent = CFG.offerLine;
    root.querySelector(".priv").href = CFG.privacyUrl;
    root.querySelector(".shop").href = CFG.productUrl + (CFG.productUrl.indexOf("?") < 0 ? "?" : "&") + "utm_source=site&utm_medium=popup&utm_campaign=man-your-post";
    root.querySelector(".x").addEventListener("click", function () { close("x"); });
    root.querySelector(".no").addEventListener("click", function () { close("no"); });
    bd.addEventListener("mousedown", function (e) { if (e.target === bd) close("backdrop"); });
    root.querySelector("form").addEventListener("submit", submit);
    bd.addEventListener("keydown", trap);
    bd.style.display = "none";
    document.body.appendChild(host);
  }

  function focusables() {
    return [].slice.call(dlg.querySelectorAll("button,input,a[href]")).filter(function (el) { return el.offsetParent !== null; });
  }
  function trap(e) {
    if (e.key === "Escape") { e.preventDefault(); close("esc"); return; }
    if (e.key !== "Tab") return;
    var f = focusables(); if (!f.length) return;
    var a = root.activeElement;
    if (e.shiftKey && a === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && a === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  }

  function track(action, label) {
    try { if (window.gtag) window.gtag("event", "myp_popup_" + action, { popup_label: label || "" }); } catch (e) {}
  }

  function open(source) {
    build();
    if (isOpen) return;
    isOpen = true;
    lastFocus = document.activeElement;
    bd.style.display = "flex";
    document.documentElement.style.overflow = "hidden";
    requestAnimationFrame(function () { requestAnimationFrame(function () { bd.classList.add("on"); }); });
    setTimeout(function () {
      if (dlg.classList.contains("done")) return;
      var i = matchMedia("(max-width:720px)").matches ? dlg : root.querySelector('input[name="fname"]');
      if (i) i.focus({ preventScroll: true });
    }, 360);
    track("open", source || "manual");
  }

  function close(how) {
    if (!isOpen) return;
    isOpen = false;
    bd.classList.remove("on");
    document.documentElement.style.overflow = "";
    if (!store.get().subscribed) store.set({ closedAt: Date.now() });
    setTimeout(function () { bd.style.display = "none"; }, 360);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
    track("close", how);
  }

  function jsonp(url) {
    return new Promise(function (res, rej) {
      var cb = "mypcb" + Date.now(), s = document.createElement("script");
      window[cb] = function (d) { delete window[cb]; s.remove(); res(d); };
      s.onerror = function () { delete window[cb]; s.remove(); rej(new Error("network")); };
      s.src = url + (url.indexOf("?") < 0 ? "?" : "&") + "c=" + cb;
      document.head.appendChild(s);
      setTimeout(function () { if (window[cb]) { delete window[cb]; s.remove(); rej(new Error("network")); } }, 12000);
    });
  }

  function send(fname, email) {
    if (CFG.demo || !CFG.endpoint) return new Promise(function (r) { setTimeout(function () { r({ ok: true, demo: true }); }, 700); });
    if (CFG.method === "mailchimp-jsonp") {
      var u = CFG.endpoint.replace("/post?", "/post-json?") +
        "&EMAIL=" + encodeURIComponent(email) + "&FNAME=" + encodeURIComponent(fname) +
        (CFG.tag ? "&tags=" + encodeURIComponent(CFG.tag) : "");
      return jsonp(u).then(function (d) {
        if (d.result === "success" || /already subscribed/i.test(d.msg || "")) return { ok: true };
        throw new Error((d.msg || "Something went wrong.").replace(/<[^>]+>/g, "").replace(/^\d+ - /, ""));
      });
    }
    return fetch(CFG.endpoint, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName: fname, email: email, tags: [CFG.tag], source: "popup:man-your-post", page: location.href })
    }).then(function (r) { if (!r.ok) throw new Error("We couldn't sign you up just now. Please try again."); return { ok: true }; });
  }

  function submit(e) {
    e.preventDefault();
    var f = e.target, err = root.querySelector(".err"), btn = f.querySelector(".go");
    var fname = f.fname.value.trim(), email = f.email.value.trim();
    err.textContent = "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { err.textContent = "Please enter a valid email address."; f.email.focus(); return; }
    btn.disabled = true; btn.textContent = "Sending…";
    send(fname, email).then(function () {
      store.set({ subscribed: Date.now() });
      dlg.classList.add("done");
      track("subscribe", CFG.tag);
      setTimeout(function () { dlg.focus({ preventScroll: true }); }, 50);
    }).catch(function (x) {
      err.textContent = x && x.message && x.message !== "network" ? x.message : "We couldn't sign you up just now. Please try again.";
      btn.disabled = false; btn.textContent = "Send my free copy";
    });
  }

  function arm() {
    if (autoArmed) return; autoArmed = true;
    var fired = false;
    function fire(src) { if (fired || isOpen) return; fired = true; cleanup(); open(src); }
    var t = setTimeout(function () { fire("timer"); }, CFG.delayMs);
    function onScroll() {
      var h = document.documentElement.scrollHeight - innerHeight;
      if (h > 200 && scrollY / h >= CFG.scrollPct) fire("scroll");
    }
    function onLeave(e) { if (CFG.exitIntent && e.clientY <= 0 && !e.relatedTarget) fire("exit"); }
    function cleanup() { clearTimeout(t); removeEventListener("scroll", onScroll); document.removeEventListener("mouseout", onLeave); }
    addEventListener("scroll", onScroll, { passive: true });
    if (matchMedia("(hover:hover) and (pointer:fine)").matches) document.addEventListener("mouseout", onLeave);
  }

  function boot() {
    var s = store.get(); store.set({ views: (s.views || 0) + 1 });
    if (forced() && !excluded()) { open("link"); return; }
    if (eligible()) arm();
  }

  // Links anywhere on the site: <a href="#man-your-post"> or [data-myp-open] opens it without a reload.
  addEventListener("hashchange", function () { if (location.hash === "#man-your-post") open("hash"); });
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href$="#man-your-post"],[data-myp-open]');
    if (a) { e.preventDefault(); open("click"); }
  });

  window.CFLManYourPost = { open: open, close: close, reset: function () { try { localStorage.removeItem(KEY); } catch (e) {} }, config: CFG };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
