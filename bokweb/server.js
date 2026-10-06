/* ============================================================
   BokWeb server — orders + reviews + website hosting
   Needs only Node.js (nodejs.org). No installs. Run with:
       node server.js
   Then open:  http://localhost:3000
   Admin token: shown in this console and saved in data/secret.txt
   ============================================================ */
"use strict";
const http = require("http");
const fs = require("fs");
const fsp = fs.promises;
const path = require("path");
const crypto = require("crypto");

const ROOT = __dirname;
const DATA = path.join(ROOT, "data");
const PORT = process.env.PORT || 3000;

/* ---------- storage (simple JSON files with safe writes) ---------- */
fs.mkdirSync(DATA, { recursive: true, mode: 0o700 });
function loadJSON(file, fallback){
  try { return JSON.parse(fs.readFileSync(path.join(DATA, file), "utf8")); }
  catch(e){ return fallback; }
}
const db = {
  orders:      loadJSON("orders.json", []),
  reviews:     loadJSON("reviews.json", []),
  subscribers: loadJSON("subscribers.json", []),
  settings:    loadJSON("settings.json", { autoApprove: false })
};
let writing = Promise.resolve();
function save(name){
  const file = path.join(DATA, name + ".json");
  const tmp  = file + ".tmp";
  const body = JSON.stringify(db[name], null, 1);
  writing = writing.then(() =>
    fsp.writeFile(tmp, body, { mode: 0o600 }).then(() => fsp.rename(tmp, file))
  ).catch(e => console.error("save failed:", e.message));
  return writing;
}

/* ---------- admin token ---------- */
const SECRET_FILE = path.join(DATA, "secret.txt");
let TOKEN;
try { TOKEN = fs.readFileSync(SECRET_FILE, "utf8").trim(); } catch(e){}
if(!TOKEN){
  TOKEN = crypto.randomBytes(21).toString("base64url");
  fs.writeFileSync(SECRET_FILE, TOKEN + "\n", { mode: 0o600 });
}
function authed(req){
  const h = String(req.headers["authorization"] || "");
  const t = h.replace(/^Bearer\s+/i, "").trim();
  if(t.length !== TOKEN.length) return false;
  return crypto.timingSafeEqual(Buffer.from(t), Buffer.from(TOKEN));
}

/* ---------- admin login + password ----------
   Sign in with a username & password in the panel; a correct login
   returns the admin token above, so the token system keeps working
   exactly as before (data/secret.txt is still the master key).
   Defaults on first run:  admin / admin123  — change them in
   Admin panel > Security. Forgot the password? Stop the server,
   delete data/admin-login.json and start again to reset. */
