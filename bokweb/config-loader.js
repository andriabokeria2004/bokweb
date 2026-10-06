/* ---------- Site config loader ----------
   Applies what you set in admin.html:
   1. hides sections listed in BW_CONFIG.hidden (and their menu links)
   2. renders the custom sections from BW_CONFIG.custom
   Runs before script.js; safe if the config is empty or missing. */
(function(){
  "use strict";
  var CFG = window.BW_CONFIG || {};
  var hidden = Array.isArray(CFG.hidden) ? CFG.hidden : [];
  var custom = Array.isArray(CFG.custom) ? CFG.custom : [];

  /* only allow safe slug ids and known-shaped image paths, even if the
     config file was hand-edited — never trust the file blindly */
  function safeId(v){ return typeof v === "string" && /^[A-Za-z0-9_-]{1,64}$/.test(v) ? v : null; }
  function safeImg(v){
    return typeof v === "string" &&
      /^images\/(?:[a-z0-9_-]+\/)*[a-z0-9][a-z0-9._-]*\.(png|jpe?g|webp)$/i.test(v) &&
      v.indexOf("..") === -1 ? v : null;
  }

  /* ---- 1. hidden sections ---- */
  hidden.forEach(function(id){
    id = safeId(id);
    if(!id) return;
    var sec = document.getElementById(id);
    if(sec) sec.style.display = "none";
    /* attribute-selector value is safely quoted via CSS.escape when available */
    var sel = 'a[href="#' + (window.CSS && CSS.escape ? CSS.escape(id) : id) + '"]';
    try {
      document.querySelectorAll(sel).forEach(function(a){
        var li = a.closest("li");
        (li || a).style.display = "none";
      });
    } catch(e){ /* malformed selector — ignore */ }
  });

  /* ---- 2. custom sections ---- */
  function esc(s){ return String(s == null ? "" : s).replace(/[&<>"'/]/g, function(c){
    return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;","/":"&#47;"}[c]; }); }
  function lang(){ return document.documentElement.getAttribute("lang") || "ka"; }
  function pick(map){
    if(!map) return "";
    var l = lang();
    return map[l] || map.ka || map.en || map.ru || "";
  }

  var anchors = {};   /* last element inserted after each anchor, so customs stack in order */

  custom.forEach(function(cs){
    if(!cs) return;
    var id = safeId(cs.id);
    if(!id) return;
    var img = safeImg(cs.img);
    var sec = document.createElement("section");
    sec.className = "bw-why bw-custom-sec";
    sec.id = id;
    sec.innerHTML =
      '<div class="bw-sec-inner">' +
        '<div class="bw-sec-head">' +
          '<h2 class="bw-sec-title" data-cs-title></h2>' +
          '<p class="bw-sec-sub" data-cs-body></p>' +
        '</div>' +
        (img ? '<div class="bw-cs-media"><img src="'+esc(img)+'" alt="" loading="lazy"></div>' : '') +
      '</div>';
    var afterId = (safeId(cs.after) && document.getElementById(cs.after)) ? cs.after : "features";
    var ref = anchors[afterId] || document.getElementById(afterId);
    if(!ref) ref = document.querySelector("main") || document.body.lastElementChild;
    ref.insertAdjacentElement("afterend", sec);
    anchors[afterId] = sec;
  });

  function paint(){
    custom.forEach(function(cs){
      var id = safeId(cs && cs.id);
      var sec = id && document.getElementById(id);
      if(!sec) return;
      sec.querySelector("[data-cs-title]").textContent = pick(cs.t);
      sec.querySelector("[data-cs-body]").textContent  = pick(cs.b);
    });
  }
  paint();

  /* repaint custom texts whenever the language switcher changes <html lang> */
  new MutationObserver(paint).observe(document.documentElement,
    {attributes:true, attributeFilter:["lang"]});
})();
