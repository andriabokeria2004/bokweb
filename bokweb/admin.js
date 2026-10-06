/* ============================================================
   BokWeb Admin panel
   Everything is edited through the server (node server.js):
   texts, images, videos, sections, messages, reviews, login.
   ============================================================ */
(function(){
"use strict";

/* ==================== tiny helpers ==================== */
function $(s){ return document.querySelector(s); }
function el(tag, cls, html){
  var e = document.createElement(tag);
  if(cls) e.className = cls;
  if(html != null) e.innerHTML = html;
  return e;
}
function esc(s){
  return String(s == null ? "" : s).replace(/[&<>"'/]/g, function(c){
    return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;","/":"&#47;"}[c];
  });
}
function toast(msg, err){
  var t = el("div", "toast" + (err ? " err" : ""), esc(msg));
  $("#toasts").appendChild(t);
  setTimeout(function(){ t.remove(); }, 3600);
}
function bust(p){ return p + "?v=" + Date.now(); }

/* ==================== server API ==================== */
function getTok(){ try{ return localStorage.getItem("bw-admin-token") || ""; }catch(e){ return ""; } }
function setTok(v){ try{ localStorage.setItem("bw-admin-token", v); }catch(e){} }

function srvApi(path, body){
  return fetch(path, {
    method: body ? "POST" : "GET",
    headers: Object.assign({"Authorization":"Bearer " + getTok()},
                           body ? {"Content-Type":"application/json"} : {}),
    body: body ? JSON.stringify(body) : undefined
  }).then(function(r){
    if(r.status === 401){ var e = new Error("auth"); e.auth = true; throw e; }
    return r.json().catch(function(){ return {}; }).then(function(d){
      if(!r.ok || d.ok === false) throw new Error(d.error || ("server error " + r.status));
      setSrv(true);
      return d;
    });
  }).catch(function(e){ if(isNetErr(e)) setSrv(false); throw e; });
}
function uploadBlob(relPath, blob){
  return fetch("/api/admin/upload?path=" + encodeURIComponent(relPath), {
    method: "POST",
    headers: {"Authorization":"Bearer " + getTok()},
    body: blob
  }).then(function(r){
    if(r.status === 401){ var e = new Error("auth"); e.auth = true; throw e; }
    return r.json().catch(function(){ return {}; }).then(function(d){
      if(!r.ok || d.ok === false) throw new Error(d.error || ("upload failed " + r.status));
      return d;
    });
  });
}
function srvDelete(path){ return srvApi("/api/admin/delete", {path:path}).catch(function(){}); }
function isNetErr(e){ return !(e && e.auth) && (e instanceof TypeError); }
function setSrv(ok){
  var s = $("#tbSrv");
  s.innerHTML = '<i class="tb-dot' + (ok ? ' ok' : '') + '"></i>' + (ok ? "Connected" : "Server offline?");
}

/* ==================== global state ==================== */
var ADMIN_USER = "";
var CONTENT = {};          /* working copy of site-content.js        */
var BASE    = "{}";        /* last saved snapshot (JSON string)      */
var DIRTY   = false;
var CFG     = {hidden:[], custom:[]};
var LANG    = (function(){ try{ return localStorage.getItem("bw-adm-lang") || "ka"; }catch(e){ return "ka"; } })();
var PANE    = "home";
var CONTENT_PANES = {home:1, services:1, prices:1};
var LANG_NAME = {ka:"Georgian (KA)", en:"English (EN)", ru:"Russian (RU)"};

function ensureLangArr(obj, n, mk){
  if(!obj[LANG]) obj[LANG] = [];
  while(obj[LANG].length < n) obj[LANG].push(mk ? mk() : "");
  return obj[LANG];
}

/* ==================== dirty tracking / save bar ==================== */
function markDirty(){
  if(DIRTY) return;
  DIRTY = true;
  $("#saveBar").hidden = false;
}
function clearDirty(){
  DIRTY = false;
  $("#saveBar").hidden = true;
}
function saveContent(){
  var btn = $("#btnSave"); btn.disabled = true;
  srvApi("/api/admin/content", {content: CONTENT}).then(function(){
    BASE = JSON.stringify(CONTENT);
    clearDirty();
    toast("Saved ✔ Refresh the website to see the changes.");
  }).catch(function(e){
    if(e.auth) return lockPanel("Your session expired — please sign in again.");
    toast(isNetErr(e) ? "Server not reachable — start node server.js" : (e.message || "Could not save"), true);
  }).then(function(){ btn.disabled = false; });
}
function discardContent(){
  CONTENT = JSON.parse(BASE);
  clearDirty();
  if(CONTENT_PANES[PANE]) renderPane(PANE);
  toast("Changes discarded");
}
$("#btnSave").addEventListener("click", saveContent);
$("#btnDiscard").addEventListener("click", discardContent);
window.addEventListener("beforeunload", function(e){
  if(!DIRTY) return;
  e.preventDefault();
  e.returnValue = "";
});

/* ==================== field builders ==================== */
function fld(label, get, set, o){
  o = o || {};
  var lab = el("label", "f-lab");
  lab.innerHTML = esc(label) + (o.small ? " <small>" + esc(o.small) + "</small>" : "");
  var inp = document.createElement(o.ml ? "textarea" : "input");
  if(o.ml) inp.rows = o.rows || 3;
  if(o.ph) inp.placeholder = o.ph;
  var v = get();
  inp.value = v == null ? "" : v;
  inp.addEventListener("input", function(){ set(inp.value); markDirty(); if(o.oninput) o.oninput(inp.value); });
  lab.appendChild(inp);
  return lab;
}
function linesFld(label, getArr, setArr, o){
  o = o || {};
  return fld(label, function(){
    var a = getArr(); return Array.isArray(a) ? a.join("\n") : "";
  }, function(v){
    setArr(String(v).split("\n").map(function(x){ return x.trim(); }).filter(Boolean));
  }, {ml:true, rows:o.rows || 5, small:o.small || "one per line · თითო ხაზზე"});
}
var FRIENDLY_LABELS = {
  ts_quote: "Quote (what the client said)",
  ts_author: "Client name",
  ts_role: "Client business / role"
};
function keyLabel(k){ return FRIENDLY_LABELS[k] || k.replace(/_/g, " "); }
function isLong(v){ return String(v == null ? "" : v).length > 70 || /\n/.test(String(v || "")); }

/* card of i18n key fields */
function dictGroupCard(title, dict, keys, sub){
  var card = el("div", "card");
  card.appendChild(el("h3", null, esc(title)));
  if(sub) card.appendChild(el("p", "sub", esc(sub)));
  var grid = el("div", "grid2");
  keys.forEach(function(k){
    grid.appendChild(fld(keyLabel(k),
      function(){ return dict[LANG] ? dict[LANG][k] : ""; },
      function(v){ if(!dict[LANG]) dict[LANG] = {}; dict[LANG][k] = v; },
      {ml: isLong(dict[LANG] && dict[LANG][k])}));
  });
  card.appendChild(grid);
  return card;
}
/* split a dict's keys into prefix groups (keeps original order) */
function groupKeys(dict, groups){
  var langObj = dict[LANG] || dict.ka || dict.en || {};
  var all = Object.keys(langObj);
  var used = {};
  var out = [];
  groups.forEach(function(g){
    var ks = all.filter(function(k){
      if(used[k]) return false;
      return g.p.some(function(p){ return k.indexOf(p) === 0; });
    });
    ks.forEach(function(k){ used[k] = 1; });
    if(ks.length) out.push({t: g.t, sub: g.sub, keys: ks});
  });
  var rest = all.filter(function(k){ return !used[k]; });
  if(rest.length) out.push({t: "Other texts", keys: rest});
  return out;
}
function accCard(numLabel, titleText){
  var acc = el("div", "acc");
  var head = el("button", "acc-head");
  head.type = "button";
  head.innerHTML = '<span class="acc-num">' + esc(numLabel) + '</span>' +
    '<span class="grow">' + esc(titleText) + '</span>' +
    '<svg class="acc-chev" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>';
  var body = el("div", "acc-body");
  head.addEventListener("click", function(){ acc.classList.toggle("open"); });
  acc.appendChild(head); acc.appendChild(body);
  return {acc:acc, head:head, body:body,
    setTitle:function(t){ head.querySelector(".grow").textContent = t; }};
}
function langNote(pane){
  return el("p", "pane-intro",
    'You are editing the <b>' + esc(LANG_NAME[LANG] || LANG) + '</b> version — switch language at the top right. ' +
    'Changes go live after you press <b>Save</b> below and refresh the website. · ' +
    'ცვლილებები საიტზე „Save"-ის შემდეგ აისახება.');
}
function missingContentWarn(){
  var w = el("div", "warn");
  w.innerHTML = "⚠ <b>site-content.js is missing or empty</b>, so texts can't be edited. " +
    "Restore it from <code>data/site-content-prev.js</code> (rename it back to <code>site-content.js</code> " +
    "in the website folder) and refresh this page.";
  return w;
}
function hasContent(){
  return CONTENT && CONTENT.i18n && CONTENT.i18n.ka && Object.keys(CONTENT.i18n.ka).length > 0;
}

/* ==================== PANE: Home & general ==================== */
var HOME_GROUPS = [
  {p:["hero_"],  t:"Hero — the very top of the home page"},
  {p:["why_"],   t:"“Why BokWeb” section"},
  {p:["pf_"],    t:"Portfolio — section labels"},
  {p:["feat_"],  t:"“How we work” — three steps"},
  {p:["ts_"],    t:"Featured testimonial (the big quote on the home page)",
   sub:"The main testimonial shown on your home page. Change the quote, the person’s name and their business here."},
  {p:["rv_"],    t:"Reviews section — labels"},
  {p:["ob_"],    t:"Order form", sub:"Opens when a visitor presses an “Order” button."},
  {p:["foot_"],  t:"Footer — labels & newsletter"},
  {p:["nav_","team_","work_","svc","lang_"], t:"Menu & navigation",
   sub:"Links and dropdowns in the top menu (and the same items in the footer)."}
];
function renderHome(){
  var pane = $("#pane-home");
  pane.innerHTML = "";
  if(!hasContent()){ pane.appendChild(missingContentWarn()); return; }
  pane.appendChild(langNote());

  groupKeys(CONTENT.i18n, HOME_GROUPS).forEach(function(g){
    pane.appendChild(dictGroupCard(g.t, CONTENT.i18n, g.keys, g.sub));
  });

  /* portfolio slides */
  var pf = el("div", "card");
  pf.appendChild(el("h3", null, "Portfolio — slide texts"));
  pf.appendChild(el("p", "sub", "Slide 1 is the showreel video, slides 2–4 are the pictures (change the pictures in the Images tab)."));
  ensureLangArr(CONTENT.pf, 4, function(){ return {name:"",cat:"",result:"",t1:"",t2:""}; })
    .forEach(function(s, i){
      var box = el("div", null);
      box.appendChild(el("p", "group-t", "Slide " + (i+1)));
      var grid = el("div", "grid2");
      [["name","Title"],["cat","Category"],["result","Caption / result"],["t1","Tag 1"],["t2","Tag 2"]]
        .forEach(function(f){
          grid.appendChild(fld(f[1],
            function(){ return s[f[0]]; },
            function(v){ s[f[0]] = v; }));
        });
      box.appendChild(grid);
      pf.appendChild(box);
    });
  pane.appendChild(pf);

  /* footer columns */
  var fc = el("div", "card");
  fc.appendChild(el("h3", null, "Footer — link columns"));
  fc.appendChild(el("p", "sub", "Four columns of links at the bottom of every page."));
  var grid = el("div", "grid2");
  ensureLangArr(CONTENT.foot, 4, function(){ return {title:"", links:[]}; })
    .forEach(function(c, i){
      var box = el("div", null);
      box.appendChild(fld("Column " + (i+1) + " — title",
        function(){ return c.title; }, function(v){ c.title = v; }));
      box.appendChild(linesFld("Column " + (i+1) + " — links",
        function(){ return c.links; }, function(a){ c.links = a; }, {rows:4}));
      grid.appendChild(box);
    });
  fc.appendChild(grid);
  pane.appendChild(fc);
}

/* ==================== PANE: Services page ==================== */
function renderServices(){
  var pane = $("#pane-services");
  pane.innerHTML = "";
  if(!hasContent()){ pane.appendChild(missingContentWarn()); return; }
  pane.appendChild(langNote());

  var labels = groupKeys(CONTENT.service_i18n, [
    {p:["svc_","lang_","ob_"], t:"Page labels", sub:"Headline and buttons at the top of the services page."}
  ]);
  labels.forEach(function(g){ pane.appendChild(dictGroupCard(g.t, CONTENT.service_i18n, g.keys, g.sub)); });

  pane.appendChild(el("p", "group-t", "The 8 services"));
  pane.appendChild(el("p", "pane-intro", "Each service has a name (menu / side list), a big title, a description and four bullet points. Banners are changed in the Images tab."));

  ensureLangArr(CONTENT.services, 8, function(){ return {name:"",title:"",desc:"",points:["","","",""]}; })
    .forEach(function(s, i){
      if(!Array.isArray(s.points)) s.points = ["","","",""];
      while(s.points.length < 4) s.points.push("");
      var a = accCard(i+1, s.name || ("Service " + (i+1)));
      if(i === 0) a.acc.classList.add("open");
      a.body.appendChild(fld("Name (short)",
        function(){ return s.name; },
        function(v){ s.name = v; },
        {oninput:function(v){ a.setTitle(v || ("Service " + (i+1))); }}));
      a.body.appendChild(fld("Big title",
        function(){ return s.title; }, function(v){ s.title = v; }));
      a.body.appendChild(fld("Description",
        function(){ return s.desc; }, function(v){ s.desc = v; }, {ml:true}));
      var grid = el("div", "grid2");
      for(var p = 0; p < 4; p++)(function(p){
        grid.appendChild(fld("Point " + (p+1),
          function(){ return s.points[p]; }, function(v){ s.points[p] = v; }));
      })(p);
      a.body.appendChild(grid);
      pane.appendChild(a.acc);
    });
}

/* ==================== PANE: Prices page ==================== */
var PRICE_GROUPS = [
  {p:["price_","pop_","swipe_"], t:"Plans section — labels"},
  {p:["hl_"],   t:"“What you get” — labels"},
  {p:["feat_"], t:"Feature blocks — labels"},
  {p:["faq_"],  t:"FAQ — labels"},
  {p:["cta_"],  t:"Bottom call-to-action"},
  {p:["ob_"],   t:"Order form (prices page)"}
];
function renderPrices(){
  var pane = $("#pane-prices");
  pane.innerHTML = "";
  if(!hasContent()){ pane.appendChild(missingContentWarn()); return; }
  pane.appendChild(langNote());

  /* the three plans */
  if(!Array.isArray(CONTENT.plan_names))  CONTENT.plan_names  = ["","",""];
  if(!Array.isArray(CONTENT.plan_prices)) CONTENT.plan_prices = ["","",""];
  var plansArr = ensureLangArr(CONTENT.plans, 3, function(){ return {eyebrow:"",tagline:"",features:[]}; });
  pane.appendChild(el("p", "group-t", "The 3 plans"));
  plansArr.forEach(function(p, i){
    if(!Array.isArray(p.features)) p.features = [];
    var a = accCard(i+1, (CONTENT.plan_names[i] || "Plan " + (i+1)) + " — " + (CONTENT.plan_prices[i] || ""));
    if(i === 0) a.acc.classList.add("open");
    function head(){ a.setTitle((CONTENT.plan_names[i] || "Plan " + (i+1)) + " — " + (CONTENT.plan_prices[i] || "")); }
    var grid = el("div", "grid2");
    grid.appendChild(fld("Plan name", 
      function(){ return CONTENT.plan_names[i]; },
      function(v){ CONTENT.plan_names[i] = v; },
      {small:"same in all languages", oninput:head}));
    grid.appendChild(fld("Starting price",
      function(){ return CONTENT.plan_prices[i]; },
      function(v){ CONTENT.plan_prices[i] = v; },
      {small:"e.g. ₾790 — same in all languages", oninput:head}));
    grid.appendChild(fld("Eyebrow (small line above the name)",
      function(){ return p.eyebrow; }, function(v){ p.eyebrow = v; }));
    grid.appendChild(fld("Tagline",
      function(){ return p.tagline; }, function(v){ p.tagline = v; }));
    a.body.appendChild(grid);
    a.body.appendChild(linesFld("Included features",
      function(){ return p.features; }, function(x){ p.features = x; }));
    pane.appendChild(a.acc);
  });

  /* highlights */
  var hl = el("div", "card");
  hl.appendChild(el("h3", null, "“What you get” — 5 highlight cards"));
  hl.appendChild(el("p", "sub", "One line each. Pictures are changed in the Images tab."));
  var hlArr = ensureLangArr(CONTENT.highlights, 5);
  var hgrid = el("div", "grid2");
  hlArr.forEach(function(_, i){
    hgrid.appendChild(fld("Card " + (i+1),
      function(){ return CONTENT.highlights[LANG][i]; },
      function(v){ CONTENT.highlights[LANG][i] = v; }));
  });
  hl.appendChild(hgrid);
  pane.appendChild(hl);

  /* feature blocks */
  var ft = el("div", "card");
  ft.appendChild(el("h3", null, "Feature blocks — 3 big text blocks"));
  var ftArr = ensureLangArr(CONTENT.feat, 3, function(){ return {title:"",text:""}; });
  ftArr.forEach(function(f, i){
    ft.appendChild(el("p", "group-t", "Block " + (i+1)));
    ft.appendChild(fld("Title", function(){ return f.title; }, function(v){ f.title = v; }));
    ft.appendChild(fld("Text",  function(){ return f.text; },  function(v){ f.text = v; }, {ml:true}));
  });
  pane.appendChild(ft);

  /* FAQ */
  var fq = el("div", "card");
  fq.appendChild(el("h3", null, "FAQ — questions & answers"));
  var fqArr = ensureLangArr(CONTENT.faq, 5, function(){ return {q:"",a:""}; });
  fqArr.forEach(function(f, i){
    fq.appendChild(el("p", "group-t", "Question " + (i+1)));
    fq.appendChild(fld("Question", function(){ return f.q; }, function(v){ f.q = v; }));
    fq.appendChild(fld("Answer",   function(){ return f.a; }, function(v){ f.a = v; }, {ml:true}));
  });
  pane.appendChild(fq);

  /* page labels */
  groupKeys(CONTENT.prices_i18n, PRICE_GROUPS).forEach(function(g){
    pane.appendChild(dictGroupCard(g.t, CONTENT.prices_i18n, g.keys, g.sub));
  });
}

/* ==================== PANES: Images / Videos ==================== */
var IMG_GROUPS = [
  {g:"Logo (used on every page)", items:[
    {f:"images/logo/logo-light.png", n:"Full logo — light theme"},
    {f:"images/logo/logo-dark.png",  n:"Full logo — dark theme", dk:1},
    {f:"images/logo/mark-light.png", n:"Square mark — light"},
    {f:"images/logo/mark-dark.png",  n:"Square mark — dark", dk:1}]},
  {g:"Home — Portfolio slides", items:[
    {f:"images/portfolio/shot-1.png", n:"Slide 2 (best ≈ 2000×1000)"},
    {f:"images/portfolio/shot-2.png", n:"Slide 3 (best ≈ 2000×1000)"},
    {f:"images/portfolio/shot-3.png", n:"Slide 4 (best ≈ 2000×1000)"}]},
  {g:"Home — Features 01 / 02 / 03", items:[
    {f:"images/features/feature-1.png", n:"01 — Show what you sell"},
    {f:"images/features/feature-2.png", n:"02 — Make contact effortless"},
    {f:"images/features/feature-3.png", n:"03 — Turn visits into requests"}]},
  {g:"Services page — 8 banners (phone copies are made automatically)",
   items:[1,2,3,4,5,6,7,8].map(function(i){
     return {f:"images/services/service-"+i+".png", n:"Service "+i, variants:true}; })},
  {g:"Prices — hero slideshow", items:[1,2,3].map(function(i){
    return {f:"images/prices/hero-"+i+".png", n:"Plan "+i+" hero"}; })},
  {g:"Prices — plan card backgrounds", items:[1,2,3].map(function(i){
    return {f:"images/prices/plan-"+i+".png", n:"Plan card "+i}; })},
  {g:"Prices — highlight cards", items:[1,2,3,4,5].map(function(i){
    return {f:"images/prices/highlight-"+i+".png", n:"Highlight "+i}; })},
  {g:"Prices — wide bands + CTA", items:[
    {f:"images/prices/band-1.png", n:"Band 1"},
    {f:"images/prices/band-2.png", n:"Band 2"},
    {f:"images/prices/band-3.png", n:"Band 3"},
    {f:"images/prices/cta.png",    n:"CTA background"}]}
];
var VID_GROUPS = [
  {g:"Home — Portfolio showreel", items:[
    {f:"images/portfolio/video-1.mp4", n:"Slide 1 — showreel video"}]},
  {g:"Prices — plan videos (optional; the poster image shows until a video is added)", items:[
    {f:"videos/basic.mp4",   n:"Basic plan video"},
    {f:"videos/pro.mp4",     n:"Pro plan video"},
    {f:"videos/proplus.mp4", n:"Pro Plus plan video"}]}
];

function toPngBlob(source, width){
  return createImageBitmap(source).then(function(bmp){
    var w = width ? Math.min(width, bmp.width) : bmp.width;
    var h = Math.round(bmp.height * w / bmp.width);
    var c = document.createElement("canvas");
    c.width = w; c.height = h;
    var x = c.getContext("2d");
    x.imageSmoothingEnabled = true;
    x.imageSmoothingQuality = "high";
    x.drawImage(bmp, 0, 0, w, h);
    return new Promise(function(res){ c.toBlob(res, "image/png"); });
  });
}
function refreshPv(slot, card){
  var pv = card.querySelector(".slot-pv");
  var url = bust("/" + slot.f);
  if(/\.(mp4|webm)$/i.test(slot.f)){
    pv.innerHTML = '<video muted preload="metadata"></video>';
    var v = pv.querySelector("video");
    v.onerror = function(){ pv.innerHTML = '<span class="miss">no file yet</span>'; };
    v.src = url;
  } else {
    pv.innerHTML = '<img alt="">';
    var im = pv.querySelector("img");
    im.onerror = function(){ pv.innerHTML = '<span class="miss">no file yet</span>'; };
    im.src = url;
  }
}
function slotCard(slot, isVideo){
  var card = el("div", "slot");
  card.innerHTML =
    '<div class="slot-pv' + (slot.dk ? ' dk' : '') + '"><span class="miss">…</span></div>' +
    '<div class="slot-meta">' +
      '<div class="slot-fn">' + esc(slot.f) + '</div>' +
      '<div class="slot-nt">' + esc(slot.n) + '</div>' +
      '<label class="slot-btn">Replace · შეცვლა' +
        '<input type="file" accept="' + (isVideo ? 'video/mp4,video/webm' : 'image/*') + '">' +
      '</label>' +
      '<div class="slot-prog" hidden>Uploading…</div>' +
    '</div>';
  card.querySelector("input").addEventListener("change", function(e){
    var file = e.target.files && e.target.files[0];
    e.target.value = "";
    if(!file) return;
    if(isVideo) replaceVideo(slot, file, card); else replaceImage(slot, file, card);
  });
  refreshPv(slot, card);
  return card;
}
function busy(card, on){
  card.classList.toggle("busy", on);
  card.querySelector(".slot-prog").hidden = !on;
}
function upErr(card, e){
  busy(card, false);
  if(e && e.auth) return lockPanel("Your session expired — please sign in again.");
  toast(isNetErr(e) ? "Server not reachable — start node server.js" : ("Could not save: " + (e.message || e)), true);
}
function replaceImage(slot, file, card){
  if(!/^image\//.test(file.type)){ toast("That file is not an image", true); return; }
  busy(card, true);
  var base = (file.type === "image/png") ? Promise.resolve(file) : toPngBlob(file);
  base.then(function(b){ return uploadBlob(slot.f, b); })
  .then(function(){
    if(!slot.variants) return;
    var stem = slot.f.replace(/\.png$/, "");
    return toPngBlob(file, 640).then(function(b){ return uploadBlob(stem + "-640.png", b); })
      .then(function(){ return toPngBlob(file, 1024); })
      .then(function(b){ return uploadBlob(stem + "-1024.png", b); });
  })
  .then(function(){
    busy(card, false);
    toast("Saved: " + slot.f + (slot.variants ? " (+ phone copies)" : ""));
    refreshPv(slot, card);
  })
  .catch(function(e){ upErr(card, e); });
}
function replaceVideo(slot, file, card){
  if(!/^video\//.test(file.type)){ toast("That file is not a video", true); return; }
  if(file.size > 120 * 1024 * 1024){ toast("Video is over 120 MB — please compress it first", true); return; }
  busy(card, true);
  uploadBlob(slot.f, file).then(function(){
    busy(card, false);
    toast("Saved: " + slot.f);
    refreshPv(slot, card);
  }).catch(function(e){ upErr(card, e); });
}
function renderSlots(groups, paneSel, isVideo){
  var pane = $(paneSel);
  pane.innerHTML = "";
  pane.appendChild(el("p", "pane-intro",
    isVideo ? "Click Replace and choose a video — it is uploaded straight into the website folder."
            : "Click Replace and choose a picture — it is converted and uploaded straight into the website folder. No refresh needed here."));
  groups.forEach(function(g){
    pane.appendChild(el("h2", "group-t", esc(g.g)));
    var grid = el("div", "slot-grid");
    g.items.forEach(function(s){ grid.appendChild(slotCard(s, isVideo)); });
    pane.appendChild(grid);
  });
}

/* ==================== PANE: Sections ==================== */
var BUILTINS = [
  {id:"why",         n:"Why BokWeb · რატომ BokWeb"},
  {id:"portfolio",   n:"Portfolio · ნამუშევრები"},
  {id:"features",    n:"How we work · როგორ ვმუშაობთ"},
  {id:"testimonial", n:"Review · შეფასება"}
];
var editingId = null;
function saveConfig(){
  return srvApi("/api/admin/config", {config: {hidden: CFG.hidden, custom: CFG.custom}});
}
function renderSections(){
  var pane = $("#pane-sections");
  pane.innerHTML = "";
  pane.appendChild(el("p", "pane-intro",
    "Turn built-in home page sections on or off, or add your own sections with a title, text and picture in all three languages."));

  pane.appendChild(el("h2", "group-t", "Built-in sections"));
  BUILTINS.forEach(function(b){
    var on = CFG.hidden.indexOf(b.id) === -1;
    var row = el("div", "row");
    row.innerHTML =
      '<label class="sw"><input type="checkbox" ' + (on ? "checked" : "") + '><i></i></label>' +
      '<b>' + esc(b.n) + '</b><span class="grow"></span>' +
      '<span class="hint">' + (on ? "visible on the site" : "hidden") + '</span>';
    row.querySelector("input").addEventListener("change", function(e){
      if(e.target.checked) CFG.hidden = CFG.hidden.filter(function(x){ return x !== b.id; });
      else if(CFG.hidden.indexOf(b.id) === -1) CFG.hidden.push(b.id);
      saveConfig().then(function(){
        toast(e.target.checked ? "Section shown: " + b.id : "Section hidden: " + b.id);
        renderSections();
      }).catch(function(err){
        if(err.auth) return lockPanel("Your session expired — please sign in again.");
        toast("Could not save: " + (err.message || err), true);
      });
    });
    pane.appendChild(row);
  });

  pane.appendChild(el("h2", "group-t", "Your custom sections"));
  if(!CFG.custom.length){
    pane.appendChild(el("div", "empty", "No custom sections yet — add one below."));
  }
  CFG.custom.forEach(function(cs){
    var title = (cs.t && (cs.t.ka || cs.t.en || cs.t.ru)) || "(no title)";
    var row = el("div", "row");
    row.innerHTML = '<b>' + esc(title) + '</b>' +
      '<span class="hint">after: ' + esc(cs.after || "features") + (cs.img ? " · has picture" : "") + '</span>' +
      '<span class="grow"></span>' +
      '<button class="btn btn-sm" data-a="edit">Edit</button>' +
      '<button class="btn btn-sm btn-danger" data-a="del">Delete</button>';
    row.querySelector('[data-a="del"]').addEventListener("click", function(){
      if(!confirm("Delete this section? · წავშალოთ ეს სექცია?")) return;
      CFG.custom = CFG.custom.filter(function(x){ return x.id !== cs.id; });
      saveConfig().then(function(){
        if(cs.img) srvDelete(cs.img);
        toast("Section deleted");
        renderSections();
      }).catch(function(e){ toast("Could not save: " + (e.message || e), true); });
    });
    row.querySelector('[data-a="edit"]').addEventListener("click", function(){
      editingId = cs.id;
      renderSections();
    });
    pane.appendChild(row);
  });

  /* add / edit form */
  var editing = editingId ? CFG.custom.filter(function(x){ return x.id === editingId; })[0] : null;
  var form = el("form", "card");
  form.appendChild(el("h3", null, editing ? "Edit section" : "Add a new section"));
  form.innerHTML +=
    '<label class="f-lab">Show it after' +
      '<select id="csAfter">' +
        '<option value="hero">Hero (top)</option>' +
        '<option value="why">Why BokWeb</option>' +
        '<option value="portfolio">Portfolio</option>' +
        '<option value="features" selected>How we work</option>' +
        '<option value="testimonial">Review</option>' +
      '</select></label>' +
    '<div class="grid2">' +
      '<label class="f-lab">Title (KA)<input id="csTKa"></label>' +
      '<label class="f-lab">Title (EN)<input id="csTEn"></label>' +
      '<label class="f-lab">Title (RU)<input id="csTRu"></label>' +
    '</div>' +
    '<div class="grid2">' +
      '<label class="f-lab">Text (KA)<textarea id="csBKa" rows="3"></textarea></label>' +
      '<label class="f-lab">Text (EN)<textarea id="csBEn" rows="3"></textarea></label>' +
      '<label class="f-lab">Text (RU)<textarea id="csBRu" rows="3"></textarea></label>' +
    '</div>' +
    '<label class="f-lab">Picture (optional)<input type="file" id="csImg" accept="image/*"></label>' +
    '<div class="f-actions">' +
      '<button class="btn btn-primary" type="submit">' + (editing ? "Save changes" : "Add section · დამატება") + '</button>' +
      (editing ? '<button class="btn" type="button" id="csCancel">Cancel</button>' : '') +
    '</div>';
  if(editing){
    form.querySelector("#csAfter").value = editing.after || "features";
    form.querySelector("#csTKa").value = (editing.t && editing.t.ka) || "";
    form.querySelector("#csTEn").value = (editing.t && editing.t.en) || "";
    form.querySelector("#csTRu").value = (editing.t && editing.t.ru) || "";
    form.querySelector("#csBKa").value = (editing.b && editing.b.ka) || "";
    form.querySelector("#csBEn").value = (editing.b && editing.b.en) || "";
    form.querySelector("#csBRu").value = (editing.b && editing.b.ru) || "";
    var cn = form.querySelector("#csCancel");
    if(cn) cn.addEventListener("click", function(){ editingId = null; renderSections(); });
  }
  form.addEventListener("submit", function(e){
    e.preventDefault();
    var t = {ka: form.querySelector("#csTKa").value.trim(),
             en: form.querySelector("#csTEn").value.trim(),
             ru: form.querySelector("#csTRu").value.trim()};
    var b = {ka: form.querySelector("#csBKa").value.trim(),
             en: form.querySelector("#csBEn").value.trim(),
             ru: form.querySelector("#csBRu").value.trim()};
    if(!(t.ka || t.en || t.ru)){ toast("Please write a title in at least one language", true); return; }
    var cs = editing || {id: "cs_" + Date.now().toString(36)};
    cs.after = form.querySelector("#csAfter").value;
    cs.t = t; cs.b = b;
    var imgFile = form.querySelector("#csImg").files && form.querySelector("#csImg").files[0];
    var prep = Promise.resolve();
    if(imgFile){
      if(!/^image\//.test(imgFile.type)){ toast("Section picture must be an image", true); return; }
      cs.img = "images/custom/" + cs.id + ".png";
      prep = toPngBlob(imgFile, 2000).then(function(blob){ return uploadBlob(cs.img, blob); });
    }
    prep.then(function(){
      if(!editing) CFG.custom.push(cs);
      return saveConfig();
    }).then(function(){
      toast(editing ? "Section updated ✔" : "Section added ✔ Refresh the site to see it");
      editingId = null;
      renderSections();
    }).catch(function(err){
      if(err.auth) return lockPanel("Your session expired — please sign in again.");
      toast("Could not save: " + (err.message || err), true);
    });
  });
  pane.appendChild(form);
}

/* ==================== PANES: Messages / Reviews ==================== */
function fmtWhen(ts){
  try{ return new Date(ts).toLocaleString("en-GB",
    {day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit"}); }
  catch(e){ return ""; }
}
function starTxt(n){
  var s = "";
  for(var i = 1; i <= 10; i++) s += i <= n ? "★" : '<span class="off">★</span>';
  return '<span class="stars">' + s + '</span> <b>' + n + '/10</b>';
}
function setBadge(id, n){
  var b = $(id);
  b.hidden = !n;
  b.textContent = n;
}
function paneAuthErr(e, box, retry){
  if(e.auth) return lockPanel("Your session expired — please sign in again.");
  box.innerHTML = "";
  var card = el("div", "card");
  card.innerHTML = '<h3>Server is not reachable</h3>' +
    '<p class="sub">Messages and reviews live on your server. Start it with <code>node server.js</code> ' +
    'and open this panel at <code>http://localhost:3000/admin.html</code>.</p>';
  var b = el("button", "btn", "Try again");
  b.addEventListener("click", retry);
  card.appendChild(b);
  box.appendChild(card);
}
function actionErr(e){
  if(e && e.auth) return lockPanel("Your session expired — please sign in again.");
  toast(e && e.message ? e.message : "Server error", true);
}
function renderMessages(){
  var pane = $("#pane-messages");
  srvApi("/api/admin/orders").then(function(d){
    var list = d.orders || [];
    setBadge("#bMsg", list.filter(function(o){ return !o.read; }).length);
    pane.innerHTML = "";
    var tbar = el("div", "toolbar",
      '<h2>Contact form messages</h2><button class="btn btn-sm" id="msgRefresh">Refresh · განახლება</button>');
    tbar.querySelector("#msgRefresh").addEventListener("click", renderMessages);
    pane.appendChild(tbar);
    if(!list.length){
      pane.appendChild(el("div", "empty", "No messages yet — they appear here the moment a client sends the form."));
      return;
    }
    list.forEach(function(o){
      var card = el("div", "msg" + (o.read ? "" : " unread"),
        '<div class="msg-top"><b>' + esc(o.name || "(no name)") + '</b>' +
        (o.biz ? '<span>· ' + esc(o.biz) + '</span>' : '') +
        (o.read ? '' : '<span class="tag-new">NEW</span>') +
        '<span class="msg-when">' + esc(fmtWhen(o.ts)) + (o.lang ? ' · ' + esc(o.lang.toUpperCase()) : '') + '</span></div>' +
        '<div class="msg-contact">' + esc(o.contact) + '</div>' +
        '<div class="msg-body">' + esc(o.msg || "") + '</div>' +
        '<div class="msg-actions">' +
          (o.read ? '' : '<button class="btn btn-sm" data-a="read">Mark read · წაკითხულია</button>') +
          '<button class="btn btn-sm btn-danger" data-a="del">Delete</button></div>');
      var rd = card.querySelector('[data-a="read"]');
      if(rd) rd.addEventListener("click", function(){
        srvApi("/api/admin/action", {type:"order-read", id:o.id}).then(renderMessages).catch(actionErr);
      });
      card.querySelector('[data-a="del"]').addEventListener("click", function(){
        if(!confirm("Delete this message?")) return;
        srvApi("/api/admin/action", {type:"order-del", id:o.id}).then(renderMessages).catch(actionErr);
      });
      pane.appendChild(card);
    });
  }).catch(function(e){ paneAuthErr(e, pane, renderMessages); });
}
function renderReviews(){
  var pane = $("#pane-reviews");
  Promise.all([srvApi("/api/admin/reviews"), srvApi("/api/admin/settings")]).then(function(res){
    var list = res[0].reviews || [];
    var st = res[1].settings || {};
    var pending = list.filter(function(r){ return !r.approved; });
    setBadge("#bRv", pending.length);
    pane.innerHTML = "";
    var tbar = el("div", "toolbar",
      '<h2>Client reviews</h2><button class="btn btn-sm" id="rvRefresh">Refresh · განახლება</button>');
    tbar.querySelector("#rvRefresh").addEventListener("click", renderReviews);
    pane.appendChild(tbar);

    var sw = el("div", "row");
    sw.innerHTML =
      '<label class="sw"><input type="checkbox" id="autoOk" ' + (st.autoApprove ? "checked" : "") + '><i></i></label>' +
      '<b>Publish new reviews automatically · ავტომატური გამოქვეყნება</b>' +
      '<span class="grow"></span><span class="hint">' +
      (st.autoApprove ? "reviews go live instantly" : "you approve each review first") + '</span>';
    sw.querySelector("#autoOk").addEventListener("change", function(e){
      srvApi("/api/admin/settings", {autoApprove: e.target.checked}).then(function(){
        toast(e.target.checked ? "Reviews now publish instantly" : "Reviews now wait for your approval");
        renderReviews();
      }).catch(actionErr);
    });
    pane.appendChild(sw);

    if(!list.length){ pane.appendChild(el("div", "empty", "No reviews yet.")); return; }
    function card(r){
      var c = el("div", "msg" + (r.approved ? "" : " unread"),
        '<div class="msg-top"><b>' + esc(r.name) + '</b>' +
        (r.approved ? '' : '<span class="tag-new">PENDING</span>') +
        '<span class="msg-when">' + esc(fmtWhen(r.ts)) + '</span></div>' +
        '<div>' + starTxt(r.rating) + '</div>' +
        '<div class="msg-body">' + esc(r.text) + '</div>' +
        '<div class="msg-actions">' +
          (r.approved ? '' : '<button class="btn btn-sm btn-primary" data-a="ok">Approve · დადასტურება</button>') +
          '<button class="btn btn-sm btn-danger" data-a="del">Delete</button></div>');
      var ok = c.querySelector('[data-a="ok"]');
      if(ok) ok.addEventListener("click", function(){
        srvApi("/api/admin/action", {type:"rv-approve", id:r.id}).then(function(){
          toast("Review approved — it is now on the site");
          renderReviews();
        }).catch(actionErr);
      });
      c.querySelector('[data-a="del"]').addEventListener("click", function(){
        if(!confirm("Delete this review?")) return;
        srvApi("/api/admin/action", {type:"rv-del", id:r.id}).then(renderReviews).catch(actionErr);
      });
      return c;
    }
    if(pending.length){
      pane.appendChild(el("h2", "group-t", "Waiting for approval (" + pending.length + ")"));
      pending.forEach(function(r){ pane.appendChild(card(r)); });
    }
    var pub = list.filter(function(r){ return r.approved; });
    if(pub.length){
      pane.appendChild(el("h2", "group-t", "Published on the site (" + pub.length + ")"));
      pub.forEach(function(r){ pane.appendChild(card(r)); });
    }
  }).catch(function(e){ paneAuthErr(e, pane, renderReviews); });
}
function renderSubscribers(){
  var pane = $("#pane-subscribers");
  srvApi("/api/admin/subscribers").then(function(res){
    var list = res.subscribers || [];
    pane.innerHTML = "";
    var tbar = el("div", "toolbar",
      '<h2>Newsletter subscribers · გამომწერები</h2>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
        '<button class="btn btn-sm" id="subRefresh">Refresh · განახლება</button>' +
        (list.length ? '<button class="btn btn-sm" id="subCopy">Copy all emails</button>' +
                       '<button class="btn btn-sm btn-primary" id="subCsv">Download CSV</button>' : '') +
      '</div>');
    tbar.querySelector("#subRefresh").addEventListener("click", renderSubscribers);
    pane.appendChild(tbar);

    pane.appendChild(el("p", "pane-intro",
      "People who subscribed through the footer form on your website. Their emails are saved here so you can send them updates."));

    if(!list.length){
      pane.appendChild(el("div", "empty", "No subscribers yet — they appear here when someone signs up in the footer."));
      return;
    }

    var emails = list.map(function(s){ return s.email; });
    var copyBtn = tbar.querySelector("#subCopy");
    if(copyBtn) copyBtn.addEventListener("click", function(){
      var text = emails.join(", ");
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(text).then(function(){ toast("Copied " + emails.length + " emails"); })
          .catch(function(){ toast("Could not copy", true); });
      } else {
        var ta = document.createElement("textarea");
        ta.value = text; document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); toast("Copied " + emails.length + " emails"); }
        catch(e){ toast("Could not copy", true); }
        ta.remove();
      }
    });
    var csvBtn = tbar.querySelector("#subCsv");
    if(csvBtn) csvBtn.addEventListener("click", function(){
      var rows = [["email","date"]].concat(list.map(function(s){
        return [s.email, new Date(s.ts).toISOString().slice(0,10)];
      }));
      var csv = rows.map(function(r){
        return r.map(function(c){ return '"' + String(c).replace(/"/g, '""') + '"'; }).join(",");
      }).join("\n");
      var blob = new Blob([csv], {type:"text/csv"});
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "bokweb-subscribers.csv";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function(){ URL.revokeObjectURL(a.href); }, 1000);
      toast("Downloaded " + list.length + " subscribers");
    });

    pane.appendChild(el("p", "group-t", list.length + " subscriber" + (list.length === 1 ? "" : "s")));
    list.forEach(function(s){
      var row = el("div", "row",
        '<b style="word-break:break-all">' + esc(s.email) + '</b>' +
        '<span class="grow"></span>' +
        '<span class="hint">' + esc(fmtWhen(s.ts)) + '</span>' +
        '<button class="btn btn-sm btn-danger" data-a="del">Remove</button>');
      row.querySelector('[data-a="del"]').addEventListener("click", function(){
        if(!confirm("Remove this subscriber?")) return;
        srvApi("/api/admin/action", {type:"sub-del", id:s.id}).then(renderSubscribers).catch(actionErr);
      });
      pane.appendChild(row);
    });
  }).catch(function(e){ paneAuthErr(e, pane, renderSubscribers); });
}
function fetchBadges(){
  srvApi("/api/admin/orders").then(function(d){
    setBadge("#bMsg", (d.orders || []).filter(function(o){ return !o.read; }).length);
  }).catch(function(){});
  srvApi("/api/admin/reviews").then(function(d){
    setBadge("#bRv", (d.reviews || []).filter(function(r){ return !r.approved; }).length);
  }).catch(function(){});
}

/* ==================== Security ==================== */
$("#credForm").addEventListener("submit", function(e){
  e.preventDefault();
  var cur = $("#secCur").value,
      nu  = $("#secUser").value.trim(),
      np  = $("#secNew").value,
      np2 = $("#secNew2").value;
  if(!cur){ toast("Enter your current password", true); return; }
  if(!nu && !np){ toast("Enter a new login or a new password", true); return; }
  if(np && np.length < 6){ toast("New password must be at least 6 characters", true); return; }
  if(np !== np2){ toast("New passwords do not match", true); return; }
  var btn = $("#secSave"); btn.disabled = true;
  srvApi("/api/admin/credentials", {currentPass: cur, newUser: nu, newPass: np})
    .then(function(d){
      ADMIN_USER = d.user || ADMIN_USER;
      setUserChip();
      $("#credForm").reset();
      $("#secDefWarn").hidden = true;
      toast("Login details updated ✔ You stay signed in on this device.");
    })
    .catch(function(err){
      if(err && err.auth) return lockPanel("Your session expired — please sign in again.");
      toast(isNetErr(err) ? "Server not reachable — start node server.js" : (err.message || "Could not save"), true);
    })
    .then(function(){ btn.disabled = false; });
});

/* ==================== navigation / shell ==================== */
var PANE_TITLES = {
  home:"Home page & general", services:"Services page", prices:"Prices page",
  images:"Images", videos:"Videos", sections:"Sections",
  messages:"Messages", reviews:"Reviews", subscribers:"Subscribers", security:"Security"
};
function renderPane(name){
  if(name === "home") renderHome();
  else if(name === "services") renderServices();
  else if(name === "prices") renderPrices();
  else if(name === "images") renderSlots(IMG_GROUPS, "#pane-images", false);
  else if(name === "videos") renderSlots(VID_GROUPS, "#pane-videos", true);
  else if(name === "sections") renderSections();
  else if(name === "messages") renderMessages();
  else if(name === "reviews") renderReviews();
  else if(name === "subscribers") renderSubscribers();
}
function setPane(name){
  PANE = name;
  document.querySelectorAll(".sb-item").forEach(function(b){
    b.classList.toggle("is-active", b.dataset.pane === name);
  });
  document.querySelectorAll(".pane").forEach(function(p){
    p.classList.toggle("is-active", p.id === "pane-" + name);
  });
  $("#tbTitle").textContent = PANE_TITLES[name] || name;
  $("#tbLang").hidden = !CONTENT_PANES[name];
  document.getElementById("app").classList.remove("nav-open");
  renderPane(name);
  window.scrollTo(0, 0);
}
document.querySelectorAll(".sb-item").forEach(function(b){
  b.addEventListener("click", function(){ setPane(b.dataset.pane); });
});
$("#tbBurger").addEventListener("click", function(){
  document.getElementById("app").classList.toggle("nav-open");
});
$("#sbScrim").addEventListener("click", function(){
  document.getElementById("app").classList.remove("nav-open");
});
document.querySelectorAll("#tbLang button").forEach(function(b){
  b.addEventListener("click", function(){
    LANG = b.dataset.lang;
    try{ localStorage.setItem("bw-adm-lang", LANG); }catch(e){}
    document.querySelectorAll("#tbLang button").forEach(function(x){
      x.classList.toggle("is-active", x === b);
    });
    if(CONTENT_PANES[PANE]) renderPane(PANE);
  });
  b.classList.toggle("is-active", b.dataset.lang === LANG);
});

/* ==================== auth: login / logout ==================== */
function loginErr(msg){
  var e = $("#lgErr");
  e.hidden = !msg;
  e.textContent = msg || "";
}
function setLoginBusy(on, label){
  $("#lgBtn").disabled = on;
  $("#lgBtn").textContent = on ? (label || "Signing in…") : "Sign in · შესვლა";
}
function setUserChip(){
  $("#sbUser").textContent = ADMIN_USER || "admin";
  $("#sbAva").textContent = (ADMIN_USER || "A").slice(0, 1);
}
function lockPanel(msg){
  setTok("");
  ADMIN_USER = "";
  clearDirty();
  $("#app").hidden = true;
  $("#lgWrap").hidden = false;
  setLoginBusy(false);
  loginErr(msg || "");
  $("#lgPass").value = "";
  var u = $("#lgUser");
  if(u && !u.value) u.focus(); else $("#lgPass").focus();
}
function unlockPanel(d){
  ADMIN_USER = (d && d.user) || ADMIN_USER || "admin";
  setUserChip();
  $("#lgWrap").hidden = true;
  $("#app").hidden = false;
  $("#lgPass").value = ""; $("#lgTok").value = ""; $("#secCur").value = "";
  var def = !!(d && d.defaultLogin);
  $("#secDefWarn").hidden = !def;
  if(def) toast("You are using the default password — change it in Security", true);
  loadEverything();
}
function loadEverything(){
  Promise.all([
    srvApi("/api/admin/content"),
    srvApi("/api/admin/config")
  ]).then(function(res){
    CONTENT = res[0].content || {};
    ["i18n","prices_i18n","service_i18n","pf","foot","plans","highlights","feat","faq","services"]
      .forEach(function(k){ if(!CONTENT[k] || typeof CONTENT[k] !== "object") CONTENT[k] = {}; });
    if(!Array.isArray(CONTENT.plan_names))  CONTENT.plan_names  = ["","",""];
    if(!Array.isArray(CONTENT.plan_prices)) CONTENT.plan_prices = ["","",""];
    BASE = JSON.stringify(CONTENT);
    clearDirty();
    CFG = res[1].config || {hidden:[], custom:[]};
    setPane(PANE);
    fetchBadges();
  }).catch(function(e){
    if(e.auth) return lockPanel("Your session expired — please sign in again.");
    toast(isNetErr(e) ? "Server not reachable — start node server.js" : (e.message || "Could not load"), true);
  });
}

/* password <-> token mode */
$("#lgTokMode").addEventListener("click", function(){
  var tokenMode = $("#lgTokField").hidden;   /* about to switch it on? */
  $("#lgTokField").hidden = !tokenMode;
  $("#lgFields").hidden = tokenMode;
  $("#lgTokMode").textContent = tokenMode
    ? "Sign in with login & password instead"
    : "Sign in with admin token instead";
  $("#lgSub").innerHTML = tokenMode
    ? "Paste the admin token — it always works as a master key."
    : "Enter your admin login and password.<br>შეიყვანეთ ადმინის სახელი და პაროლი.";
  loginErr("");
  (tokenMode ? $("#lgTok") : $("#lgUser")).focus();
});
/* show / hide password */
$("#lgEye").addEventListener("click", function(){
  var p = $("#lgPass");
  var show = p.type === "password";
  p.type = show ? "text" : "password";
  this.textContent = show ? "Hide" : "Show";
  p.focus();
});
/* sign in */
$("#lgForm").addEventListener("submit", function(e){
  e.preventDefault();
  loginErr("");
  $("#lgOff").hidden = true;
  var tokenMode = !$("#lgTokField").hidden;
  var p;
  if(tokenMode){
    var tv = $("#lgTok").value.trim();
    if(!tv){ loginErr("Paste the admin token first."); return; }
    setLoginBusy(true);
    setTok(tv);
    p = srvApi("/api/admin/ping");
  } else {
    var user = $("#lgUser").value.trim(), pass = $("#lgPass").value;
    if(!user || !pass){ loginErr("Enter both login and password."); return; }
    setLoginBusy(true);
    p = fetch("/api/login", {
      method: "POST", headers: {"Content-Type":"application/json"},
      body: JSON.stringify({user: user, pass: pass})
    }).then(function(r){
      return r.json().catch(function(){ return {}; }).then(function(d){
        if(r.status === 401){ var er = new Error(d.error || "Wrong login or password"); er.auth = true; throw er; }
        if(!r.ok || !d.ok || !d.token) throw new Error(d.error || "Could not sign in");
        setTok(d.token);
        return srvApi("/api/admin/ping");
      });
    });
  }
  p.then(function(d){
    unlockPanel(d);
    toast("Welcome, " + ((d && d.user) || "admin") + "!");
  }).catch(function(err){
    setTok("");
    if(err && err.auth)
      loginErr(tokenMode ? "That token is wrong — check data/secret.txt." : (err.message || "Wrong login or password"));
    else if(isNetErr(err)) $("#lgOff").hidden = false;
    else loginErr((err && err.message) || "Could not sign in");
  }).then(function(){ setLoginBusy(false); });
});
$("#lgRetry").addEventListener("click", function(){
  $("#lgOff").hidden = true;
  boot(true);
});
$("#btnLogout").addEventListener("click", function(){
  if(DIRTY && !confirm("You have unsaved text changes — log out anyway?")) return;
  lockPanel("You are signed out.");
  toast("Signed out");
});

/* ==================== boot ==================== */
function boot(fromRetry){
  var t = getTok();
  if(!t){ lockPanel(); return; }
  setLoginBusy(true, "Signing you in…");
  srvApi("/api/admin/ping").then(function(d){
    unlockPanel(d);
  }).catch(function(e){
    setLoginBusy(false);
    if(e && e.auth){ lockPanel("Please sign in."); }
    else {
      $("#lgWrap").hidden = false;
      $("#lgOff").hidden = false;
      if(fromRetry) toast("Still no server — is node server.js running?", true);
    }
  });
}
boot();
setInterval(function(){
  if(!$("#app").hidden && !document.hidden) fetchBadges();
}, 60000);

})();