const LOGIN_FILE = path.join(DATA, "admin-login.json");
function hashPass(pass, salt){
  return crypto.scryptSync(String(pass), salt, 32).toString("hex");
}
let LOGIN = null;
try { LOGIN = JSON.parse(fs.readFileSync(LOGIN_FILE, "utf8")); } catch(e){}
if(!LOGIN || !LOGIN.user || !LOGIN.salt || !LOGIN.hash){
  const salt = crypto.randomBytes(12).toString("hex");
  LOGIN = { user: "admin", salt: salt, hash: hashPass("Gavachuqe1234", salt), def: true };
  fs.writeFileSync(LOGIN_FILE, JSON.stringify(LOGIN, null, 1), { mode: 0o600 });
}
function safeEq(a, b){
  const ba = Buffer.from(String(a)), bb = Buffer.from(String(b));
  if(ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}
function checkLogin(user, pass){
  const userOk = safeEq(String(user == null ? "" : user).trim(), LOGIN.user);
  const passOk = safeEq(hashPass(pass == null ? "" : pass, LOGIN.salt), LOGIN.hash);
  return userOk && passOk;
}
function saveLogin(user, pass){
  const salt = crypto.randomBytes(12).toString("hex");
  LOGIN = { user: user, salt: salt, hash: hashPass(pass, salt) };
  fs.writeFileSync(LOGIN_FILE, JSON.stringify(LOGIN, null, 1), { mode: 0o600 });
}

/* ---------- helpers ---------- */
function id(){ return Date.now().toString(36) + crypto.randomBytes(3).toString("hex"); }
function clean(v, max){
  return String(v == null ? "" : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max);
}
/* Strict email check: only characters that are actually valid in an email.
   Blocks garbage like "<script>...</script>@x.com" that a looser pattern
   would accept. Local part: letters/digits/. _ % + -  ·  Domain: letters/
   digits/. -  ending in a 2+ letter TLD. Length-capped to stay ReDoS-proof. */
function validEmail(v){
  v = String(v == null ? "" : v);
  if(v.length > 160) return false;
  return /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/.test(v);
}
/* Phone: only + ( ) - space digits, and at least 6 actual digits. */
function validPhone(v){
  v = String(v == null ? "" : v);
  if(v.length > 40) return false;
  const digits = (v.match(/\d/g) || []).length;
  return /^[+()\-\s\d]+$/.test(v) && digits >= 6;
}
/* ---------- security headers ----------
   Sent on every response. CSP is tuned to exactly what the site uses:
   self-hosted JS/CSS/media, Google Fonts, inline style attributes,
   optional YouTube portfolio embeds. No other origin can run here. */
const CSP =
  "default-src 'self'; " +
  "script-src 'self'; " +
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
  "font-src 'self' https://fonts.gstatic.com; " +
  "img-src 'self' data:; " +
  "media-src 'self'; " +
  "connect-src 'self'; " +
  "frame-src https://www.youtube.com; " +
  "object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'";
function secHeaders(res, req){
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  /* HSTS only makes sense once TLS is in front (Render/Railway/nginx) */
  if(req && String(req.headers["x-forwarded-proto"] || "").split(",")[0].trim() === "https")
    res.setHeader("Strict-Transport-Security", "max-age=15552000; includeSubDomains");
}
function htmlHeaders(res){
  res.setHeader("Content-Security-Policy", CSP);
  res.setHeader("Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()");
}
function svgHeaders(res){ /* neutralise any scripts inside stored SVG files */
  res.setHeader("Content-Security-Policy",
    "default-src 'none'; style-src 'unsafe-inline'; img-src data:");
}

/* ---------- client IP (rate limiting) ----------
   x-forwarded-for is attacker-controlled unless a proxy you trust sets it.
   Set TRUST_PROXY=1 only when deployed behind one (Render, Railway, nginx),
   otherwise the real socket address is used and the header is ignored. */
const TRUST_PROXY = process.env.TRUST_PROXY === "1";
function clientIp(req){
  if(TRUST_PROXY){
    const xf = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
    if(xf) return xf;
  }
  return (req.socket && req.socket.remoteAddress) || "?";
}

/* errors we intentionally show to the client */
function oops(msg, code){
  const e = new Error(msg);
  e.expose = true;
  e.status = code || 400;
  return e;
}

function json(res, code, obj){
  const body = JSON.stringify(obj);
  res.writeHead(code, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(body);
}
function readBody(req, maxBytes){
  const cap = maxBytes || 64 * 1024;
  return new Promise((resolve, reject) => {
    let size = 0, chunks = [];
    req.on("data", c => {
      size += c.length;
      if(size > cap){ reject(oops("request too large", 413)); req.destroy(); return; }
      chunks.push(c);
    });
    req.on("end", () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}")); }
      catch(e){ reject(oops("bad json")); }
    });
    req.on("error", reject);
  });
}

/* ---------- deep sanitizer ----------
   Strips prototype-pollution keys (__proto__ / constructor / prototype),
   caps depth, node count and string length. Applied to every JSON object
   that gets persisted (site texts, sections config). */
const BAD_KEYS = { __proto__: 1, constructor: 1, prototype: 1 };
function sanitize(v, depth, budget){
  depth = depth || 0;
  if(depth > 12 || budget.n-- < 0) return null;
  if(v === null) return null;
  const t = typeof v;
  if(t === "string") return v.slice(0, 20000);
  if(t === "number") return Number.isFinite(v) ? v : 0;
  if(t === "boolean") return v;
  if(Array.isArray(v)) return v.slice(0, 500).map(x => sanitize(x, depth + 1, budget));
  if(t === "object"){
    const out = {};
    for(const k of Object.keys(v)){
      if(Object.prototype.hasOwnProperty.call(BAD_KEYS, k)) continue;
      out[k.slice(0, 200)] = sanitize(v[k], depth + 1, budget);
    }
    return out;
  }
  return null;   /* functions/symbols can't appear in JSON anyway */
}
function sanitized(obj){ return sanitize(obj, 0, {n: 60000}); }

