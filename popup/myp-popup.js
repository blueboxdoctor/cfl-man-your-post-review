/*!
 * Church & Family Life — "Man Your Post" free-booklet email popup  (v2, 2026-11-04: email only, big-book panel, parchment + moss palette)
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
    // "json"            -> POST {email,tags[]} as JSON to endpoint (CFL API / ESP webhook)
    // "mailchimp-jsonp" -> endpoint is the Mailchimp embedded-form action URL (…list-manage.com/subscribe/post?u=…&id=…)
    method: "json",
    tag: "1065685",          // Mailchimp tag id for "giveaway-man-your-post" (Master List 816047355d); json method sends tagName
    tagName: "giveaway-man-your-post",
    startsAt: "",            // ISO date; empty = now
    endsAt: "2026-11-18T23:59:59-05:00", // auto-open stops after this (two-week run)
    onceOnly: true,          // auto-open at most once per browser, ever (open counts, not just close)
    delayMs: 9000,          // auto-open after N ms on the page…
    scrollPct: 0.45,        // …or after scrolling this far, whichever comes first
    exitIntent: true,       // desktop: open when the cursor heads for the tab bar
    snoozeDays: 7,          // after a close, stay quiet this long
    minPagesBeforeAuto: 1,  // 1 = first page view
    excludePaths: ["/checkout", "/cart", "/account", "/login", "/register", "/donate"],
    productUrl: "https://churchandfamilylife.com/products/6ac6570d68c8897ef2d80484",
    coverUrl: "https://cfl-mango.s3.us-east-1.amazonaws.com/assets/products/6ac6570d68c8897ef2d80484/image.jpg",
    privacyUrl: "https://churchandfamilylife.com/privacy",
    offerLine: "Free digital copy by email, plus occasional Church & Family Life updates. Unsubscribe anytime.",
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
    var s = store.get(), now = Date.now();
    if (s.subscribed) return false;
    if (CFG.onceOnly && s.shownAt) return false;
    if (CFG.endsAt && now > Date.parse(CFG.endsAt)) return false;
    if (CFG.startsAt && now < Date.parse(CFG.startsAt)) return false;
    if (s.closedAt && Date.now() - s.closedAt < CFG.snoozeDays * 864e5) return false;
    if ((s.views || 0) < CFG.minPagesBeforeAuto) return false;
    return !excluded();
  }

  var CSS = "\
:host{all:initial}\
*{box-sizing:border-box}\
.bd{position:fixed;inset:0;z-index:2147483000;background:rgba(24,21,14,.62);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);display:flex;align-items:center;justify-content:center;padding:24px;opacity:0;transition:opacity .35s ease}\
.bd.on{opacity:1}\
.dlg{position:relative;width:100%;max-width:780px;display:grid;grid-template-columns:320px 1fr;background:#f1eadb;color:#2a261c;box-shadow:0 30px 80px rgba(20,16,8,.45);border-radius:6px;overflow:hidden;transform:translateY(14px) scale(.985);transition:transform .45s cubic-bezier(.2,.8,.2,1);font-family:'Barlow','Helvetica Neue',Arial,sans-serif}\
.bd.on .dlg{transform:none}\
.dlg:focus{outline:none}\
.art{position:relative;min-height:440px;background:radial-gradient(90% 70% at 50% 42%,#56603a 0%,#3f4728 55%,#2f3520 100%);display:flex;align-items:center;justify-content:center;padding:34px 30px;overflow:hidden}\
\
.cover{position:relative;z-index:1;width:100%;max-width:250px;aspect-ratio:1080/1669;object-fit:cover;border-radius:3px;box-shadow:0 28px 50px rgba(10,10,4,.6),0 6px 14px rgba(10,10,4,.4),0 0 0 1px rgba(241,234,219,.12)}\
.tag{position:absolute;z-index:2;left:50%;bottom:16px;transform:translateX(-50%);white-space:nowrap;font:700 12px/1 'Barlow',Arial,sans-serif;letter-spacing:.22em;text-transform:uppercase;color:#f1eadb;border:1px solid rgba(241,234,219,.6);padding:7px 10px;border-radius:3px}\
.body{padding:46px 44px 30px;display:flex;flex-direction:column;justify-content:center}\
.eyebrow{font-size:12px;font-weight:700;letter-spacing:.24em;text-transform:uppercase;color:#7a6431;margin:0 0 16px;display:flex;align-items:center;gap:10px}\
.eyebrow:after{content:'';flex:1;height:1px;background:linear-gradient(90deg,rgba(122,100,49,.5),transparent)}\
h2{text-wrap:balance;font-family:'Oswald',Impact,sans-serif;text-transform:uppercase;font-weight:600;font-size:38px;line-height:1.04;margin:0 0 16px;color:#25231a;letter-spacing:-.005em}\
h2 em{font-style:normal;color:#4b5530;display:block;margin-top:2px}\
.lede{font-size:16.5px;line-height:1.5;color:#4d4636;margin:0 0 22px}\
.lede b span{white-space:nowrap}\
.lede b{display:block;font-family:'Cinzel',Georgia,serif;font-weight:800;color:#2a261c;font-size:17px;letter-spacing:.02em;margin-bottom:4px}\
.lede i{color:#2a261c}\
form{display:flex;gap:8px;margin:0;flex-wrap:wrap}\
input{flex:1 1 200px;min-width:0;font:inherit;font-size:16px;color:#25231a;background:#fbf8f1;border:1px solid #cfc3a6;border-radius:4px;padding:13px 14px;outline:none;transition:border-color .2s,box-shadow .2s}\
input::placeholder{color:#958a72}\
input:focus{border-color:#4b5530;box-shadow:0 0 0 3px rgba(75,85,48,.18)}\
button.go{flex:0 0 auto;font:700 14px/1 'Barlow',Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#f1eadb;background:#3f4728;border:0;border-radius:4px;padding:15px 20px;cursor:pointer;transition:background .15s,transform .15s}\
button.go:hover{background:#4b5530;transform:translateY(-1px)}\
button.go:disabled{opacity:.6;cursor:wait;transform:none}\
.fine{font-size:12.5px;line-height:1.45;color:#857a62;margin:12px 0 0}\
.fine a{color:#6b5a33}\
.err{flex-basis:100%;color:#9a3b22;font-size:13.5px;margin:0}\
.err:empty{display:none}\
.no{align-self:flex-start;margin:10px 0 0 -6px;background:none;border:0;color:#857a62;font:inherit;font-size:13px;text-decoration:underline;text-underline-offset:3px;cursor:pointer;padding:6px}\
.no:hover{color:#4d4636}\
.x{position:absolute;top:10px;right:10px;width:40px;height:40px;border-radius:50%;border:0;background:transparent;color:#857a62;font-size:26px;line-height:40px;cursor:pointer;z-index:3}\
.x:hover{background:rgba(42,38,28,.07);color:#25231a}\
.ok{display:none}\
.ok h3{font-family:'Oswald',Impact,sans-serif;text-transform:uppercase;font-weight:600;font-size:34px;margin:0 0 10px;color:#25231a}\
.ok p{font-size:16px;line-height:1.55;color:#4d4636;margin:0 0 16px}\
.ok .vs{font-style:italic;color:#4b5530;font-size:17px;border-left:2px solid #8f8a55;padding-left:14px;margin:16px 0 22px}\
.ok a.btn{display:inline-block;color:#f1eadb;background:#3f4728;text-decoration:none;font-weight:700;letter-spacing:.1em;text-transform:uppercase;font-size:13px;padding:13px 18px;border-radius:4px}\
.done .form-area{display:none}.done .ok{display:block}\
:focus-visible{outline:2px solid #4b5530;outline-offset:2px}\
@media (max-width:720px){\
 .bd{align-items:flex-end;padding:0}\
 .dlg{grid-template-columns:1fr;max-width:none;border-radius:16px 16px 0 0;max-height:92vh;overflow:auto;transform:translateY(40px)}\
 .art{min-height:0;padding:22px 20px 38px}\
\
 .cover{max-width:132px}\
 .tag{bottom:12px;font-size:11px}\
 .x{background:rgba(241,234,219,.85);color:#25231a}\
 .body{padding:20px 20px 18px}\
 .eyebrow{display:none}\
 h2{font-size:30px;margin-bottom:12px}\
 .lede{font-size:15.5px;margin-bottom:16px}\
 .lede b{font-size:16px}\
 input,button.go{flex-basis:100%}\
 .fine{font-size:12px}\
 .no{display:block;margin:8px auto 0}\
}\
@media (prefers-reduced-motion:reduce){.bd,.dlg{transition:none}}";

  var HTML = '\
<div class="bd" part="backdrop">\
 <div class="dlg" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="myp-h" aria-describedby="myp-d">\
  <button class="x" type="button" aria-label="Close">&times;</button>\
  <div class="art"><img class="cover" alt="Man Your Post by Philip Goodwin, edited by Scott T. Brown" src=""><span class="tag">Free booklet</span></div>\
  <div class="body">\
   <div class="form-area">\
    <p class="eyebrow">For husbands &amp; fathers</p>\
    <h2 id="myp-h">Liberalism may be winning. <em>Not under your roof.</em></h2>\
    <p class="lede" id="myp-d"><b><span>Men, fortify your household.</span> <span>Man your post.</span></b>Get Philip Goodwin&rsquo;s 1655 booklet on Joshua 24:15: lead your family in the worship of God.</p>\
    <form novalidate>\
     <input name="email" type="email" autocomplete="email" placeholder="Your email address" aria-label="Email address" required>\
     <button class="go" type="submit">Send it free</button>\
     <p class="err" role="alert"></p>\
    </form>\
    <p class="fine"><span class="offer"></span> <a class="priv" href="#" target="_blank" rel="noopener">Privacy</a></p>\
    <button class="no" type="button">No thanks</button>\
   </div>\
   <div class="ok" aria-live="polite">\
    <p class="eyebrow">You&rsquo;re in</p>\
    <h3>Check your inbox.</h3>\
    <p>Your free copy of <i>Man Your Post</i> is on its way. Read it this week, then read it with your family.</p>\
    <p class="vs">&ldquo;But as for me and my house, we will serve the Lord.&rdquo; Joshua 24:15</p>\
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
    l.href = "https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Cinzel:wght@700;800;900&family=Barlow:ital,wght@0,400;0,500;0,600;0,700;0,800;1,500&display=swap";
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
      var i = matchMedia("(max-width:720px)").matches ? dlg : root.querySelector('input[name="email"]');
      if (i) i.focus({ preventScroll: true });
    }, 360);
    store.set({ shownAt: Date.now() });
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

  function send(email) {
    if (CFG.demo || !CFG.endpoint) return new Promise(function (r) { setTimeout(function () { r({ ok: true, demo: true }); }, 700); });
    if (CFG.method === "mailchimp-jsonp") {
      var u = CFG.endpoint.replace("/post?", "/post-json?") +
        "&EMAIL=" + encodeURIComponent(email) +
        (CFG.tag ? "&tags=" + encodeURIComponent(CFG.tag) : "");
      return jsonp(u).then(function (d) {
        if (d.result === "success" || /already subscribed/i.test(d.msg || "")) return { ok: true };
        throw new Error((d.msg || "Something went wrong.").replace(/<[^>]+>/g, "").replace(/^\d+ - /, ""));
      });
    }
    return fetch(CFG.endpoint, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, tags: [CFG.tagName || CFG.tag], source: "popup:man-your-post", page: location.href })
    }).then(function (r) { if (!r.ok) throw new Error("We couldn't sign you up just now. Please try again."); return { ok: true }; });
  }

  function submit(e) {
    e.preventDefault();
    var f = e.target, err = root.querySelector(".err"), btn = f.querySelector(".go");
    var email = f.email.value.trim();
    err.textContent = "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { err.textContent = "Please enter a valid email address."; f.email.focus(); return; }
    btn.disabled = true; btn.textContent = "Sending…";
    send(email).then(function () {
      store.set({ subscribed: Date.now() });
      dlg.classList.add("done");
      track("subscribe", CFG.tag);
      setTimeout(function () { dlg.focus({ preventScroll: true }); }, 50);
    }).catch(function (x) {
      err.textContent = x && x.message && x.message !== "network" ? x.message : "We couldn't sign you up just now. Please try again.";
      btn.disabled = false; btn.textContent = "Send it free";
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
    if (eligible()) { (new Image()).src = CFG.coverUrl; arm(); } // warm the cover so it's there when the popup opens
  }

  // Links anywhere on the site: <a href="#man-your-post"> or [data-myp-open] opens it without a reload.
  addEventListener("hashchange", function () { if (location.hash === "#man-your-post") open("hash"); });
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href$="#man-your-post"],[data-myp-open]');
    if (a) { e.preventDefault(); open("click"); }
  });

  // While this campaign runs, other site popups should stand down: check window.CFL_POPUP_TAKEOVER.
  if (!CFG.endsAt || Date.now() <= Date.parse(CFG.endsAt)) window.CFL_POPUP_TAKEOVER = "man-your-post";

  window.CFLManYourPost = { open: open, close: close, reset: function () { try { localStorage.removeItem(KEY); } catch (e) {} }, config: CFG };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
