/* BokWeb — Services page (standalone) */
(function(){
  "use strict";
  var root = document.documentElement;

  /* ---------- i18n (subset used on this page) ---------- */
  var I18N = {
    en:{ ob_back:"Back", svc_eyebrow:"Services", svc_title:"Everything your business needs online",
         svc_sub:"From the first design to launch and support — the full set of services a growing business needs to get chosen online.",
         svc_cta:"Order website", lang_label:"Language" },
    ru:{ ob_back:"Назад", svc_eyebrow:"Услуги", svc_title:"Всё, что нужно вашему бизнесу онлайн",
         svc_sub:"От первого дизайна до запуска и поддержки — полный набор услуг, который нужен растущему бизнесу, чтобы его выбирали онлайн.",
         svc_cta:"Заказать сайт", lang_label:"Язык" },
    ka:{ ob_back:"უკან", svc_eyebrow:"სერვისები", svc_title:"ყველაფერი, რაც ბიზნესს ონლაინ სჭირდება",
         svc_sub:"პირველი დიზაინიდან გაშვებამდე და მხარდაჭერამდე — სერვისების სრული ნაკრები, რომელიც მზარდ ბიზნესს სჭირდება, რომ ონლაინ აირჩიონ.",
         svc_cta:"შეუკვეთე საიტი", lang_label:"ენა" }
  };
  var CODE = { en:"EN", ru:"RU", ka:"KA" };

  /* ---------- service data ---------- */
  var SVC_ICONS = [
    '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11"/></svg>',
    '<svg viewBox="0 0 24 24"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>',
    '<svg viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>',
    '<svg viewBox="0 0 24 24"><path d="M12 3l1.9 5.8H20l-4.9 3.6 1.9 5.8L12 14.6 7 18.2l1.9-5.8L4 8.8h6.1z"/></svg>',
    '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4.2-4.2"/></svg>',
    '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.4"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/></svg>',
    '<svg viewBox="0 0 24 24"><path d="M12 3l7 3v6c0 4.6-3.1 7.6-7 9-3.9-1.4-7-4.4-7-9V6z"/><path d="M9 12l2 2 4-4"/></svg>',
    '<svg viewBox="0 0 24 24"><path d="M17.5 19a4.5 4.5 0 0 0 .5-8.98A6 6 0 0 0 6.3 9.5 4 4 0 0 0 7 19z"/></svg>'
  ];
  var SERVICES = {
    en:[
      {name:"Web design",title:"Designs that turn visitors into customers",desc:"Clean, modern interfaces built around your brand and your customer's journey, so every page looks trustworthy and guides people to act.",points:["Custom UI/UX design","Mobile-first layouts","Your brand colors and style","Designed to convert"]},
      {name:"Web development",title:"Fast, reliable websites built to last",desc:"Hand-built, high-performance websites that load fast, work on every device and are easy to grow with your business.",points:["Clean, custom code","Fast loading speeds","Works on every device","Easy to scale and update"]},
      {name:"Online stores",title:"Sell online with confidence",desc:"Complete online shops with product pages, secure checkout and everything you need to start selling and taking orders.",points:["Product catalog and pages","Secure online payments","Orders and delivery setup","Easy to manage yourself"]},
      {name:"Branding & identity",title:"A brand people remember",desc:"Logos, colors and a visual style that make your business look professional and stand out from the competition.",points:["Logo and visual identity","Brand colors and fonts","A consistent look everywhere","Reusable brand guidelines"]},
      {name:"SEO & optimization",title:"Get found on Google",desc:"We set up your website so search engines and customers can find you, and so every page loads fast and ranks well.",points:["On-page SEO setup","Fast loading and Core Web Vitals","Google-friendly structure","Local search optimization"]},
      {name:"Landing pages",title:"Pages built to convert",desc:"Focused, single-goal pages for a campaign, product or offer, designed to turn clicks into calls and requests.",points:["One clear goal","Fast to launch","Built for ad campaigns","Clear call to action"]},
      {name:"Maintenance & support",title:"We keep your site running",desc:"Ongoing updates, backups and support so your website stays fast, secure and always online.",points:["Updates and backups","Security monitoring","Content changes","Fast support when you need it"]},
      {name:"Hosting & setup",title:"Everything ready to go live",desc:"We handle domain, hosting and email setup, so your website goes live smoothly without the technical headaches.",points:["Domain and hosting setup","Business email","SSL and security","We handle the technical side"]}
    ],
    ru:[
      {name:"Веб-дизайн",title:"Дизайн, который превращает посетителей в клиентов",desc:"Чистые современные интерфейсы вокруг вашего бренда — каждая страница вызывает доверие и подталкивает к действию.",points:["Индивидуальный UI/UX дизайн","Дизайн mobile-first","Цвета и стиль вашего бренда","Создано для конверсии"]},
      {name:"Веб-разработка",title:"Быстрые и надёжные сайты надолго",desc:"Высокопроизводительные сайты, которые быстро загружаются, работают на любом устройстве и легко растут вместе с бизнесом.",points:["Чистый индивидуальный код","Быстрая загрузка","Работает на любом устройстве","Легко масштабировать и обновлять"]},
      {name:"Интернет-магазины",title:"Продавайте онлайн уверенно",desc:"Полноценные магазины с карточками товаров, безопасной оплатой и всем, что нужно для приёма заказов.",points:["Каталог и карточки товаров","Безопасная онлайн-оплата","Заказы и доставка","Простое самостоятельное управление"]},
      {name:"Брендинг и айдентика",title:"Бренд, который запоминают",desc:"Логотип, цвета и визуальный стиль, которые делают бизнес профессиональным и выделяют среди конкурентов.",points:["Логотип и айдентика","Цвета и шрифты бренда","Единый вид везде","Гайдлайны для повторного использования"]},
      {name:"SEO и оптимизация",title:"Чтобы вас находили в Google",desc:"Настраиваем сайт так, чтобы поисковики и клиенты вас находили, а страницы загружались быстро и хорошо ранжировались.",points:["Настройка on-page SEO","Быстрая загрузка и Core Web Vitals","Структура, дружелюбная к Google","Локальная поисковая оптимизация"]},
      {name:"Лендинги",title:"Страницы, созданные для конверсии",desc:"Сфокусированные страницы под кампанию, продукт или предложение — превращают клики в звонки и заявки.",points:["Одна чёткая цель","Быстрый запуск","Под рекламные кампании","Чёткий призыв к действию"]},
      {name:"Поддержка и обслуживание",title:"Держим ваш сайт в рабочем состоянии",desc:"Регулярные обновления, резервные копии и поддержка, чтобы сайт был быстрым, безопасным и всегда онлайн.",points:["Обновления и бэкапы","Мониторинг безопасности","Изменения контента","Быстрая поддержка"]},
      {name:"Хостинг и настройка",title:"Всё готово к запуску",desc:"Берём на себя домен, хостинг и почту, чтобы сайт запустился гладко без технических сложностей.",points:["Настройка домена и хостинга","Бизнес-почта","SSL и безопасность","Техническую часть берём на себя"]}
    ],
    ka:[
      {name:"ვებ-დიზაინი",title:"დიზაინი, რომელიც ვიზიტორს მომხმარებლად აქცევს",desc:"სუფთა, თანამედროვე ინტერფეისები თქვენი ბრენდის გარშემო — ყოველი გვერდი იწვევს ნდობას და ხალხს მოქმედებისკენ უბიძგებს.",points:["ინდივიდუალური UI/UX დიზაინი","მობილურზე მორგებული განლაგება","თქვენი ბრენდის ფერები და სტილი","შექმნილია კონვერსიისთვის"]},
      {name:"ვებ-დეველოპმენტი",title:"სწრაფი, საიმედო საიტები, რომ დიდხანს იმუშაოს",desc:"ხელით აგებული, მაღალი წარმადობის საიტები, რომლებიც სწრაფად იტვირთება და მარტივად იზრდება თქვენს ბიზნესთან ერთად.",points:["სუფთა, ინდივიდუალური კოდი","სწრაფი ჩატვირთვა","მუშაობს ყველა მოწყობილობაზე","მარტივი მასშტაბირება და განახლება"]},
      {name:"ონლაინ მაღაზიები",title:"იყიდე ონლაინ თავდაჯერებულად",desc:"სრული ონლაინ მაღაზიები პროდუქტის გვერდებით, უსაფრთხო გადახდით და ყველაფრით, რაც გაყიდვის დასაწყებადაა საჭირო.",points:["პროდუქტების კატალოგი და გვერდები","უსაფრთხო ონლაინ გადახდები","შეკვეთებისა და მიწოდების მართვა","მარტივი თვითმართვა"]},
      {name:"ბრენდინგი და იდენტობა",title:"ბრენდი, რომელიც ახსოვთ",desc:"ლოგო, ფერები და ვიზუალური სტილი, რომელიც თქვენს ბიზნესს პროფესიონალურ იერს აძლევს და გამოარჩევს.",points:["ლოგო და ვიზუალური იდენტობა","ბრენდის ფერები და შრიფტები","ერთიანი იერსახე ყველგან","მრავალჯერადი სახელმძღვანელო"]},
      {name:"SEO და ოპტიმიზაცია",title:"გიპოვონ Google-ში",desc:"ვამზადებთ საიტს ისე, რომ საძიებო სისტემებმა და კლიენტებმა გიპოვონ — და ყოველი გვერდი სწრაფად იტვირთოს.",points:["On-page SEO მომზადება","სწრაფი ჩატვირთვა და Core Web Vitals","Google-ისთვის მოსახერხებელი სტრუქტურა","ლოკალური ძიების ოპტიმიზაცია"]},
      {name:"სადესანტო გვერდები",title:"გვერდები, შექმნილი კონვერსიისთვის",desc:"ფოკუსირებული, ერთი მიზნის მქონე გვერდები კამპანიის, პროდუქტის ან შეთავაზებისთვის — ქცევა ზარებად და შეკვეთებად.",points:["ერთი მკაფიო მიზანი","სწრაფი გაშვება","შექმნილია სარეკლამო კამპანიებისთვის","მკაფიო მოწოდება"]},
      {name:"მხარდაჭერა და მოვლა",title:"ჩვენ ვუვლით თქვენს საიტს",desc:"მუდმივი განახლებები, სარეზერვო ასლები და მხარდაჭერა, რომ საიტი დარჩეს სწრაფი, უსაფრთხო და ყოველთვის ხელმისაწვდომი.",points:["განახლებები და სარეზერვო ასლები","უსაფრთხოების მონიტორინგი","კონტენტის ცვლილებები","სწრაფი მხარდაჭერა"]},
      {name:"ჰოსტინგი და გამართვა",title:"ყველაფერი მზადაა გასაშვებად",desc:"ჩვენ ვაგვარებთ დომენს, ჰოსტინგსა და ელფოსტას, რომ საიტი შეუფერხებლად ამუშავდეს ტექნიკური თავის ტკივილის გარეშე.",points:["დომენისა და ჰოსტინგის გამართვა","ბიზნეს-ელფოსტა","SSL და უსაფრთხოება","ტექნიკურ მხარეს ჩვენ ვუვლით"]}
    ]
  };
  /* BW-CONTENT-MERGE: texts saved from the admin panel override the built-ins */
  ;(function(){
    var C = window.BW_CONTENT; if(!C) return;
    ["en","ru","ka"].forEach(function(l){
      if(C.service_i18n && C.service_i18n[l]) Object.assign(I18N[l] || (I18N[l]={}), C.service_i18n[l]);
      if(C.services && C.services[l]) SERVICES[l] = C.services[l];
    });
  })();

  /* ---------- SERVICES — CHANGE IMAGES HERE ----------
     Easiest way: overwrite the files in images/services/ with your own
     (keep the same names). Any size works — each fills a wide banner.
     The order matches the services on the page: */
  var SVC_IMAGES = [
    "images/services/service-1.png",   // 1 — Web design
    "images/services/service-2.png",   // 2 — Web development
    "images/services/service-3.png",   // 3 — Online stores
    "images/services/service-4.png",   // 4 — Branding & identity
    "images/services/service-5.png",   // 5 — SEO & optimization
    "images/services/service-6.png",   // 6 — Landing pages
    "images/services/service-7.png",   // 7 — Maintenance & support
    "images/services/service-8.png"    // 8 — Hosting & setup
  ];
  function esc(s){ return String(s).replace(/[&<>"'/]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;","/":"&#47;"}[c]; }); }

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
      trigger.addEventListener("click", function(e){
        e.stopPropagation();
        var open = langBox.classList.toggle("open");
        trigger.setAttribute("aria-expanded", String(open));
      });
    }
    document.addEventListener("click", function(){ langBox.classList.remove("open"); if(trigger) trigger.setAttribute("aria-expanded","false"); });
  }

  /* ---------- language ---------- */
  function setLang(lang){
    if(lang !== "ka" && lang !== "en" && lang !== "ru") lang = "ka";
    var dict = I18N[lang] || I18N.en;
    root.setAttribute("lang", lang);
    document.querySelectorAll("[data-i18n]").forEach(function(el){
      var k = el.getAttribute("data-i18n");
      if(dict[k] != null) el.textContent = dict[k];
    });
    document.querySelectorAll(".lang-code").forEach(function(el){ el.textContent = CODE[lang]; });
    document.querySelectorAll("[data-set-lang]").forEach(function(b){ b.classList.toggle("active", b.getAttribute("data-set-lang") === lang); });
    try{ localStorage.setItem("bw-lang", lang); }catch(e){}
    renderServices(lang);
  }
  document.querySelectorAll("[data-set-lang]").forEach(function(b){
    b.addEventListener("click", function(e){
      e.stopPropagation();
      setLang(b.getAttribute("data-set-lang"));
      if(langBox) langBox.classList.remove("open");
    });
  });

  /* ---------- render (all sections + sidebar) ---------- */
  var sideEl = document.getElementById("svcSide");
  var secsEl = document.getElementById("svcSections");
  var spyObs = null;

  function renderServices(lang){
    if(!sideEl || !secsEl) return;
    var list = SERVICES[lang] || SERVICES.en;
    var ctaTxt = (I18N[lang] || I18N.en).svc_cta;

    sideEl.innerHTML = list.map(function(s,i){
      return '<a class="svc-sidelink'+(i===0?" is-active":"")+'" href="#svc-'+i+'" data-svc="'+i+'"><span class="svc-sideic">'+SVC_ICONS[i]+'</span><span>'+esc(s.name)+'</span></a>';
    }).join("");

    secsEl.innerHTML = list.map(function(s,i){
      /* srcset = sharp images on phones. Each slot has 3 files: service-N-640.png,
         service-N-1024.png and service-N.png. Replacing an image? Either replace all
         three sizes, or just delete the -640 / -1024 copies — the site automatically
         falls back to your single service-N.png. */
      var base = SVC_IMAGES[i] || SVC_IMAGES[0];
      var stem = base.replace(/\.png$/, "");
      var media = '<div class="svc-sec-media"><img class="svc-shot" src="'+base+'"'
        + ' srcset="'+stem+'-640.png 640w, '+stem+'-1024.png 1024w, '+base+' 1600w"'
        + ' sizes="(max-width:640px) 64vw, (max-width:900px) 68vw, 888px"'
        + ' onerror="this.onerror=null;this.removeAttribute(\'srcset\');this.removeAttribute(\'sizes\');this.src=\''+base+'\'"'
        + ' alt="'+esc(s.name)+'" loading="lazy"></div>';
      var text = '<div class="svc-sec-text">'
        + '<div class="svc-sec-ic">'+SVC_ICONS[i]+'</div>'
        + '<h2 class="svc-sec-title">'+esc(s.title)+'</h2>'
        + '<p class="svc-sec-desc">'+esc(s.desc)+'</p>'
        + '<ul class="svc-sec-points">'
          + s.points.map(function(pt){ return '<li><span class="bw-chip-check"><span class="bw-check"></span></span><span>'+esc(pt)+'</span></li>'; }).join("")
        + '</ul>'
        + '<a class="bw-btn bw-btn-primary svc-cta" href="/#order"><span>'+esc(ctaTxt)+'</span></a>'
        + '</div>';
      return '<section class="svc-sec" id="svc-'+i+'">'+media+text+'</section>';
    }).join("");

    sideEl.querySelectorAll("[data-svc]").forEach(function(a){
      a.addEventListener("click", function(){ setActive(parseInt(a.getAttribute("data-svc"),10) || 0); });
    });
    setupSpy();
  }
  function setActive(i){
    if(!sideEl) return;
    sideEl.querySelectorAll(".svc-sidelink").forEach(function(a,j){ a.classList.toggle("is-active", j === i); });
  }
  function setupSpy(){
    if(spyObs) spyObs.disconnect();
    if(!("IntersectionObserver" in window)) return;
    spyObs = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){
          var i = parseInt(en.target.id.replace("svc-",""),10) || 0;
          setActive(i);
        }
      });
    }, { rootMargin:"-45% 0px -50% 0px", threshold:0 });
    secsEl.querySelectorAll(".svc-sec").forEach(function(sec){ spyObs.observe(sec); });
  }

  /* ---------- init ---------- */
  (function(){
    var t; try{ t = localStorage.getItem("bw-theme"); }catch(e){}
    if(!t) t = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    applyTheme(t);
    var l; try{ l = localStorage.getItem("bw-lang"); }catch(e){}
    setLang(l || "ka");
  })();
})();