/* ---------- managed site files (texts + sections) ---------- */
function readManaged(file){
  try {
    const t = fs.readFileSync(path.join(ROOT, file), "utf8");
    const i = t.indexOf("{"), j = t.lastIndexOf("}");
    if(i === -1 || j === -1) return null;
    return JSON.parse(t.slice(i, j + 1));
  } catch(e){ return null; }
}
let CONTENT = readManaged("site-content.js") || {};
/* re-read content after admin saves so translations stay fresh */
function writeManaged(file, header, varName, obj){
  if(file === "site-content.js"){ setTimeout(function(){ CONTENT = readManaged("site-content.js") || CONTENT; }, 50); }
  const target = path.join(ROOT, file);
  try { /* keep one backup for “oops” moments */
    if(fs.existsSync(target)){
      const bak = path.join(DATA, file.replace(".js","") + "-prev.js");
      fs.copyFileSync(target, bak);
      fs.chmodSync(bak, 0o600);
    }
  } catch(e){}
  const body = header + "window." + varName + " = " + JSON.stringify(obj, null, 1) + ";\n";
  const tmp = target + ".tmp";
  fs.writeFileSync(tmp, body);
  fs.renameSync(tmp, target);
}
const CONTENT_HEADER =
"/* ============================================================\n" +
"   BokWeb site content — MANAGED BY THE ADMIN PANEL\n" +
"   Every text on the website lives here (KA / EN / RU).\n" +
"   Edit it in Admin panel > Home / Services / Prices tabs.\n" +
"   ============================================================ */\n";
const CONFIG_HEADER =
"/* ============================================================\n" +
"   BokWeb site config — MANAGED BY THE ADMIN PANEL\n" +
"   Open admin.html to change sections without code.\n" +
"   ============================================================ */\n";

/* ---------- safe upload paths ----------
   Only images/ and videos/, no dot-files, no traversal, and the file
   CONTENT must match its extension (magic bytes) — a renamed .html or
   script can't be smuggled in as a "picture". SVG is deliberately not
   uploadable: SVG can carry <script> (stored XSS). */
const UP_RE = /^(images|videos)\/(?:[a-z0-9_-]+\/)*[a-z0-9][a-z0-9._-]*\.(png|jpe?g|webp|mp4|webm)$/i;
function safeAssetPath(p){
  p = String(p == null ? "" : p).replace(/\\/g, "/").replace(/^\/+/, "");
  if(p.indexOf("\0") !== -1 || p.includes("..") || !UP_RE.test(p)) return null;
  return p;
}
function magicOk(ext, buf){
  if(buf.length < 12) return false;
  switch(ext){
    case "png":  return buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47;
    case "jpg":
    case "jpeg": return buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF;
    case "webp": return buf.slice(0, 4).toString() === "RIFF" && buf.slice(8, 12).toString() === "WEBP";
    case "mp4":  return buf.slice(4, 8).toString() === "ftyp";
    case "webm": return buf[0] === 0x1A && buf[1] === 0x45 && buf[2] === 0xDF && buf[3] === 0xA3;
  }
  return false;
}
function saveUpload(req, relPath, maxBytes){
  return new Promise((resolve, reject) => {
    const ext = relPath.split(".").pop().toLowerCase();
    const target = path.join(ROOT, relPath);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    const tmp = target + ".uptmp";
    const out = fs.createWriteStream(tmp, { mode: 0o644 });
    let size = 0, head = Buffer.alloc(0), checked = false, failed = false;
    function fail(err){
      if(failed) return;
      failed = true;
      out.destroy(); fs.unlink(tmp, () => {});
      reject(err);
      req.destroy();
    }
    req.on("data", c => {
      size += c.length;
      if(size > maxBytes) return fail(oops("file too big", 413));
      if(!checked){
        head = Buffer.concat([head, c]);
        if(head.length >= 12){
          checked = true;
          if(!magicOk(ext, head))
            return fail(oops("file content does not match ." + ext));
        }
      }
    });
    req.pipe(out);
    out.on("finish", () => {
      if(failed) return;
      if(size === 0 || !checked){ fs.unlink(tmp, () => {}); return reject(oops("empty or truncated upload")); }
      fs.rename(tmp, target, err => err ? reject(err) : resolve(size));
    });
    out.on("error", err => { if(!failed) reject(err); });
  });
}

/* ---------- light rate limit (per IP, per route) ---------- */
const hits = new Map();
function limited(req, route, max){
  const key = route + "|" + clientIp(req);
  const now = Date.now(), windowMs = 10 * 60 * 1000;
  const arr = (hits.get(key) || []).filter(t => now - t < windowMs);
  if(arr.length >= max) return true;
  arr.push(now);
  hits.set(key, arr);
  return false;
}
/* keep the limiter's memory bounded even under IP-spraying */
setInterval(function(){
  const now = Date.now(), windowMs = 10 * 60 * 1000;
  for(const [k, arr] of hits){
    const live = arr.filter(t => now - t < windowMs);
    if(live.length) hits.set(k, live); else hits.delete(k);
  }
  if(hits.size > 20000) hits.clear();
}, 5 * 60 * 1000).unref();

