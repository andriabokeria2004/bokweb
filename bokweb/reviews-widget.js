/* ---------- Floating review widget ----------
   Adds a "★ Reviews" button to every page. One click opens a popup where
   visitors read all approved reviews and can write their own (1-10 stars).
   Self-contained: needs only the /api/reviews endpoints from server.js.
   If the server is unreachable, the button simply never appears. */
(function(){
  "use strict";

  var T = {
    en:{btn:"Reviews", title:"Client reviews", empty:"No reviews yet — be the first!",
        write:"Write a review", back:"‹ Back to reviews", name:"Your name",
        text:"Your comment", text_p:"How was working with us?", rating:"Rating (1–10)",
        send:"Send review", done_t:"Thank you!", done_x:"Your review will appear once we approve it.",
        done_live:"Your review is now published!",
        more:"See more reviews", less:"Show less",
        err:"Could not send — please try again.", close:"Close"},
    ru:{btn:"Отзывы", title:"Отзывы клиентов", empty:"Отзывов пока нет — будьте первым!",
        write:"Оставить отзыв", back:"‹ Назад к отзывам", name:"Ваше имя",
        text:"Ваш комментарий", text_p:"Как вам работа с нами?", rating:"Оценка (1–10)",
        send:"Отправить отзыв", done_t:"Спасибо!", done_x:"Ваш отзыв появится после подтверждения.",
        done_live:"Ваш отзыв уже опубликован!",
        more:"Больше отзывов", less:"Свернуть",
        err:"Не удалось отправить — попробуйте ещё раз.", close:"Закрыть"},
    ka:{btn:"შეფასებები", title:"კლიენტების შეფასებები", empty:"შეფასებები ჯერ არ არის — იყავით პირველი!",
        write:"დაწერეთ შეფასება", back:"‹ შეფასებებზე დაბრუნება", name:"თქვენი სახელი",
        text:"თქვენი კომენტარი", text_p:"როგორი იყო ჩვენთან მუშაობა?", rating:"შეფასება (1–10)",
        send:"შეფასების გაგზავნა", done_t:"მადლობა!", done_x:"თქვენი შეფასება გამოჩნდება დადასტურების შემდეგ.",
        done_live:"თქვენი შეფასება უკვე გამოქვეყნებულია!",
        more:"მეტი შეფასება", less:"დამალვა",
        err:"ვერ გაიგზავნა — სცადეთ თავიდან.", close:"დახურვა"}
  };
  function dict(){ return T[document.documentElement.getAttribute("lang")] || T.ka; }
  function esc(s){ return String(s==null?"":s).replace(/[&<>"'/]/g,function(c){
    return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;","/":"&#47;"}[c]; }); }
  function stars(n){
    var out = "";
    for(var i=1;i<=10;i++) out += '<span class="bw-star'+(i<=n?' is-on':'')+'">★</span>';
    return out;
  }
  function fdate(ts){
    var loc = {ka:"ka-GE", ru:"ru-RU", en:"en-GB"}[document.documentElement.getAttribute("lang")] || "ka-GE";
    try{ return new Date(ts).toLocaleDateString(loc,{year:"numeric",month:"short",day:"numeric"}); }
    catch(e){ return ""; }
  }

  var list = [], view = "list", rating = 0, prevOverflow = "", doneLive = false;
  var btn, pop, body, titleEl;

  function build(){
    btn = document.createElement("button");
    btn.type = "button"; btn.className = "bwrw-btn"; btn.id = "bwrwBtn";
    btn.innerHTML = '<span class="bwrw-star">★</span><span class="bwrw-btn-t"></span>';
    document.body.appendChild(btn);

    pop = document.createElement("div");
    pop.className = "bwrw-pop"; pop.id = "bwrwPop"; pop.hidden = true;
    pop.setAttribute("role","dialog"); pop.setAttribute("aria-modal","true");
    pop.innerHTML =
      '<div class="bwrw-card">' +
        '<div class="bwrw-head"><h3 class="bwrw-title"></h3>' +
          '<button class="bwrw-x" type="button" aria-label="Close">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
          '</button></div>' +
        '<div class="bwrw-body"></div>' +
      '</div>';
    document.body.appendChild(pop);
    body = pop.querySelector(".bwrw-body");
    titleEl = pop.querySelector(".bwrw-title");

    btn.addEventListener("click", openPop);
    pop.querySelector(".bwrw-x").addEventListener("click", closePop);
    pop.addEventListener("click", function(e){ if(e.target === pop) closePop(); });
    document.addEventListener("keydown", function(e){
      if(e.key === "Escape" && !pop.hidden) closePop();
    });
    new MutationObserver(paint).observe(document.documentElement,
      {attributes:true, attributeFilter:["lang"]});
    paint();
  }

  function openPop(){
    view = "list";
    prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    pop.hidden = false;
    refresh();
    paint();
  }
  function closePop(){
    pop.hidden = true;
    document.body.style.overflow = prevOverflow;
  }
  function refresh(){
    fetch("/api/reviews").then(function(r){ return r.json(); }).then(function(d){
      if(d && d.ok){ list = d.reviews || []; if(view === "list") paint(); }
    }).catch(function(){});
  }

  function paint(){
    var t = dict();
    if(btn) btn.querySelector(".bwrw-btn-t").textContent = t.btn;
    if(!pop || pop.hidden === undefined) return;
    titleEl.textContent = t.title;

    if(view === "list"){
      var items = list.length
        ? list.map(function(r){
            r = {rating: Math.max(1, Math.min(10, Math.round(Number(r.rating)) || 1)),
                 text: r.text, name: r.name, ts: r.ts};
            return '<article class="bw-rv-card bwrw-item">' +
              '<div class="bw-rv-top"><span>'+stars(r.rating)+'</span>' +
              '<span class="bw-rv-score">'+r.rating+'/10</span></div>' +
              '<p class="bw-rv-text">'+esc(r.text)+'</p>' +
              '<div class="bw-rv-who"><b>'+esc(r.name)+'</b><span>'+esc(fdate(r.ts))+'</span></div>' +
              '</article>';
          }).join("")
        : '<p class="bwrw-empty">'+esc(t.empty)+'</p>';
      body.innerHTML = '<div class="bwrw-list">'+items+'</div>' +
        '<div class="bwrw-foot"><button class="bw-btn bw-btn-primary" type="button" data-w="write">'+esc(t.write)+'</button></div>';
      body.querySelector('[data-w="write"]').addEventListener("click", function(){
        view = "form"; rating = 0; paint();
      });

    } else if(view === "form"){
      var starBtns = "";
      for(var i=1;i<=10;i++)
        starBtns += '<button type="button" class="bw-rv-starbtn'+(i<=rating?' is-on':'')+'" data-v="'+i+'" aria-label="'+i+'/10">★</button>';
      body.innerHTML =
        '<button class="bwrw-back" type="button">'+esc(t.back)+'</button>' +
        '<label class="bw-field"><span>'+esc(t.name)+'</span><input id="bwrwName" type="text" maxlength="60"></label>' +
        '<label class="bw-field"><span>'+esc(t.text)+'</span><textarea id="bwrwText" rows="4" maxlength="1200" placeholder="'+esc(t.text_p)+'"></textarea></label>' +
        '<div class="bw-field"><span>'+esc(t.rating)+'</span><div class="bw-rv-stars">'+starBtns+'</div></div>' +
        '<input class="bw-hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">' +
        '<div class="bw-order-err" id="bwrwErr" hidden>'+esc(t.err)+'</div>' +
        '<button class="bw-btn bw-btn-primary" type="button" id="bwrwSend">'+esc(t.send)+'</button>';
      body.querySelector(".bwrw-back").addEventListener("click", function(){ view = "list"; paint(); });
      body.querySelector(".bw-rv-stars").addEventListener("click", function(e){
        var b = e.target.closest(".bw-rv-starbtn");
        if(!b) return;
        rating = Number(b.dataset.v);
        body.querySelectorAll(".bw-rv-starbtn").forEach(function(x){
          x.classList.toggle("is-on", Number(x.dataset.v) <= rating);
        });
      });
      body.querySelector("#bwrwSend").addEventListener("click", function(){
        var send = body.querySelector("#bwrwSend");
        var err = body.querySelector("#bwrwErr");
        if(send.disabled) return;
        err.hidden = true;
        var name = body.querySelector("#bwrwName").value.trim();
        var text = body.querySelector("#bwrwText").value.trim();
        if(!name || text.length < 4 || !rating){ err.hidden = false; return; }
        send.disabled = true;
        fetch("/api/reviews", {method:"POST", headers:{"Content-Type":"application/json"},
          body: JSON.stringify({name:name, text:text, rating:rating,
            website: (body.querySelector(".bw-hp")||{}).value || ""})})
        .then(function(r){ if(!r.ok) throw 0; return r.json(); })
        .then(function(resp){
          doneLive = !!(resp && resp.pending === false);
          if(doneLive) refresh();          /* their review is already public */
          view = "done"; paint();
        })
        .catch(function(){ err.hidden = false; send.disabled = false; });
      });

    } else { /* done */
      body.innerHTML = '<div class="bwrw-done"><h3>'+esc(t.done_t)+'</h3>' +
        '<p>'+esc(doneLive ? t.done_live : t.done_x)+'</p>' +
        '<button class="bw-btn bw-btn-primary" type="button" data-w="close">'+esc(t.close)+'</button></div>';
      body.querySelector('[data-w="close"]').addEventListener("click", closePop);
    }
  }

  /* ---- render approved reviews as full testimonial blocks on the page ---- */
  var TESTI_SHOWN = 2;          /* how many approved reviews to show before "see more" */
  var testiExpanded = false;

  function testiBlock(r){
    var rating = Math.max(1, Math.min(10, Math.round(Number(r.rating)) || 1));
    var initial = (String(r.name || "?").trim().charAt(0) || "?").toUpperCase();
    return '<div class="bw-testi-inner bw-testi-review" data-reveal="0">' +
      '<svg class="bw-quote-mark" viewBox="0 0 40 32" aria-hidden="true"><path d="M0 32V18C0 8 6 1.5 16 0l2 5C12 6.5 9 10 9 14h7v18H0zm22 0V18C22 8 28 1.5 38 0l2 5c-6 1.5-9 5-9 9h7v18H22z"/></svg>' +
      '<div class="bw-testi-stars" aria-label="'+rating+'/10">'+stars(rating)+'</div>' +
      '<blockquote class="bw-quote">'+esc(r.text)+'</blockquote>' +
      '<div class="bw-testi-avatar bw-testi-avatar-initial" aria-hidden="true">'+esc(initial)+'</div>' +
      '<div class="bw-testi-author">'+esc(r.name)+'</div>' +
      '<div class="bw-testi-role">'+esc(fdate(r.ts))+'</div>' +
      '</div>';
  }

  function renderTestimonials(){
    var track = document.getElementById("bwTestiTrack");
    var moreWrap = document.getElementById("bwTestiMoreWrap");
    var moreBtn = document.getElementById("bwTestiMore");
    if(!track) return;

    /* remove previously injected review blocks (keep the default one) */
    track.querySelectorAll(".bw-testi-review").forEach(function(el){ el.remove(); });

    var approved = (list || []).filter(function(r){ return r && r.text && r.name; });
    var shown = testiExpanded ? approved : approved.slice(0, TESTI_SHOWN);
    var html = shown.map(testiBlock).join("");
    track.insertAdjacentHTML("beforeend", html);

    /* reveal-on-scroll for the freshly added blocks (with a safety fallback) */
    if(window.bwObserveReveal){
      window.bwObserveReveal(track);
    }
    /* fallback: if a block is already in view or the observer isn't active,
       make sure it becomes visible rather than staying at opacity 0 */
    setTimeout(function(){
      track.querySelectorAll(".bw-testi-review[data-reveal]:not(.is-in)").forEach(function(el){
        var r = el.getBoundingClientRect();
        if(r.top < window.innerHeight) el.classList.add("is-in");
      });
    }, 60);

    if(moreWrap && moreBtn){
      var t = dict();
      if(approved.length > TESTI_SHOWN){
        moreWrap.hidden = false;
        moreBtn.textContent = testiExpanded ? (t.less || "Show less") : (t.more || "See more reviews");
      } else {
        moreWrap.hidden = true;
      }
    }
  }

  function wireTestiMore(){
    var moreBtn = document.getElementById("bwTestiMore");
    if(moreBtn && !moreBtn.dataset.wired){
      moreBtn.dataset.wired = "1";
      moreBtn.addEventListener("click", function(){
        testiExpanded = !testiExpanded;
        renderTestimonials();
      });
    }
  }

  /* show the widget only when the review server is actually there */
  fetch("/api/reviews").then(function(r){ return r.json(); }).then(function(d){
    if(d && d.ok){
      list = d.reviews || [];
      build();
      wireTestiMore();
      renderTestimonials();
    }
  }).catch(function(){});
})();
