/* BokWeb — Prices page (standalone) */
(function(){
  "use strict";
  var root = document.documentElement;

  /* ---------- i18n ---------- */
  var I18N = {
    en:{
      ob_back:"Back",
      price_eyebrow:"Pricing", price_title:"Choose the plan that fits", price_sub:"Simple, honest pricing for Georgian businesses. One-time payment, no hidden fees — and we reply the same day.",
      price_from:"from", price_note:"one-time payment", price_order:"Order", price_see:"See plans",
      pop_badge:"Most popular",
      ob_title:"Start your website", ob_sub:"Tell us a little about your business. We reply the same day. No obligations.",
      ob_name:"Your name", ob_name_p:"e.g. Anna", ob_biz:"Business name", ob_biz_p:"e.g. Anna Flowers",
      ob_contact:"Phone or email", ob_contact_p:"How can we reach you?", ob_msg:"What do you need?", ob_msg_p:"A shop, a booking page, a fresh look…",
      ob_send:"Send request", ob_sent_title:"Request received", ob_sent_text:"Thank you. Our team will contact you shortly to plan your website.",
      hl_eyebrow:"What's included", hl_title:"Every plan includes this",
      feat_eyebrow:"In detail", feat_title:"A website that works for you",
      faq_eyebrow:"FAQ", faq_title:"Frequently asked questions",
      cta_title:"Ready for your website?", cta_sub:"Tell us about your project — we reply the same day.", cta_btn:"Get started", swipe_hint:"Swipe"
    },
    ru:{
      ob_back:"Назад",
      price_eyebrow:"Цены", price_title:"Выберите подходящий план", price_sub:"Простые и честные цены для грузинского бизнеса. Разовая оплата, без скрытых платежей — и мы отвечаем в тот же день.",
      price_from:"от", price_note:"разовая оплата", price_order:"Заказать", price_see:"Смотреть планы",
      pop_badge:"Популярный",
      ob_title:"Начнём ваш сайт", ob_sub:"Расскажите немного о вашем бизнесе. Отвечаем в тот же день. Без обязательств.",
      ob_name:"Ваше имя", ob_name_p:"напр. Анна", ob_biz:"Название бизнеса", ob_biz_p:"напр. Anna Flowers",
      ob_contact:"Телефон или email", ob_contact_p:"Как с вами связаться?", ob_msg:"Что вам нужно?", ob_msg_p:"Магазин, страница записи, новый вид…",
      ob_send:"Отправить", ob_sent_title:"Заявка получена", ob_sent_text:"Спасибо! Наша команда свяжется с вами в ближайшее время, чтобы спланировать сайт.",
      hl_eyebrow:"Что входит", hl_title:"Каждый план включает это",
      feat_eyebrow:"Подробно", feat_title:"Сайт, который работает на вас",
      faq_eyebrow:"Вопросы", faq_title:"Частые вопросы",
      cta_title:"Готовы к своему сайту?", cta_sub:"Расскажите о проекте — отвечаем в тот же день.", cta_btn:"Начать", swipe_hint:"Листайте"
    },
    ka:{
      ob_back:"უკან",
      price_eyebrow:"ფასები", price_title:"აირჩიეთ თქვენზე მორგებული გეგმა", price_sub:"მარტივი და გამჭვირვალე ფასები ქართული ბიზნესისთვის. ერთჯერადი გადახდა, ფარული საფასურის გარეშე — და ვპასუხობთ იმავე დღეს.",
      price_from:"დაწყებული", price_note:"ერთჯერადი გადახდა", price_order:"შეუკვეთე", price_see:"იხილეთ გეგმები",
      pop_badge:"პოპულარული",
      ob_title:"დავიწყოთ თქვენი საიტი", ob_sub:"მოგვიყევით ცოტა თქვენს ბიზნესზე. ვპასუხობთ იმავე დღეს. ვალდებულების გარეშე.",
      ob_name:"თქვენი სახელი", ob_name_p:"მაგ. ნინო", ob_biz:"ბიზნესის სახელი", ob_biz_p:"მაგ. Anna Flowers",
      ob_contact:"ტელეფონი ან email", ob_contact_p:"როგორ დაგიკავშირდეთ?", ob_msg:"რა გჭირდებათ?", ob_msg_p:"მაღაზია, ჩაწერის გვერდი, ახალი იერსახე…",
      ob_send:"გაგზავნა", ob_sent_title:"შეკვეთა მიღებულია", ob_sent_text:"გმადლობთ! ჩვენი გუნდი მალე დაგიკავშირდებათ საიტის დასაგეგმად.",
      hl_eyebrow:"რას იღებთ", hl_title:"ყველა გეგმა მოიცავს ამას",
      feat_eyebrow:"დეტალურად", feat_title:"საიტი, რომელიც მუშაობს თქვენთვის",
      faq_eyebrow:"კითხვები", faq_title:"ხშირად დასმული კითხვები",
      cta_title:"მზად ხართ თქვენი საიტისთვის?", cta_sub:"მოგვიყევით პროექტზე — ვპასუხობთ იმავე დღეს.", cta_btn:"დაიწყე ახლა", swipe_hint:"გადაფურცლეთ"
    }
  };
  var CODE = { en:"EN", ru:"RU", ka:"KA" };

  /* ---------- plan data ---------- */
  var PLAN_NAMES   = ["Basic", "Pro", "Pro Plus"];
  var PLAN_PRICES  = ["₾790", "₾1790", "₾3490"];   // starting prices (GEL, one-time)
  var PLAN_POPULAR = [false, true, false];
  /* PLAN CARDS — change images: overwrite images/prices/plan-1.png … plan-3.png */
  var PLAN_IMAGES  = ["images/prices/plan-1.png", "images/prices/plan-2.png", "images/prices/plan-3.png"];

  /* HERO SLIDESHOW — change images: overwrite images/prices/hero-1.png … hero-3.png.
     Optional videos: drop basic.mp4 / pro.mp4 / proplus.mp4 into the "videos" folder —
     the poster image shows until the video exists/loads. */
  var HERO_MEDIA = [
    { poster:"images/prices/hero-1.png", video:"videos/basic.mp4" },
    { poster:"images/prices/hero-2.png", video:"videos/pro.mp4" },
    { poster:"images/prices/hero-3.png", video:"videos/proplus.mp4" }
  ];

  var PLANS_TEXT = {
    en:[
      {eyebrow:"A simple start",   tagline:"A clean, simple website that launches fast.",   features:["One-page or small website","Mobile-friendly design","Contact form","Basic SEO setup","Ready in ~1 week"]},
      {eyebrow:"Made for business",tagline:"A full business website, built to sell.",        features:["Up to 6 pages","Custom design","Gallery & blog","SEO optimization","Ready in ~2–3 weeks"]},
      {eyebrow:"Sell online",      tagline:"An online store and everything to grow.",         features:["Online store (e-commerce)","Online payments","Unlimited pages","Advanced SEO","Priority support"]}
    ],
    ru:[
      {eyebrow:"Простое начало",   tagline:"Чистый простой сайт, который быстро запускается.",features:["Одностраничный или небольшой сайт","Адаптивный дизайн","Форма обратной связи","Базовая SEO-настройка","Готово за ~1 неделю"]},
      {eyebrow:"Для бизнеса",      tagline:"Полноценный бизнес-сайт, созданный продавать.",   features:["До 6 страниц","Индивидуальный дизайн","Галерея и блог","SEO-оптимизация","Готово за ~2–3 недели"]},
      {eyebrow:"Продажи онлайн",   tagline:"Интернет-магазин и всё для роста.",               features:["Интернет-магазин","Онлайн-оплата","Неограниченно страниц","Продвинутое SEO","Приоритетная поддержка"]}
    ],
    ka:[
      {eyebrow:"მარტივი დასაწყისი",tagline:"სუფთა, მარტივი საიტი, რომელიც სწრაფად ამუშავდება.",features:["ერთგვერდიანი ან მცირე საიტი","მობილურზე მორგებული დიზაინი","საკონტაქტო ფორმა","ბაზისური SEO","მზადაა ~1 კვირაში"]},
      {eyebrow:"ბიზნესისთვის",     tagline:"სრული ბიზნეს-საიტი, შექმნილი გასაყიდად.",          features:["6 გვერდამდე","ინდივიდუალური დიზაინი","გალერეა და ბლოგი","SEO ოპტიმიზაცია","მზადაა ~2–3 კვირაში"]},
      {eyebrow:"ონლაინ გაყიდვები", tagline:"ონლაინ მაღაზია და ყველაფერი გასაზრდელად.",         features:["ონლაინ მაღაზია","ონლაინ გადახდები","შეუზღუდავი გვერდები","გაძლიერებული SEO","პრიორიტეტული მხარდაჭერა"]}
    ]
  };

  function esc(s){ return String(s).replace(/[&<>"'/]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;","/":"&#47;"}[c]; }); }

  /* ---------- extra section content ---------- */
  /* HIGHLIGHT CARDS — change images: overwrite images/prices/highlight-1.png … highlight-5.png */
  var HL_IMAGES = ["images/prices/highlight-1.png","images/prices/highlight-2.png","images/prices/highlight-3.png","images/prices/highlight-4.png","images/prices/highlight-5.png"];
  /* WIDE BAND IMAGES — change images: overwrite images/prices/band-1.png … band-3.png */
  var BAND_IMAGES = ["images/prices/band-1.png","images/prices/band-2.png","images/prices/band-3.png"];
  var HL_TEXT = {
    en:["Mobile-first — looks great on every screen","Fast and SEO-ready from day one","You own your website, fully","We reply the same day","Delivered in weeks, not months"],
    ru:["Mobile-first — отлично на любом экране","Быстрый и готовый к SEO с первого дня","Сайт полностью принадлежит вам","Отвечаем в тот же день","Готово за недели, а не месяцы"],
    ka:["მობილურზე მორგებული, მშვენივრად ჩანს ყველა ეკრანზე","სწრაფი და SEO-ზე მზად პირველივე დღიდან","საიტი სრულად თქვენია","ვპასუხობთ იმავე დღეს","მზადდება კვირებში, არა თვეებში"]
  };
  var FEAT = {
    en:[
      {title:"A website built to bring you clients", text:"Clear pages, honest prices and a visible contact button on every screen — so visitors turn into real requests, day and night."},
      {title:"Easy to update — no code needed", text:"With Pro and Pro Plus you get a simple editor. Change text, prices and photos yourself in minutes, whenever you want."},
      {title:"Support that stays after launch", text:"We don't disappear after go-live. Updates, small changes and quick help are always one message away."}
    ],
    ru:[
      {title:"Сайт, созданный приводить клиентов", text:"Понятные страницы, честные цены и заметная кнопка контакта на каждом экране — посетители превращаются в реальные заявки, днём и ночью."},
      {title:"Легко обновлять — без кода", text:"С Pro и Pro Plus вы получаете простой редактор. Меняйте текст, цены и фото сами, за минуты, когда захотите."},
      {title:"Поддержка, которая остаётся после запуска", text:"Мы не исчезаем после запуска. Обновления, небольшие правки и быстрая помощь всегда на расстоянии одного сообщения."}
    ],
    ka:[
      {title:"საიტი, შექმნილი კლიენტების მოსაზიდად", text:"გასაგები გვერდები, გამჭვირვალე ფასები და ხილული საკონტაქტო ღილაკი ყველა ეკრანზე, ვიზიტორები რეალურ შეკვეთებად იქცევა."},
      {title:"მარტივი განახლება, კოდის გარეშე", text:"Pro და Pro Plus-თან ერთად იღებთ მარტივ რედაქტორს. შეცვალეთ ტექსტი, ფასები და ფოტოები თავად, წუთებში, როცა გინდათ."},
      {title:"მხარდაჭერა, რომელიც რჩება გაშვების შემდეგ", text:"არ ვქრებით საიტის ამუშავების შემდეგ. განახლებები, მცირე ცვლილებები და სწრაფი დახმარება ყოველთვის ერთ შეტყობინებაშია."}
    ]
  };
  var FAQ = {
    en:[
      {q:"How long does a website take?", a:"It depends on the plan — Basic is ready in about a week, Pro in 2–3 weeks, and Pro Plus in 4–6 weeks."},
      {q:"Is hosting and a domain included?", a:"We set up hosting, your domain and business email for you. Hosting is a small yearly cost, and we handle all the technical parts."},
      {q:"Can I update the website myself?", a:"Yes. Pro and Pro Plus include an easy editor, so you can change text, prices and photos anytime — no code needed."},
      {q:"Can I pay in parts?", a:"Yes. We usually split the project into a few milestones, so you pay as the work moves forward."},
      {q:"What if I need something not in the plans?", a:"Just tell us. Every plan is a starting point — we tailor the pages and features to fit your business."}
    ],
    ru:[
      {q:"Сколько времени занимает сайт?", a:"Зависит от плана — Basic готов примерно за неделю, Pro за 2–3 недели, Pro Plus за 4–6 недель."},
      {q:"Входит ли хостинг и домен?", a:"Мы настраиваем хостинг, домен и бизнес-почту. Хостинг — небольшая годовая плата, а всю техническую часть берём на себя."},
      {q:"Могу ли я обновлять сайт сам?", a:"Да. Pro и Pro Plus включают простой редактор — меняйте текст, цены и фото в любое время, без кода."},
      {q:"Можно ли платить частями?", a:"Да. Обычно мы делим проект на несколько этапов, чтобы вы платили по мере выполнения работы."},
      {q:"А если нужно что-то, чего нет в планах?", a:"Просто скажите нам. Каждый план — отправная точка; мы подстроим страницы и функции под ваш бизнес."}
    ],
    ka:[
      {q:"რამდენ ხანს სჭირდება საიტს?", a:"დამოკიდებულია გეგმაზე — Basic მზადაა დაახლოებით ერთ კვირაში, Pro 2–3 კვირაში, Pro Plus კი 4–6 კვირაში."},
      {q:"ჰოსტინგი და დომენი შედის?", a:"ჩვენ გიმართავთ ჰოსტინგს, დომენსა და ბიზნეს-ელფოსტას. ჰოსტინგი მცირე წლიური ხარჯია და ტექნიკურ მხარეს ჩვენ ვუვლით."},
      {q:"შემიძლია საიტი თავად განვაახლო?", a:"დიახ. Pro და Pro Plus მოიცავს მარტივ რედაქტორს, რომ ნებისმიერ დროს შეცვალოთ ტექსტი, ფასები და ფოტოები — კოდის გარეშე."},
      {q:"შესაძლებელია ნაწილ-ნაწილ გადახდა?", a:"დიახ. ჩვეულებრივ პროექტს ვყოფთ რამდენიმე ეტაპად, რომ გადაიხადოთ სამუშაოს მიმდინარეობისას."},
      {q:"რა მოხდება, თუ რაღაც გეგმებში არ არის?", a:"უბრალოდ გვითხარით. ყოველი გეგმა საწყისი წერტილია — ვამორგებთ გვერდებსა და ფუნქციებს თქვენს ბიზნესს."}
    ]
  };
  /* BW-CONTENT-MERGE: texts saved from the admin panel override the built-ins */
  ;(function(){
    var C = window.BW_CONTENT; if(!C) return;
    if(C.plan_names  && C.plan_names.length)  PLAN_NAMES  = C.plan_names;
    if(C.plan_prices && C.plan_prices.length) PLAN_PRICES = C.plan_prices;
    ["en","ru","ka"].forEach(function(l){
      if(C.prices_i18n && C.prices_i18n[l]) Object.assign(I18N[l] || (I18N[l]={}), C.prices_i18n[l]);
      if(C.plans      && C.plans[l])      PLANS_TEXT[l] = C.plans[l];
      if(C.highlights && C.highlights[l]) HL_TEXT[l]    = C.highlights[l];
      if(C.feat       && C.feat[l])       FEAT[l]       = C.feat[l];
      if(C.faq        && C.faq[l])        FAQ[l]        = C.faq[l];
    });
  })();

  function renderHighlights(lang){
    var el = document.getElementById("hlGrid"); if(!el) return;
    var t = HL_TEXT[lang] || HL_TEXT.en;
    el.innerHTML = t.map(function(title,i){
      return '<article class="hl-card'+(i===0?" hl-wide":"")+'" style="--card-img:url(\''+HL_IMAGES[i]+'\')"><h3 class="hl-title">'+esc(title)+'</h3></article>';
    }).join("");
  }
  function renderFeatures(lang){
    var el = document.getElementById("featWrap"); if(!el) return;
    var t = FEAT[lang] || FEAT.en;
    el.innerHTML = t.map(function(f,i){
      return '<div class="feat-band'+(i%2?" feat-rev":"")+'"><div class="feat-media"><img src="'+BAND_IMAGES[i]+'" alt="" loading="lazy"></div><div class="feat-text"><h3>'+esc(f.title)+'</h3><p>'+esc(f.text)+'</p></div></div>';
    }).join("");
  }
  function renderFaq(lang){
    var el = document.getElementById("faqList"); if(!el) return;
    var t = FAQ[lang] || FAQ.en;
    el.innerHTML = t.map(function(item){
      return '<div class="faq-item"><button class="faq-q" type="button" aria-expanded="false"><span>'+esc(item.q)+'</span><span class="faq-ic" aria-hidden="true"></span></button><div class="faq-a"><p>'+esc(item.a)+'</p></div></div>';
    }).join("");
    el.querySelectorAll(".faq-q").forEach(function(btn){
      btn.addEventListener("click", function(){
        var it = btn.closest(".faq-item");
        var open = it.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", String(open));
      });
    });
  }

  /* ---------- theme (persisted) ---------- */
  var themeBtn = document.getElementById("themeBtn");
  function applyTheme(t){
    t = (t === "dark" || t === "light") ? t : "light";
    root.setAttribute("data-theme", t);
    if(themeBtn) themeBtn.setAttribute("aria-pressed", String(t === "dark"));
    try{ localStorage.setItem("bw-theme", t); }catch(e){}
  }
  if(themeBtn) themeBtn.addEventListener("click", function(){
    applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
  });

  /* ---------- language dropdown ---------- */
  var langBox = document.querySelector("[data-lang]");
  if(langBox){
    var trigger = langBox.querySelector(".lang-trigger");
    if(trigger){
      trigger.addEventListener("click", function(e){ e.stopPropagation(); var o = langBox.classList.toggle("open"); trigger.setAttribute("aria-expanded", String(o)); });
    }
    document.addEventListener("click", function(){ langBox.classList.remove("open"); if(trigger) trigger.setAttribute("aria-expanded","false"); });
  }

  /* ---------- language ---------- */
  function setLang(lang){
    if(lang !== "ka" && lang !== "en" && lang !== "ru") lang = "ka";
    var dict = I18N[lang] || I18N.en;
    root.setAttribute("lang", lang);
    document.querySelectorAll("[data-i18n]").forEach(function(el){ var k=el.getAttribute("data-i18n"); if(dict[k]!=null) el.textContent = dict[k]; });
    document.querySelectorAll("[data-i18n-ph]").forEach(function(el){ var k=el.getAttribute("data-i18n-ph"); if(dict[k]!=null) el.setAttribute("placeholder", dict[k]); });
    document.querySelectorAll(".lang-code").forEach(function(el){ el.textContent = CODE[lang]; });
    document.querySelectorAll("[data-set-lang]").forEach(function(b){ b.classList.toggle("active", b.getAttribute("data-set-lang") === lang); });
    try{ localStorage.setItem("bw-lang", lang); }catch(e){}
    renderHero(lang);
    renderPlans(lang);
    renderHighlights(lang);
    renderFeatures(lang);
    renderFaq(lang);
  }
  document.querySelectorAll("[data-set-lang]").forEach(function(b){
    b.addEventListener("click", function(e){ e.stopPropagation(); setLang(b.getAttribute("data-set-lang")); if(langBox) langBox.classList.remove("open"); });
  });

  /* ---------- hero slideshow ---------- */
  var heroTrack = document.getElementById("heroTrack");
  var heroDots  = document.getElementById("heroDots");
  var heroIndex = 0, heroTimer = null;
  var HERO_COUNT = PLAN_NAMES.length;
  var heroReduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;

  function renderHero(lang){
    if(!heroTrack) return;
    var dict = I18N[lang] || I18N.en;
    var txt = PLANS_TEXT[lang] || PLANS_TEXT.en;
    heroTrack.innerHTML = PLAN_NAMES.map(function(name,i){
      var m = HERO_MEDIA[i] || {};
      var t = txt[i] || {};
      return '<div class="ph-slide'+(i===heroIndex?" is-active":"")+'" style="background-image:url(\''+m.poster+'\')">'
        + '<video class="ph-video" autoplay muted loop playsinline preload="auto" poster="'+m.poster+'"><source src="'+m.video+'" type="video/mp4"></video>'
        + '<div class="ph-shade"></div>'
        + '<div class="ph-content">'
          + '<span class="ph-eyebrow">'+esc(t.eyebrow||"")+'</span>'
          + '<h1 class="ph-title">'+esc(name)+'</h1>'
          + '<p class="ph-tag">'+esc(t.tagline||"")+'</p>'
          + '<div class="ph-price-line"><span>'+esc(dict.price_from)+'</span> <b>'+esc(PLAN_PRICES[i])+'</b></div>'
          + '<div class="ph-cta">'
            + '<button class="bw-btn bw-btn-primary pp-order" type="button">'+esc(dict.price_order)+'</button>'
            + '<a class="bw-btn bw-btn-ghost ph-see" href="#plans">'+esc(dict.price_see)+'</a>'
          + '</div>'
        + '</div>'
      + '</div>';
    }).join("");
    heroDots.innerHTML = PLAN_NAMES.map(function(name,i){
      return '<button class="ph-dot'+(i===heroIndex?" is-active":"")+'" type="button" data-hero="'+i+'" aria-label="'+esc(name)+'"></button>';
    }).join("");
    heroDots.querySelectorAll("[data-hero]").forEach(function(d){
      d.addEventListener("click", function(){ heroGoTo(parseInt(d.getAttribute("data-hero"),10)||0); heroRestart(); });
    });
    bindOrderOpeners();
    if(heroIndex >= HERO_COUNT) heroIndex = 0;
    heroApply();
  }
  function heroSlides(){ return heroTrack ? heroTrack.querySelectorAll(".ph-slide") : []; }
  function heroApply(){
    var slides = heroSlides();
    slides.forEach(function(s,i){
      var on = (i===heroIndex);
      s.classList.toggle("is-active", on);
      var v = s.querySelector(".ph-video");
      if(v){ try{ if(on){ v.play().catch(function(){}); } else { v.pause(); } }catch(e){} }
    });
    if(heroDots) heroDots.querySelectorAll(".ph-dot").forEach(function(d,i){ d.classList.toggle("is-active", i===heroIndex); });
  }
  function heroGoTo(i){ heroIndex = (i+HERO_COUNT)%HERO_COUNT; heroApply(); }
  function heroGo(d){ heroGoTo(heroIndex + d); }
  function heroStart(){ if(heroReduce || heroTimer || HERO_COUNT<2) return; heroTimer = setInterval(function(){ heroGo(1); }, 6500); }
  function heroStop(){ if(heroTimer){ clearInterval(heroTimer); heroTimer = null; } }
  function heroRestart(){ heroStop(); heroStart(); }

  var heroEl = document.querySelector(".price-hero");
  if(heroEl){
    var prev = heroEl.querySelector(".ph-prev");
    var next = heroEl.querySelector(".ph-next");
    if(prev) prev.addEventListener("click", function(){ heroGo(-1); heroRestart(); });
    if(next) next.addEventListener("click", function(){ heroGo(1); heroRestart(); });
    heroEl.addEventListener("mouseenter", heroStop);
    heroEl.addEventListener("mouseleave", heroStart);
    var sx = null;
    var swipeHint = document.getElementById("phSwipeHint");
    var hintDone = false;
    function hideSwipeHint(){ if(hintDone) return; hintDone = true; if(swipeHint) swipeHint.classList.add("is-hidden"); }
    setTimeout(hideSwipeHint, 4500);
    heroEl.addEventListener("pointerdown", function(e){ sx = e.clientX; });
    window.addEventListener("pointerup", function(e){
      if(sx === null) return; var dx = e.clientX - sx; sx = null;
      if(Math.abs(dx) > 45){ heroGo(dx < 0 ? 1 : -1); heroRestart(); hideSwipeHint(); }
    });
    heroStart();
  }

  /* ---------- plan cards ---------- */
  var planGrid = document.getElementById("planGrid");
  function renderPlans(lang){
    if(!planGrid) return;
    var dict = I18N[lang] || I18N.en;
    var txt = PLANS_TEXT[lang] || PLANS_TEXT.en;
    planGrid.innerHTML = PLAN_NAMES.map(function(name,i){
      var t = txt[i] || {};
      var badge = PLAN_POPULAR[i] ? '<span class="pp-badge">'+esc(dict.pop_badge)+'</span>' : '';
      var feats = (t.features||[]).map(function(f){ return '<li><span class="bw-chip-check"><span class="bw-check"></span></span><span>'+esc(f)+'</span></li>'; }).join("");
      return '<article class="pp-card'+(PLAN_POPULAR[i]?" is-popular":"")+'" style="--card-img:url(\''+PLAN_IMAGES[i]+'\')">'
        + '<div class="pp-card-top">'+badge+'<h3 class="pp-name">'+esc(name)+'</h3><p class="pp-tag">'+esc(t.tagline||"")+'</p></div>'
        + '<div class="pp-card-body">'
          + '<ul class="pp-feats">'+feats+'</ul>'
          + '<div class="pp-foot">'
            + '<div class="pp-price"><span class="pp-from">'+esc(dict.price_from)+'</span><span class="pp-amount">'+esc(PLAN_PRICES[i])+'</span><span class="pp-note">'+esc(dict.price_note)+'</span></div>'
            + '<button class="bw-btn bw-btn-primary pp-order pp-order-btn" type="button">'+esc(dict.price_order)+'</button>'
          + '</div>'
        + '</div>'
      + '</article>';
    }).join("");
    bindOrderOpeners();
  }

  /* ---------- order popup ---------- */
  var orderEl = document.getElementById("bwOrder");
  var orderForm = document.getElementById("bwOrderForm");
  var orderDone = document.getElementById("bwOrderDone");
  function openOrder(){
    if(!orderEl) return;
    if(orderForm) orderForm.hidden = false;
    if(orderDone) orderDone.hidden = true;
    orderEl.hidden = false; orderEl.setAttribute("aria-hidden","false");
    document.body.style.overflow = "hidden";
  }
  function closeOrder(){
    if(!orderEl) return;
    orderEl.hidden = true; orderEl.setAttribute("aria-hidden","true");
    document.body.style.overflow = "";
  }
  function bindOrderOpeners(){
    document.querySelectorAll(".pp-order").forEach(function(b){
      if(b.dataset.bound) return; b.dataset.bound = "1";
      b.addEventListener("click", function(e){ e.preventDefault(); openOrder(); });
    });
  }
  var orderBack = document.getElementById("bwOrderBack");
  if(orderBack) orderBack.addEventListener("click", closeOrder);
  document.querySelectorAll(".bw-order-back2").forEach(function(b){ b.addEventListener("click", closeOrder); });
  var orderSend = document.getElementById("bwOrderSend");
  var orderErr = document.getElementById("bwOrderErr");
  function pMarkField(id){ var e=document.getElementById(id); if(e){ e.focus(); e.classList.add("bw-field-err"); } }
  function pClearErr(id){ var e=document.getElementById(id); if(e) e.classList.remove("bw-field-err"); }
  ["bwOName","bwOContact","bwOMsg"].forEach(function(id){
    var e=document.getElementById(id); if(e) e.addEventListener("input", function(){ pClearErr(id); });
  });
  function pLooksLikeContact(v){
    var email = /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/.test(v);
    var digits = (v.match(/\d/g) || []).length;
    var phone = /^[+()\-\s\d]+$/.test(v) && digits >= 6;
    return email || phone;
  }
  if(orderSend) orderSend.addEventListener("click", function(){
    if(orderSend.disabled) return;
    var v = function(id){ var e = document.getElementById(id); return e ? e.value.trim() : ""; };
    var payload = { name:v("bwOName"), biz:v("bwOBiz"), contact:v("bwOContact"), msg:v("bwOMsg"),
      lang: document.documentElement.getAttribute("lang") || "ka",
      website: (document.querySelector("#bwOrderForm .bw-hp")||{}).value || "" };
    if(orderErr) orderErr.hidden = true;
    ["bwOName","bwOContact","bwOMsg"].forEach(pClearErr);
    if(payload.name.length < 2){ pMarkField("bwOName"); return; }
    if(!pLooksLikeContact(payload.contact)){ pMarkField("bwOContact"); return; }
    if(payload.msg.length < 4){ pMarkField("bwOMsg"); return; }
    orderSend.disabled = true;
    fetch("/api/orders", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(payload) })
    .then(function(r){ if(!r.ok) throw 0; return r.json(); })
    .then(function(resp){ if(resp && resp.ok === false) throw 0; if(orderForm) orderForm.hidden = true; if(orderDone) orderDone.hidden = false; })
    .catch(function(){ if(orderErr) orderErr.hidden = false; })
    .then(function(){ orderSend.disabled = false; });
  });
  document.addEventListener("keydown", function(e){ if(e.key==="Escape" && orderEl && !orderEl.hidden) closeOrder(); });

  /* ---------- init ---------- */
  (function(){
    var t; try{ t = localStorage.getItem("bw-theme"); }catch(e){}
    if(!t) t = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    applyTheme(t);
    var l; try{ l = localStorage.getItem("bw-lang"); }catch(e){}
    setLang(l || "ka");
  })();
})();