/* ---------- API ---------- */
async function api(req, res, url){
  if(req.method === "OPTIONS") return json(res, 204, {});

  /* public: admin sign-in — username + password -> admin token */
  if(url.pathname === "/api/login" && req.method === "POST"){
    if(limited(req, "login", 10)) return json(res, 429, {ok:false, error:"too many attempts — wait 10 minutes"});
    const b = await readBody(req);
    if(!checkLogin(b.user, b.pass)) return json(res, 401, {ok:false, error:"wrong login or password"});
    return json(res, 200, {ok:true, token: TOKEN, user: LOGIN.user});
  }

  /* public: submit an order (the contact form) */
  if(url.pathname === "/api/orders" && req.method === "POST"){
    if(limited(req, "orders", 15)) return json(res, 429, {ok:false, error:"too many requests"});
    const b = await readBody(req);
    if(clean(b.website, 10)) return json(res, 200, {ok:true});   /* honeypot: pretend success */
    const o = {
      id: id(), ts: Date.now(), read: false,
      name: clean(b.name, 80), biz: clean(b.biz, 120),
      contact: clean(b.contact, 160), msg: clean(b.msg, 2000),
      lang: clean(b.lang, 5)
    };
    /* server-side validation — never trust the browser */
    const emailOk = validEmail(o.contact);
    const phoneOk = validPhone(o.contact);
    if(o.name.length < 2)             return json(res, 400, {ok:false, error:"name required"});
    if(!(emailOk || phoneOk))         return json(res, 400, {ok:false, error:"a valid phone or email is required"});
    if(o.msg.length < 4)              return json(res, 400, {ok:false, error:"message required"});
    db.orders.unshift(o);
    db.orders = db.orders.slice(0, 500);
    await save("orders");
    return json(res, 200, {ok:true});
  }

  /* public: newsletter subscribe */
  if(url.pathname === "/api/subscribe" && req.method === "POST"){
    if(limited(req, "subscribe", 8)) return json(res, 429, {ok:false, error:"too many requests"});
    const b = await readBody(req);
    if(clean(b.website, 10)) return json(res, 200, {ok:true});   /* honeypot: pretend success */
    const email = clean(b.email, 160).toLowerCase();
    /* strict server-side email validation — rejects script-tag garbage */
    if(!validEmail(email)) return json(res, 400, {ok:false, error:"invalid email"});
    /* skip duplicates (case-insensitive) */
    if(!db.subscribers.some(s => s.email === email)){
      db.subscribers.unshift({ id: id(), ts: Date.now(), email: email, lang: clean(b.lang, 5) });
      db.subscribers = db.subscribers.slice(0, 5000);
      await save("subscribers");
    }
    return json(res, 200, {ok:true});
  }

  /* public: reviews */
  if(url.pathname === "/api/reviews" && req.method === "GET"){
    const list = db.reviews.filter(r => r.approved)
      .map(r => ({id:r.id, name:r.name, rating:r.rating, text:r.text, ts:r.ts}))
      .slice(0, 60);
    return json(res, 200, {ok:true, reviews:list});
  }
  if(url.pathname === "/api/reviews" && req.method === "POST"){
    if(limited(req, "reviews", 5)) return json(res, 429, {ok:false, error:"too many requests"});
    const b = await readBody(req);
    if(clean(b.website, 10)) return json(res, 200, {ok:true});
    const rating = Math.round(Number(b.rating));
    const r = {
      id: id(), ts: Date.now(), approved: !!db.settings.autoApprove,
      name: clean(b.name, 60), text: clean(b.text, 1200),
      rating: (rating >= 1 && rating <= 10) ? rating : 0
    };
    if(!r.name || r.text.length < 4 || !r.rating)
      return json(res, 400, {ok:false, error:"name, text and rating 1-10 required"});
    db.reviews.unshift(r);
    db.reviews = db.reviews.slice(0, 800);
    await save("reviews");
    return json(res, 200, {ok:true, pending: !r.approved});
  }

  /* admin (token required) */
  if(url.pathname.startsWith("/api/admin/")){
    if(!authed(req)) return json(res, 401, {ok:false, error:"bad token"});
    if(url.pathname === "/api/admin/ping" && req.method === "GET")
      return json(res, 200, {ok:true, user: LOGIN.user, defaultLogin: !!LOGIN.def});
    if(url.pathname === "/api/admin/credentials" && req.method === "POST"){
      const b = await readBody(req);
      if(!checkLogin(LOGIN.user, b.currentPass))
        return json(res, 403, {ok:false, error:"current password is wrong"});
      const nu = clean(b.newUser, 40).replace(/\s+/g, "") || LOGIN.user;
      const np = String(b.newPass == null ? "" : b.newPass);
      if(nu.length < 3) return json(res, 400, {ok:false, error:"login must be at least 3 characters"});
      if(np && np.length < 6) return json(res, 400, {ok:false, error:"new password must be at least 6 characters"});
      saveLogin(nu, np || String(b.currentPass));
      return json(res, 200, {ok:true, user: LOGIN.user});
    }

    /* --- website texts (site-content.js) --- */
    if(url.pathname === "/api/admin/content" && req.method === "GET")
      return json(res, 200, {ok:true, content: readManaged("site-content.js") || {}});
    if(url.pathname === "/api/admin/content" && req.method === "POST"){
      if(limited(req, "save", 120)) return json(res, 429, {ok:false, error:"too many saves — wait a few minutes"});
      const b = await readBody(req, 2 * 1024 * 1024);
      if(!b.content || typeof b.content !== "object" || Array.isArray(b.content))
        return json(res, 400, {ok:false, error:"content object required"});
      writeManaged("site-content.js", CONTENT_HEADER, "BW_CONTENT", sanitized(b.content));
      return json(res, 200, {ok:true});
    }

    /* --- sections config (site-config.js) --- */
    if(url.pathname === "/api/admin/config" && req.method === "GET"){
      const c = readManaged("site-config.js") || {};
      return json(res, 200, {ok:true, config:{
        hidden: Array.isArray(c.hidden) ? c.hidden : [],
        custom: Array.isArray(c.custom) ? c.custom : []
      }});
    }
    if(url.pathname === "/api/admin/config" && req.method === "POST"){
      if(limited(req, "save", 120)) return json(res, 429, {ok:false, error:"too many saves — wait a few minutes"});
      const b = await readBody(req, 512 * 1024);
      const c = sanitized(b.config || {});
      writeManaged("site-config.js", CONFIG_HEADER, "BW_CONFIG", {
        hidden: Array.isArray(c.hidden) ? c.hidden.slice(0, 40).map(x => clean(x, 40)) : [],
        custom: Array.isArray(c.custom) ? c.custom.slice(0, 40) : []
      });
      return json(res, 200, {ok:true});
    }

    /* --- image / video uploads --- */
    if(url.pathname === "/api/admin/upload" && req.method === "POST"){
      if(limited(req, "upload", 200)) return json(res, 429, {ok:false, error:"too many uploads — wait a few minutes"});
      const p = safeAssetPath(url.searchParams.get("path"));
      if(!p) return json(res, 400, {ok:false, error:"bad path"});
      const isVideo = /\.(mp4|webm)$/i.test(p);
      const size = await saveUpload(req, p, (isVideo ? 130 : 30) * 1024 * 1024);
      return json(res, 200, {ok:true, path: p, size: size});
    }
    if(url.pathname === "/api/admin/delete" && req.method === "POST"){
      const b = await readBody(req);
      const p = safeAssetPath(b.path);
      if(!p) return json(res, 400, {ok:false, error:"bad path"});
      try { fs.unlinkSync(path.join(ROOT, p)); } catch(e){}
      return json(res, 200, {ok:true});
    }

    if(url.pathname === "/api/admin/orders" && req.method === "GET")
      return json(res, 200, {ok:true, orders: db.orders});
    if(url.pathname === "/api/admin/reviews" && req.method === "GET")
      return json(res, 200, {ok:true, reviews: db.reviews});
    if(url.pathname === "/api/admin/subscribers" && req.method === "GET")
      return json(res, 200, {ok:true, subscribers: db.subscribers});
    if(url.pathname === "/api/admin/settings" && req.method === "GET")
      return json(res, 200, {ok:true, settings: db.settings});
    if(url.pathname === "/api/admin/settings" && req.method === "POST"){
      const b = await readBody(req);
      db.settings.autoApprove = !!b.autoApprove;
      await save("settings");
      return json(res, 200, {ok:true, settings: db.settings});
    }
    if(url.pathname === "/api/admin/action" && req.method === "POST"){
      const b = await readBody(req);
      const t = clean(b.type, 20), tid = clean(b.id, 40);
      if(t === "order-read"){ const o = db.orders.find(x=>x.id===tid); if(o) o.read = true; await save("orders"); return json(res,200,{ok:true}); }
      if(t === "order-del"){ db.orders = db.orders.filter(x=>x.id!==tid); await save("orders"); return json(res,200,{ok:true}); }
      if(t === "rv-approve"){ const r = db.reviews.find(x=>x.id===tid); if(r) r.approved = true; await save("reviews"); return json(res,200,{ok:true}); }
      if(t === "rv-del"){ db.reviews = db.reviews.filter(x=>x.id!==tid); await save("reviews"); return json(res,200,{ok:true}); }
      if(t === "sub-del"){ db.subscribers = db.subscribers.filter(x=>x.id!==tid); await save("subscribers"); return json(res,200,{ok:true}); }
      return json(res, 400, {ok:false, error:"unknown action"});
    }
  }
  return json(res, 404, {ok:false, error:"not found"});
}

