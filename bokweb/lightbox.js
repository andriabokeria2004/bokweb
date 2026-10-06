/* ---------- Image lightbox (tap any content image to view it full-screen) ----------
   Works on every page. Tappable things:
     services page  → .svc-shot banners
     home page      → feature images + portfolio image slides
     prices page    → highlight cards + wide band images
   Logos, icons and videos are not affected. No setup needed — it finds images
   automatically, including ones added by scripts later. */
(function(){
  "use strict";

  var IMG_SEL  = ".svc-shot, .bw-feat-media img, .feat-media img, img.bw-pf-img, .bw-cs-media img";
  var CARD_SEL = ".hl-card";

  var lb = null, lbImg = null, lbCap = null, prevOverflow = "", lastFocus = null, hideTimer = null;

  function build(){
    if(lb) return;
    lb = document.createElement("div");
    lb.className = "bw-lb";
    lb.hidden = true;
    lb.setAttribute("role","dialog");
    lb.setAttribute("aria-modal","true");
    lb.setAttribute("aria-label","Image viewer");
    lb.innerHTML =
      '<button class="bw-lb-close" type="button" aria-label="Close">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
      '</button>' +
      '<figure class="bw-lb-fig"><img class="bw-lb-img" alt=""><figcaption class="bw-lb-cap"></figcaption></figure>';
    document.body.appendChild(lb);
    lbImg = lb.querySelector(".bw-lb-img");
    lbCap = lb.querySelector(".bw-lb-cap");

    // any tap/click inside closes (backdrop, image or the × button)
    lb.addEventListener("click", close);
    document.addEventListener("keydown", function(e){
      if(e.key === "Escape" && lb && !lb.hidden) close();
    });
  }

  function open(src, caption){
    if(!src) return;
    build();
    clearTimeout(hideTimer);
    lastFocus = document.activeElement;
    lbImg.src = src;
    lbImg.alt = caption || "";
    lbCap.textContent = caption || "";
    lbCap.hidden = !caption;
    prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lb.hidden = false;
    void lb.offsetWidth;                    /* reflow so the fade-in plays */
    lb.classList.add("is-open");
    var btn = lb.querySelector(".bw-lb-close");
    if(btn) btn.focus({preventScroll:true});
  }

  function close(){
    if(!lb || lb.hidden) return;
    lb.classList.remove("is-open");
    document.body.style.overflow = prevOverflow;
    hideTimer = setTimeout(function(){
      lb.hidden = true;
      lbImg.removeAttribute("src");         /* free memory, stop loads */
    }, 240);
    if(lastFocus && lastFocus.focus) lastFocus.focus({preventScroll:true});
  }

  /* full-size source: the src attribute is always the original file,
     even when the page loaded a smaller srcset copy for the screen */
  function fullSrc(img){ return img.getAttribute("src") || img.currentSrc || ""; }

  function cardImage(card){
    var m = (card.getAttribute("style") || "").match(/--card-img:\s*url\(\s*['"]?([^'")]+)['"]?\s*\)/);
    return m ? m[1] : "";
  }

  /* stop native image ghost-drag so mouse swipes work over images too */
  document.addEventListener("dragstart", function(e){
    if(e.target.closest && e.target.closest(IMG_SEL)) e.preventDefault();
  });

  /* tap-vs-swipe guard (portfolio slider is swipeable) */
  var downX = null, downY = null;
  document.addEventListener("pointerdown", function(e){
    downX = e.clientX; downY = e.clientY;
  }, true);

  document.addEventListener("click", function(e){
    if(lb && !lb.hidden) return;                       /* viewer already open */
    var moved = downX !== null &&
      (Math.abs(e.clientX - downX) > 12 || Math.abs(e.clientY - downY) > 12);
    var img = e.target.closest ? e.target.closest(IMG_SEL) : null;
    if(img){
      if(moved) return;                                /* it was a swipe, not a tap */
      e.preventDefault();
      open(fullSrc(img), img.getAttribute("alt") || "");
      return;
    }
    var card = e.target.closest ? e.target.closest(CARD_SEL) : null;
    if(card && !moved){
      var src = cardImage(card);
      var title = card.querySelector(".hl-title");
      if(src) open(src, title ? title.textContent : "");
    }
  });
})();