/* ---------- static site ---------- */
const TYPES = { ".html":"text/html; charset=utf-8", ".css":"text/css; charset=utf-8",
  ".js":"text/javascript; charset=utf-8", ".png":"image/png", ".jpg":"image/jpeg",
  ".jpeg":"image/jpeg", ".svg":"image/svg+xml", ".mp4":"video/mp4", ".webp":"image/webp",
  ".ico":"image/x-icon", ".txt":"text/plain; charset=utf-8", ".json":"application/json",
  ".xml":"application/xml; charset=utf-8", ".webmanifest":"application/manifest+json" };


/* ============================================================
   MULTILINGUAL RENDERING (added)
   Real URLs per language:
     Georgian (default):  /            /prices        /services
     English:             /en/         /en/prices     /en/services
     Russian:             /ru/         /ru/prices     /ru/services
   The HTML is translated ON THE SERVER so Google (and Facebook,
   which never runs JS) sees the correct language in the raw HTML.
   ------------------------------------------------------------ */
const LANGS = ["ka", "en", "ru"];
const HTML_LANG = { ka: "ka-GE", en: "en", ru: "ru" };
const PAGE_SLUG = { "/index.html": "", "/prices.html": "prices", "/services.html": "services" };

/* SEO title + description per page per language (rendered into <head>) */
const META = {
  "": {
    ka: ["ვებსაიტების დამზადება საქართველოში | BokWeb",
         "BokWeb ქმნის სწრაფ, თანამედროვე და ბიზნესის საჭიროებებზე მორგებულ ვებსაიტებს, ონლაინ მაღაზიებსა და Landing Page-ებს საქართველოში."],
    en: ["Website Development in Georgia | BokWeb",
         "BokWeb creates fast, modern, business-focused websites, online stores and landing pages for companies in Georgia."],
    ru: ["Создание сайтов в Грузии | BokWeb",
         "BokWeb создаёт современные сайты, интернет-магазины и лендинги для бизнеса в Грузии."]
  },
  "prices": {
    ka: ["ვებსაიტის დამზადების ფასი საქართველოში | BokWeb",
         "ვებსაიტის დამზადების ფასი: Basic ₾790-დან, Pro ₾1790-დან, Pro Plus ₾3490-დან. გამჭვირვალე ფასები და მკაფიო პაკეტები."],
    en: ["Website Development Pricing in Georgia | BokWeb",
         "Website pricing: Basic from ₾790, Pro from ₾1790, Pro Plus from ₾3490. Transparent plans with clear scope."],
    ru: ["Стоимость создания сайта в Грузии | BokWeb",
         "Цены на сайт: Basic от ₾790, Pro от ₾1790, Pro Plus от ₾3490. Прозрачные тарифы и понятный объём работ."]
  },
  "services": {
    ka: ["ვებ სერვისები — დიზაინი, დეველოპმენტი, SEO | BokWeb",
         "ვებ-დიზაინი, ვებსაიტების დამზადება, ონლაინ მაღაზიები, ბრენდინგი, SEO და მხარდაჭერა — სრული სერვისები ბიზნესისთვის."],
    en: ["Web Services — Design, Development, SEO | BokWeb",
         "Web design, website development, online stores, branding, SEO and support — a full set of services for business."],
    ru: ["Веб-услуги — дизайн, разработка, SEO | BokWeb",
         "Веб-дизайн, разработка сайтов, интернет-магазины, брендинг, SEO и поддержка — полный набор услуг для бизнеса."]
  }
};

function langHref(lang, slug){
  const base = lang === "ka" ? "" : "/" + lang;
  return "https://bokweb.ge" + base + "/" + slug;
}
function localePrefix(lang){ return lang === "ka" ? "" : "/" + lang; }

/* escape a string for safe insertion into an HTML text node / attribute */
function htmlEsc(str){
  return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;")
    .replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

/* Replace the text of every <... data-i18n="KEY">TEXT</...> leaf element
   with the dictionary value for the chosen language. */
function translateBody(html, dict){
  return html.replace(/(<[^>]*\bdata-i18n="([^"]+)"[^>]*>)([^<]*)(<\/)/g,
    function(m, open, key, _old, close){
      const v = dict[key];
      return (v == null) ? m : open + htmlEsc(v) + close;
    });
}

/* Rewrite internal navigation links to keep the visitor inside the
   chosen language (/prices -> /en/prices on English pages, etc.). */
function localizeLinks(html, lang){
  if(lang === "ka") return html;
  const p = "/" + lang;
  return html.replace(/href="(\/(?:prices|services)?(?:#[^"]*)?)"/g, function(m, href){
    if(href === "/") return 'href="' + p + '/"';
    return 'href="' + p + href + '"';
  }).replace(/href="\/#/g, 'href="' + p + '/#')
    .replace(/href="\/"/g, 'href="' + p + '/"');
}

function renderLocalized(htmlFile, slug, lang){
  let html = fs.readFileSync(htmlFile, "utf8");
  const dict = (CONTENT.i18n && CONTENT.i18n[lang]) || {};

  /* <html lang="xx"> */
  html = html.replace(/<html([^>]*)\slang="[^"]*"/i, '<html$1 lang="' + lang + '"');

  /* title + meta description */
  const meta = (META[slug] && META[slug][lang]) || (META[slug] && META[slug].ka);
  if(meta){
    html = html.replace(/<title>[^<]*<\/title>/i, "<title>" + htmlEsc(meta[0]) + "</title>");
    html = html.replace(/(<meta name="description" content=")[^"]*(">)/i,
                        "$1" + htmlEsc(meta[1]) + "$2");
    html = html.replace(/(<meta property="og:title" content=")[^"]*(">)/i,
                        "$1" + htmlEsc(meta[0]) + "$2");
    html = html.replace(/(<meta property="og:description" content=")[^"]*(">)/i,
                        "$1" + htmlEsc(meta[1]) + "$2");
  }

  /* canonical (self, this language) + og:url + og:locale */
  const selfUrl = langHref(lang, slug);
  html = html.replace(/(<link rel="canonical" href=")[^"]*(">)/i, "$1" + selfUrl + "$2");
  html = html.replace(/(<meta property="og:url" content=")[^"]*(">)/i, "$1" + selfUrl + "$2");
  html = html.replace(/(<meta property="og:locale" content=")[^"]*(">)/i,
                      "$1" + (lang === "ka" ? "ka_GE" : lang === "ru" ? "ru_RU" : "en_US") + "$2");

  /* hreflang set: drop any existing alternate links, add the full group */
  html = html.replace(/\s*<link rel="alternate" hreflang="[^"]*" href="[^"]*">/gi, "");
  let alts = "";
  LANGS.forEach(function(L){
    alts += '\n<link rel="alternate" hreflang="' + HTML_LANG[L] + '" href="' + langHref(L, slug) + '">';
  });
  alts += '\n<link rel="alternate" hreflang="x-default" href="' + langHref("ka", slug) + '">';
  html = html.replace(/(<link rel="canonical"[^>]*>)/i, "$1" + alts);

  /* tell the client JS which language to boot in (before script.js runs) */
  html = html.replace(/<\/head>/i,
    '<script>window.BW_LANG=' + JSON.stringify(lang) + ';window.BW_SLUG=' + JSON.stringify(slug) + ';</script>\n</head>');

  /* translate the visible body text, then fix internal links */
  html = translateBody(html, dict);
  html = localizeLinks(html, lang);
  return html;
}

function serveStatic(req, res, url){
  let p;
  try { p = decodeURIComponent(url.pathname); }
  catch(e){ res.writeHead(400); return res.end("Bad request"); }
  if(p.indexOf("\0") !== -1){ res.writeHead(400); return res.end("Bad request"); }
  if(p.length > 1) p = p.replace(/\/+$/, "");

  /* ---- language prefix (/en, /ru) ---- */
  let lang = "ka";
  const lm = p.match(/^\/(en|ru)(\/|$)/);
  if(lm){ lang = lm[1]; p = p.slice(lm[1].length + 1) || "/"; if(p === "") p = "/"; }
  /* ---- clean URLs (SEO): /prices.html 301 -> /prices; /prices serves prices.html ----
     keep the language prefix so /en/prices.html -> /en/prices (not /prices). */
  if(/\.html$/i.test(p)){
    let target = p.slice(0, -5);
    if(target === "/index" || target.endsWith("/index")) target = target.slice(0, -5);
    if(target === "") target = "/";
    const pre = lang === "ka" ? "" : "/" + lang;
    let dest = pre + (target === "/" ? "/" : target);
    res.writeHead(301, { "Location": dest + url.search, "Cache-Control": "no-cache" });
    return res.end();
  }
  if(p === "/") p = "/index.html";
  else if(!path.extname(p)) p = p + ".html";
  const file = path.normalize(path.join(ROOT, p));
  const base = path.basename(file);
  const inRoot = file === ROOT || file.startsWith(ROOT + path.sep);
  if(!inRoot || file.startsWith(DATA + path.sep) || file === DATA ||
     base === "server.js" || base === "package.json" || base === "package-lock.json" || base === "README-SERVER.txt" ||
     base.charAt(0) === "." ||
     /\.(tmp|uptmp|md|log)$/i.test(base)){
    res.writeHead(403); return res.end("Forbidden");
  }
  fs.stat(file, (err, st) => {
    if(err || !st.isFile()){ res.writeHead(404); return res.end("Not found"); }
    const ext = path.extname(file).toLowerCase();
    /* ---- localized HTML: translate on the fly ---- */
    if(ext === ".html"){
      const slug = PAGE_SLUG[file.slice(ROOT.length).replace(/\\/g,"/")];
      if(slug !== undefined){
        let out;
        try { out = renderLocalized(file, slug, lang); }
        catch(e){ out = null; }
        if(out != null){
          htmlHeaders(res);
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-cache" });
          return res.end(out);
        }
      }
    }
    if(ext === ".html") htmlHeaders(res);
    if(ext === ".svg") svgHeaders(res);
    const headers = {
      "Content-Type": TYPES[ext] || "application/octet-stream",
      "Content-Length": st.size
    };
    /* never let the browser cache pages/scripts/styles — edits from the
       admin panel must show up on a normal refresh */
    if(ext === ".html" || ext === ".js" || ext === ".css") headers["Cache-Control"] = "no-cache";
    else if(/^\.(png|jpe?g|webp|svg|ico|mp4|webm|woff2?)$/.test(ext))
      headers["Cache-Control"] = "public, max-age=604800";  /* fast repeat visits */
    res.writeHead(200, headers);
    fs.createReadStream(file).pipe(res);
  });
}

const srv = http.createServer((req, res) => {
  secHeaders(res, req);
  const url = new URL(req.url, "http://x");
  if(url.pathname.startsWith("/api/")){
    api(req, res, url).catch(e => {
      /* intentional errors carry .expose; everything else is logged
         server-side and answered generically — no stack, no paths */
      if(!e || !e.expose) console.error("[api]", req.method, url.pathname, e && (e.stack || e.message || e));
      const code = (e && e.status) || 400;
      json(res, code, {ok:false, error: (e && e.expose && e.message) || "request failed"});
    });
  } else if(req.method === "GET" || req.method === "HEAD"){
    serveStatic(req, res, url);
  } else { res.writeHead(405); res.end(); }
});
srv.headersTimeout = 15000;          /* drop slow-header (slowloris) clients */
srv.listen(PORT, () => {
  console.log("==================================================");
  console.log("  BokWeb server is running");
  console.log("  Website:      http://localhost:" + PORT);
  console.log("  Admin panel:  http://localhost:" + PORT + "/admin.html");
  if(LOGIN.def){
    console.log("  Admin login:  admin  /  admin123   (DEFAULT!)");
    console.log("  >> Please change it: Admin panel > Security tab");
  } else {
    console.log("  Admin login:  " + LOGIN.user + "  (password is the one you set)");
  }
  console.log("  Admin token:  " + TOKEN);
  console.log("  (master key — also works to sign in; saved in");
  console.log("   data/secret.txt. Keep the data folder private.)");
  console.log("==================================================");
});

/* last-resort handlers: log, never dump stacks to a client */
process.on("unhandledRejection", e => console.error("[unhandledRejection]", e && (e.stack || e)));
process.on("uncaughtException", e => {
  console.error("[uncaughtException]", e && (e.stack || e));
  process.exit(1);
});
