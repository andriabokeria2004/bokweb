(function(){
  "use strict";
  const root = document.documentElement;

  /* ---------- Translations ---------- */
  const I18N = {
    en:{
      nav_home:"Home", nav_why:"Why BokWeb", nav_team:"Team", nav_work:"Work",
      nav_portfolio:"Portfolio", nav_contact:"Contact", nav_order:"Order",
      nav_about:"About", nav_more:"More",
      team_meet:"Meet the Team", team_lead:"Leadership", team_careers:"Careers", team_life:"Life at BokWeb",
      work_design:"Web Design", work_design_d:"Interfaces that convert",
      work_dev:"Web Development", work_dev_d:"Fast, scalable builds",
      work_brand:"Branding", work_brand_d:"Identity & strategy",
      work_ecom:"E-Commerce", work_ecom_d:"Stores that sell",
      work_all:"See all work", lang_label:"Language",
      svc_all:"See all services",
      svc0_t:"Web design", svc0_d:"Interfaces that convert",
      svc1_t:"Web development", svc1_d:"Fast, scalable builds",
      svc2_t:"Online stores", svc2_d:"Stores that sell",
      svc3_t:"Branding & identity", svc3_d:"Identity & strategy",
      svc4_t:"SEO & optimization", svc4_d:"Get found on Google",
      svc5_t:"Landing pages", svc5_d:"Built to convert",
      svc6_t:"Maintenance & support", svc6_d:"We keep it running",
      svc7_t:"Hosting & setup", svc7_d:"Ready to go live",
      hero_eyebrow:"Websites for growing businesses",
      hero_title:"A website that brings you new clients",
      hero_sub:"We build clean, trustworthy websites where people find what you offer, see your products and prices, and get in touch in one click.",
      hero_cta1:"Order website", hero_cta2:"See our work",
      hero_note:"Get in touch by email or phone and let's work together with the BokWeb team.",
      hero_contact:"Contact us", hero_reqfrom:"Anna · just now", hero_newreq:"New request",
      hero_ch_quick:"Quick contact", hero_ch_clients:"More clients",
      hero_ch_products:"Products and prices", hero_ch_browse:"Easy to browse", hero_ch_first:"First impression",
      hero_loading:"Preparing",
      why_eyebrow:"Why BokWeb",
      why_title:"Everything your business needs to be chosen online",
      why_sub:"No complicated words. Just a website that looks professional, is easy to use, and quietly brings you new clients.",
      why_c1_t:"First impression", why_c1_b:"A clean, modern look that makes people trust your business from the very first second.",
      why_c2_t:"Easy to browse", why_c2_b:"Clear, simple pages so any customer can find what they need in just a few taps.",
      why_c3_t:"Products and prices", why_c3_b:"Show what you offer with photos and prices, so people decide faster and with confidence.",
      why_c4_t:"Quick contact", why_c4_b:"Call, message or send a request in one tap. Reaching you is effortless.",
      why_c5_t:"More clients", why_c5_b:"Your website works day and night, turning visitors into real client requests.",
      why_c6_t:"Looks great everywhere", why_c6_b:"Perfect on phone, tablet and computer, so no customer is ever left out.",
      why_cta:"Ready to be chosen more often?", why_note:"Free consultation. We reply the same day.",
      ob_err:"Could not send — please check the connection and try again.",
      rv_write:"Write a review", rv_title:"Your review", rv_name:"Your name",
      rv_text:"Your comment", rv_text_p:"How was working with us?",
      rv_rating:"Rating (1–10)", rv_send:"Send review",
      rv_done_t:"Thank you!", rv_done_x:"Your review will appear once we approve it.",
      rv_done_live:"Your review is now published below!",
      ob_back:"Back", ob_title:"Start your website",
      ob_sub:"Tell us a little about your business. We reply the same day. No obligations.",
      ob_name:"Your name", ob_name_p:"e.g. Anna",
      ob_biz:"Business name", ob_biz_p:"e.g. Anna Flowers",
      ob_contact:"Phone or email", ob_contact_p:"How can we reach you?",
      ob_msg:"What do you need?", ob_msg_p:"A shop, a booking page, a fresh look…",
      ob_send:"Send request", ob_sent_title:"Request received",
      ob_sent_text:"Thank you. Our team will contact you shortly to plan your website.",
      nav_features:"Features", nav_testimonials:"Reviews", nav_prices:"Prices", swipe_hint:"Swipe",
      pf_eyebrow:"Portfolio", pf_title:"Websites that work for their owners",
      pf_sub:"A few businesses we helped get chosen online. Real sites, real client requests.",
      pf_drop:"Drop a screenshot", pf_videodrop:"Add your showreel video",
      feat_eyebrow:"How we work", feat_title:"A website built around your customer",
      feat_sub:"Every step is designed to turn a visitor into a request.",
      f1_t:"Show what you sell", f1_d:"Clear pages with your products, photos and prices, so people understand your offer in seconds.",
      f2_t:"Make contact effortless", f2_d:"A visible button on every page. Call, message or send a request in one tap, from any device.",
      f3_t:"Turn visits into requests", f3_d:"When someone reaches out you get a clean notification, so no client is ever missed.",
      ts_quote:"BokWeb built us a website that actually brings calls. We look professional and clients find us easily.",
      ts_author:"Nino Beridze", ts_role:"Owner, Anna Flowers",
      foot_tag:"Websites that bring local businesses new clients.",
      foot_cta:"Tips for your website", foot_sub:"One short email a month. No spam, unsubscribe anytime.",
      foot_ph:"Your email", foot_btn:"Subscribe", foot_thanks:"Thanks, you are subscribed.",
      foot_rights:"All rights reserved.",
      svc_eyebrow:"Services", svc_title:"Everything your business needs online",
      svc_sub:"From the first design to launch and support — the full set of services a growing business needs to get chosen online."
    },
    ru:{
      nav_home:"Главная", nav_why:"Почему BokWeb", nav_team:"Команда", nav_work:"Работы",
      nav_portfolio:"Портфолио", nav_contact:"Контакты", nav_order:"Заказать",
      nav_about:"О нас", nav_more:"Ещё",
      team_meet:"Наша команда", team_lead:"Руководство", team_careers:"Вакансии", team_life:"Жизнь в BokWeb",
      work_design:"Веб-дизайн", work_design_d:"Интерфейсы, которые продают",
      work_dev:"Веб-разработка", work_dev_d:"Быстро и масштабируемо",
      work_brand:"Брендинг", work_brand_d:"Айдентика и стратегия",
      work_ecom:"Интернет-магазины", work_ecom_d:"Магазины, которые продают",
      work_all:"Все работы", lang_label:"Язык",
      svc_all:"Все услуги",
      svc0_t:"Веб-дизайн", svc0_d:"Интерфейсы, что конвертируют",
      svc1_t:"Веб-разработка", svc1_d:"Быстро и масштабируемо",
      svc2_t:"Интернет-магазины", svc2_d:"Магазины, что продают",
      svc3_t:"Брендинг и айдентика", svc3_d:"Айдентика и стратегия",
      svc4_t:"SEO и оптимизация", svc4_d:"Чтобы вас находили",
      svc5_t:"Лендинги", svc5_d:"Созданы для конверсии",
      svc6_t:"Поддержка и обслуживание", svc6_d:"Держим сайт в строю",
      svc7_t:"Хостинг и настройка", svc7_d:"Готово к запуску",
      hero_eyebrow:"Сайты для растущего бизнеса",
      hero_title:"Сайт, который приводит новых клиентов",
      hero_sub:"Мы делаем аккуратные, вызывающие доверие сайты: люди находят то, что вы предлагаете, видят товары и цены — и связываются с вами в один клик.",
      hero_cta1:"Заказать сайт", hero_cta2:"Наши работы",
      hero_note:"Бесплатная консультация · без обязательств",
      hero_contact:"Связаться", hero_reqfrom:"Анна · только что", hero_newreq:"Новая заявка",
      hero_ch_quick:"Быстрая связь", hero_ch_clients:"Больше клиентов",
      hero_ch_products:"Товары и цены", hero_ch_browse:"Удобно смотреть", hero_ch_first:"Первое впечатление",
      hero_loading:"Готовим",
      why_eyebrow:"Почему BokWeb",
      why_title:"Всё, что нужно бизнесу, чтобы его выбирали",
      why_sub:"Без сложных слов. Просто сайт, который выглядит профессионально, удобен в использовании и спокойно приводит вам новых клиентов.",
      why_c1_t:"Первое впечатление", why_c1_b:"Аккуратный современный вид, который вызывает доверие с первой секунды.",
      why_c2_t:"Удобно смотреть", why_c2_b:"Понятные, простые страницы: любой клиент найдёт нужное за пару касаний.",
      why_c3_t:"Товары и цены", why_c3_b:"Показывайте предложения с фото и ценами. Люди решают быстрее и увереннее.",
      why_c4_t:"Быстрая связь", why_c4_b:"Звонок, сообщение или заявка в одно касание. С вами легко связаться.",
      why_c5_t:"Больше клиентов", why_c5_b:"Сайт работает днём и ночью, превращая посетителей в реальные заявки.",
      why_c6_t:"Отлично на любом экране", why_c6_b:"Идеально на телефоне, планшете и компьютере. Ни один клиент не потеряется.",
      why_cta:"Готовы, чтобы вас выбирали чаще?", why_note:"Бесплатная консультация. Отвечаем в тот же день.",
      ob_err:"Не удалось отправить — проверьте соединение и попробуйте ещё раз.",
      rv_write:"Оставить отзыв", rv_title:"Ваш отзыв", rv_name:"Ваше имя",
      rv_text:"Ваш комментарий", rv_text_p:"Как вам работа с нами?",
      rv_rating:"Оценка (1–10)", rv_send:"Отправить отзыв",
      rv_done_t:"Спасибо!", rv_done_x:"Ваш отзыв появится после подтверждения.",
      rv_done_live:"Ваш отзыв уже опубликован ниже!",
      ob_back:"Назад", ob_title:"Начнём ваш сайт",
      ob_sub:"Расскажите немного о вашем бизнесе. Отвечаем в тот же день. Без обязательств.",
      ob_name:"Ваше имя", ob_name_p:"например, Анна",
      ob_biz:"Название бизнеса", ob_biz_p:"например, Anna Flowers",
      ob_contact:"Телефон или email", ob_contact_p:"Как с вами связаться?",
      ob_msg:"Что вам нужно?", ob_msg_p:"Магазин, страница записи, новый вид…",
      ob_send:"Отправить заявку", ob_sent_title:"Заявка получена",
      ob_sent_text:"Спасибо! Наша команда свяжется с вами в ближайшее время, чтобы спланировать сайт.",
      nav_features:"Возможности", nav_testimonials:"Отзывы", nav_prices:"Цены", swipe_hint:"Листайте",
      pf_eyebrow:"Портфолио", pf_title:"Сайты, которые работают на владельцев",
      pf_sub:"Несколько бизнесов, которым мы помогли. Настоящие сайты и настоящие заявки.",
      pf_drop:"Перетащите скриншот", pf_videodrop:"Добавьте видео",
      feat_eyebrow:"Как мы работаем", feat_title:"Сайт, построенный вокруг вашего клиента",
      feat_sub:"Каждый шаг ведёт посетителя к заявке.",
      f1_t:"Покажите, что продаёте", f1_d:"Понятные страницы с товарами, фото и ценами, чтобы люди понимали предложение за секунды.",
      f2_t:"Сделайте связь простой", f2_d:"Заметная кнопка на каждой странице. Звонок, сообщение или заявка в одно касание, с любого устройства.",
      f3_t:"Превращайте визиты в заявки", f3_d:"Когда к вам обращаются, вы получаете аккуратное уведомление, и ни один клиент не теряется.",
      ts_quote:"BokWeb сделали сайт, который реально приносит звонки. Мы выглядим профессионально, и клиенты легко нас находят.",
      ts_author:"Нино Беридзе", ts_role:"Владелица, Anna Flowers",
      foot_tag:"Сайты, которые приводят местному бизнесу новых клиентов.",
      foot_cta:"Советы для вашего сайта", foot_sub:"Одно короткое письмо в месяц. Без спама, отписка в любой момент.",
      foot_ph:"Ваш email", foot_btn:"Подписаться", foot_thanks:"Спасибо, вы подписаны.",
      foot_rights:"Все права защищены.",
      svc_eyebrow:"Услуги", svc_title:"Всё, что нужно вашему бизнесу онлайн",
      svc_sub:"От первого дизайна до запуска и поддержки — полный набор услуг, который нужен растущему бизнесу, чтобы его выбирали онлайн."
    },
    ka:{
      nav_home:"მთავარი", nav_why:"რატომ BokWeb", nav_team:"გუნდი", nav_work:"ნამუშევრები",
      nav_portfolio:"პორტფოლიო", nav_contact:"კონტაქტი", nav_order:"შეკვეთა",
      nav_about:"ჩვენ შესახებ", nav_more:"მეტი",
      team_meet:"გაიცანით გუნდი", team_lead:"ხელმძღვანელობა", team_careers:"ვაკანსიები", team_life:"ცხოვრება BokWeb-ში",
      work_design:"ვებ-დიზაინი", work_design_d:"ინტერფეისები, რომლებიც ყიდის",
      work_dev:"ვებ-დეველოპმენტი", work_dev_d:"სწრაფი და მასშტაბირებადი",
      work_brand:"ბრენდინგი", work_brand_d:"იდენტობა და სტრატეგია",
      work_ecom:"ელ-კომერცია", work_ecom_d:"მაღაზიები, რომლებიც ყიდის",
      work_all:"ყველა ნამუშევარი", lang_label:"ენა",
      svc_all:"ყველა სერვისი",
      svc0_t:"ვებ-დიზაინი", svc0_d:"ინტერფეისი, რომელიც ქცევას იწვევს",
      svc1_t:"ვებ-დეველოპმენტი", svc1_d:"სწრაფი და მასშტაბირებადი",
      svc2_t:"ონლაინ მაღაზიები", svc2_d:"მაღაზიები, რომ გაყიდოს",
      svc3_t:"ბრენდინგი და იდენტობა", svc3_d:"იდენტობა და სტრატეგია",
      svc4_t:"SEO და ოპტიმიზაცია", svc4_d:"გიპოვონ Google-ში",
      svc5_t:"სადესანტო გვერდები", svc5_d:"შექმნილია კონვერსიისთვის",
      svc6_t:"მხარდაჭერა და მოვლა", svc6_d:"საიტს ჩვენ ვუვლით",
      svc7_t:"ჰოსტინგი და გამართვა", svc7_d:"მზადაა გასაშვებად",
      hero_eyebrow:"ვებგვერდები მზარდი ბიზნესისთვის",
      hero_title:"საიტი, რომელიც მოგიყვანს ახალ კლიენტს!",
      hero_sub:"ვებსაიტი, რომელიც შენს ბიზნესს პროფესიონალურად აჩვენებს და ახალ კლიენტებს მოიზიდავს.",
      hero_cta1:"შეუკვეთე საიტი", hero_cta2:"ჩვენი ნამუშევრები",
      hero_note:"დაგვიკავშირდით მეილზე ან ტელეფონზე და ითანამშრომლეთ BokWeb-ის გუნდთან.",
      hero_contact:"დაკავშირება", hero_reqfrom:"ნინო · ახლახან", hero_newreq:"ახალი შეკვეთა",
      hero_ch_quick:"სწრაფი კავშირი", hero_ch_clients:"მეტი კლიენტი",
      hero_ch_products:"პროდუქტები და ფასები", hero_ch_browse:"მარტივი დათვალიერება", hero_ch_first:"პირველი შთაბეჭდილება",
      hero_loading:"ვამზადებთ",
      why_eyebrow:"რატომ BokWEB ?",
      why_title:"ყველაფერი, რაც ბიზნესს სჭირდება, რომ აირჩიონ",
      why_sub:"რთული სიტყვების გარეშე. უბრალოდ საიტი, რომელიც პროფესიონალურად გამოიყურება, მარტივი გამოსაყენებელია და მშვიდად მოგიყვანთ ახალ კლიენტებს.",
      why_c1_t:"პირველი შთაბეჭდილება", why_c1_b:"სუფთა, თანამედროვე იერსახე, რომელიც პირველივე წამიდან ნდობას იწვევს.",
      why_c2_t:"მარტივი დათვალიერება", why_c2_b:"გასაგები, მარტივი გვერდები. ნებისმიერი კლიენტი საჭიროს რამდენიმე შეხებით იპოვის.",
      why_c3_t:"პროდუქტები და ფასები", why_c3_b:"აჩვენეთ შემოთავაზება ფოტოებითა და ფასებით. ადამიანები უფრო სწრაფად და დარწმუნებით წყვეტენ.",
      why_c4_t:"სწრაფი კავშირი", why_c4_b:"ზარი, შეტყობინება ან შეკვეთა ერთი შეხებით. თქვენთან დაკავშირება მარტივია.",
      why_c5_t:"მეტი კლიენტი", why_c5_b:"საიტი მუშაობს დღე და ღამე და სტუმრებს რეალურ შეკვეთებად აქცევს.",
      why_c6_t:"მშვენივრად ჩანს ყველგან", why_c6_b:"იდეალურია ტელეფონზე, ტაბლეტსა და კომპიუტერზე. ვერცერთი კლიენტი ვერ დაიკარგება.",
      why_cta:"მზად ხართ, უფრო ხშირად აგირჩიონ?", why_note:"უფასო კონსულტაცია. ვპასუხობთ იმავე დღეს.",
      ob_err:"ვერ გაიგზავნა — შეამოწმეთ კავშირი და სცადეთ თავიდან.",
      rv_write:"დაწერეთ შეფასება", rv_title:"თქვენი შეფასება", rv_name:"თქვენი სახელი",
      rv_text:"თქვენი კომენტარი", rv_text_p:"როგორი იყო ჩვენთან მუშაობა?",
      rv_rating:"შეფასება (1–10)", rv_send:"შეფასების გაგზავნა",
      rv_done_t:"მადლობა!", rv_done_x:"თქვენი შეფასება გამოჩნდება დადასტურების შემდეგ.",
      rv_done_live:"თქვენი შეფასება უკვე გამოქვეყნებულია ქვემოთ!",
      ob_back:"უკან", ob_title:"დავიწყოთ თქვენი საიტი",
      ob_sub:"მოგვიყევით ცოტა თქვენს ბიზნესზე. ვპასუხობთ იმავე დღეს. ვალდებულების გარეშე.",
      ob_name:"თქვენი სახელი", ob_name_p:"მაგ. ნინო",
      ob_biz:"ბიზნესის სახელი", ob_biz_p:"მაგ. Anna Flowers",
      ob_contact:"ტელეფონი ან email", ob_contact_p:"როგორ დაგიკავშირდეთ?",
      ob_msg:"რა გჭირდებათ?", ob_msg_p:"მაღაზია, ჩაწერის გვერდი, ახალი იერსახე…",
      ob_send:"გაგზავნა", ob_sent_title:"შეკვეთა მიღებულია",
      ob_sent_text:"გმადლობთ! ჩვენი გუნდი მალე დაგიკავშირდებათ საიტის დასაგეგმად.",
      nav_features:"სერვისები", nav_testimonials:"შეფასებები", nav_prices:"ფასები", swipe_hint:"გადაფურცლეთ",
      pf_eyebrow:"ნამუშევრები", pf_title:"საიტები, რომლებიც მუშაობს მფლობელებისთვის",
      pf_sub:"რამდენიმე ბიზნესი, რომელსაც დავეხმარეთ. რეალური საიტები და რეალური შეკვეთები.",
      pf_drop:"ჩააგდეთ სქრინშოტი", pf_videodrop:"დაამატეთ ვიდეო",
      feat_eyebrow:"როგორ ვმუშაობთ", feat_title:"საიტი, აგებული თქვენი კლიენტის გარშემო",
      feat_sub:"ყოველი ნაბიჯი შექმნილია იმისთვის, რომ ვიზიტორი შეკვეთად აქციოს.",
      f1_t:"აჩვენეთ, რას ყიდით", f1_d:"გასაგები გვერდები პროდუქტებით, ფოტოებითა და ფასებით, რომ ხალხი წამებში მიხვდეს თქვენს შეთავაზებას.",
      f2_t:"გააადვილეთ კავშირი", f2_d:"ხილული ღილაკი ყველა გვერდზე. ზარი, შეტყობინება ან შეკვეთა ერთი შეხებით, ნებისმიერი მოწყობილობიდან.",
      f3_t:"აქციეთ ვიზიტები შეკვეთებად", f3_d:"როცა ვინმე დაგიკავშირდებათ, იღებთ სუფთა შეტყობინებას და ვერცერთი კლიენტი ვერ იკარგება.",
      ts_quote:"BokWeb-მა შეგვიქმნა საიტი, რომელსაც რეალურად მოაქვს ზარები. პროფესიონალურად გამოვიყურებით და კლიენტები მარტივად გვპოულობენ.",
      ts_author:"ნინო ბერიძე", ts_role:"მფლობელი, Anna Flowers",
      foot_tag:"საიტები, რომლებიც ადგილობრივ ბიზნესს ახალ კლიენტებს მოაქვს.",
      foot_cta:"რჩევები თქვენი საიტისთვის", foot_sub:"თვეში ერთი მოკლე წერილი. სპამის გარეშე, გამოწერის გაუქმება ნებისმიერ დროს.",
      foot_ph:"თქვენი email", foot_btn:"გამოწერა", foot_thanks:"გმადლობთ, გამოწერილია.",
      foot_rights:"ყველა უფლება დაცულია.",
      svc_eyebrow:"სერვისები", svc_title:"ყველაფერი, რაც ბიზნესს ონლაინ სჭირდება",
      svc_sub:"პირველი დიზაინიდან გაშვებამდე და მხარდაჭერამდე — სერვისების სრული ნაკრები, რომელიც მზარდ ბიზნესს სჭირდება, რომ ონლაინ აირჩიონ."
    }
  };
  const CODE = {en:"EN", ru:"RU", ka:"KA"};

  function setLang(lang){
    const dict = I18N[lang]; if(!dict) return;
    root.setAttribute("lang", lang);
    try{ localStorage.setItem("bw-lang", lang); }catch(e){}
    document.querySelectorAll("[data-i18n]").forEach(function(el){
      const k = el.getAttribute("data-i18n");
      if(dict[k] != null) el.textContent = dict[k];
    });
    document.querySelectorAll("[data-i18n-ph]").forEach(function(el){
      const k = el.getAttribute("data-i18n-ph");
      if(dict[k] != null) el.setAttribute("placeholder", dict[k]);
    });
    document.querySelectorAll(".lang-code").forEach(function(el){ el.textContent = CODE[lang]; });
    document.querySelectorAll("[data-set-lang]").forEach(function(b){
      b.classList.toggle("active", b.getAttribute("data-set-lang") === lang);
    });
    if(typeof seedTravel === "function") seedTravel();
    if(typeof renderReviews === "function") renderReviews();
    if(typeof renderPortfolio === "function") renderPortfolio(lang);
    if(typeof renderFooterCols === "function") renderFooterCols(lang);
  }

  /* ---------- Dropdown controller (Team / Work / Language) ---------- */
  const drops = Array.from(document.querySelectorAll("[data-drop]"));
  const langBox = document.querySelector("[data-lang]");
  const allBoxes = drops.concat(langBox ? [langBox] : []);
  const finePointer = window.matchMedia("(pointer:fine)").matches;

  function closeAll(except){
    allBoxes.forEach(function(box){
      if(box === except) return;
      box.classList.remove("open");
      const t = box.querySelector("button"); if(t) t.setAttribute("aria-expanded","false");
    });
  }
  function toggle(box){
    const willOpen = !box.classList.contains("open");
    closeAll(willOpen ? box : null);
    box.classList.toggle("open", willOpen);
    const t = box.querySelector("button"); if(t) t.setAttribute("aria-expanded", String(willOpen));
  }

  allBoxes.forEach(function(box){
    const trigger = box.querySelector("button");
    trigger.addEventListener("click", function(e){ e.stopPropagation(); toggle(box); });

    // hover open on desktop pointer devices (nav dropdowns only)
    if(finePointer && box.hasAttribute("data-drop")){
      let timer;
      box.addEventListener("mouseenter", function(){
        clearTimeout(timer); closeAll(box);
        box.classList.add("open"); trigger.setAttribute("aria-expanded","true");
      });
      box.addEventListener("mouseleave", function(){
        timer = setTimeout(function(){
          box.classList.remove("open"); trigger.setAttribute("aria-expanded","false");
        }, 140);
      });
    }
  });

  // language selection
  document.querySelectorAll("[data-set-lang]").forEach(function(b){
    b.addEventListener("click", function(e){
      e.stopPropagation();
      var target = b.getAttribute("data-set-lang");
      var slug = (typeof window.BW_SLUG === "string") ? window.BW_SLUG
        : location.pathname.replace(/^\/(en|ru)(\/|$)/, "/").replace(/^\//, "").replace(/\.html$/i, "");
      var prefix = target === "ka" ? "" : "/" + target;
      var dest = prefix + "/" + slug;                 /* "/en/prices", "/ru/", "/prices" ... */
      try{ localStorage.setItem("bw-lang", target); }catch(err){}
      /* navigate to the language-specific URL so the address bar + Google reflect it */
      if(dest !== location.pathname){ location.href = dest; return; }
      setLang(target);
      closeAll(null);
    });
  });

  // outside click + Escape
  document.addEventListener("click", function(){ closeAll(null); });
  document.addEventListener("keydown", function(e){
    if(e.key === "Escape"){ closeAll(null); closeDrawer(); }
  });

  /* ---------- Theme ---------- */
  const themeBtn = document.getElementById("themeBtn");
  function applyTheme(mode){
    mode = (mode === "dark" || mode === "light") ? mode : "light";
    root.setAttribute("data-theme", mode);
    themeBtn.setAttribute("aria-pressed", String(mode === "dark"));
    try{ localStorage.setItem("bw-theme", mode); }catch(e){}
  }
  (function(){
    var saved; try{ saved = localStorage.getItem("bw-theme"); }catch(e){}
    if(saved !== "dark" && saved !== "light") saved = null;
    applyTheme(saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  })();
  themeBtn.addEventListener("click", function(){
    applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
  });

  /* ---------- Mobile drawer ---------- */
  const burger = document.getElementById("burger");
  const drawer = document.getElementById("drawer");
  const overlay = document.getElementById("overlay");
  const drawerClose = document.getElementById("drawerClose");

  function openDrawer(){
    drawer.classList.add("show"); overlay.classList.add("show");
    burger.setAttribute("aria-expanded","true"); document.body.style.overflow = "hidden";
  }
  function closeDrawer(){
    drawer.classList.remove("show"); overlay.classList.remove("show");
    burger.setAttribute("aria-expanded","false"); document.body.style.overflow = "";
  }
  burger.addEventListener("click", openDrawer);
  drawerClose.addEventListener("click", closeDrawer);
  overlay.addEventListener("click", closeDrawer);
  drawer.querySelectorAll(".m-link, .drawer .order-btn, .m-sub a").forEach(function(el){
    el.addEventListener("click", closeDrawer);
  });

  // drawer accordions
  document.querySelectorAll("[data-acc]").forEach(function(acc){
    acc.querySelector(".m-acc-btn").addEventListener("click", function(){
      const open = acc.classList.contains("open");
      document.querySelectorAll("[data-acc]").forEach(function(a){ a.classList.remove("open"); });
      acc.classList.toggle("open", !open);
    });
  });

  /* ---------- Header scroll border ---------- */
  const header = document.getElementById("header");
  const onScroll = function(){ header.classList.toggle("scrolled", window.scrollY > 4); };
  window.addEventListener("scroll", onScroll, {passive:true});
  onScroll();

  /* ---------- Hero: travelling visitor names ---------- */
  const NAMES = {
    en:["Anna","Luke","David","Maria","Nick","Elene","George","Nina","Emma","Alex","Sofia","Leo","Mia","Noah","Lena","Mark","Sara","Tom","Ana","Nino"],
    ru:["Анна","Лука","Давид","Мария","Ника","Елена","Георгий","Нина","Эмма","Алекс","София","Лев","Мия","Ной","Лена","Марк","Сара","Том","Кира","Нино"],
    ka:["ნინო","ანა","ლუკა","დათო","მარიამ","ნიკა","ელენე","გიორგი","თამარ","სალომე","დავითი","ლევანი","ნათია","ირაკლი","გვანცა","ბექა","საბა","ლიზა","ანი","თორნიკე","ნიკოლოზი","ვახო","ქეთი","სოფო","გია","ზურა","ხატია","თეა","მარი","ნინი"]
  };
  function pool(){ return NAMES[root.getAttribute("lang")] || NAMES.en; }
  const travelTags = Array.from(document.querySelectorAll("[data-travel]"));
  function seedTravel(){
    const p = pool().slice();
    for(let i=p.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); const t=p[i]; p[i]=p[j]; p[j]=t; }
    travelTags.forEach(function(el,i){ el.textContent = p[i % p.length]; });
  }
  travelTags.forEach(function(el){
    const host = el.closest(".bw-travel");
    if(!host) return;
    host.addEventListener("animationiteration", function(e){
      if(e.animationName && e.animationName.indexOf("bwTravel") === -1) return;
      const p = pool();
      let n = p[Math.floor(Math.random()*p.length)], g = 0;
      while(n === el.textContent && g++ < 8) n = p[Math.floor(Math.random()*p.length)];
      el.textContent = n;
    });
  });

  /* ---------- Order flow ---------- */
  const orderEl = document.getElementById("bwOrder");
  const orderForm = document.getElementById("bwOrderForm");
  const orderDone = document.getElementById("bwOrderDone");
  let orderTimers = [];
  function clearOrderTimers(){ orderTimers.forEach(clearTimeout); orderTimers = []; }

  function openOrder(){
    if(!orderEl) return;
    if(orderForm) orderForm.hidden = false;
    if(orderDone) orderDone.hidden = true;
    orderEl.hidden = false;
    orderEl.setAttribute("aria-hidden","false");
    document.body.style.overflow = "hidden";
    window.scrollTo(0,0);
    try{ orderEl.scrollTop = 0; }catch(e){}
  }
  function closeOrder(){
    if(!orderEl) return;
    clearOrderTimers();
    orderEl.hidden = true;
    orderEl.setAttribute("aria-hidden","true");
    document.body.style.overflow = "";
  }
  function runOrderIntro(btn){
    if(btn.classList.contains("is-loading")) return;
    const dict = I18N[root.getAttribute("lang")] || I18N.en;
    const label = btn.querySelector(".bw-cta-text");
    const spin  = btn.querySelector(".bw-spin");
    const word  = dict.hero_loading || "Preparing";
    clearOrderTimers();
    btn.classList.add("is-loading");
    if(spin) spin.hidden = false;
    if(label) label.textContent = word + " 1s";
    orderTimers.push(setTimeout(function(){ if(label) label.textContent = word + " 2s"; }, 1000));
    orderTimers.push(setTimeout(function(){ if(label) label.textContent = word + " 3s"; }, 2000));
    orderTimers.push(setTimeout(function(){
      btn.classList.remove("is-loading");
      if(spin) spin.hidden = true;
      if(label && dict.hero_cta1) label.textContent = dict.hero_cta1;
      openOrder();
    }, 3000));
  }
  document.querySelectorAll(".bw-order-open").forEach(function(b){
    b.addEventListener("click", function(){ runOrderIntro(b); });
  });
  const orderBack = document.getElementById("bwOrderBack");
  if(orderBack) orderBack.addEventListener("click", closeOrder);
  document.querySelectorAll(".bw-order-back2").forEach(function(b){ b.addEventListener("click", closeOrder); });
  const orderSend = document.getElementById("bwOrderSend");
  const orderErr = document.getElementById("bwOrderErr");
  function markField(id){
    var e = document.getElementById(id);
    if(e){ e.focus(); e.classList.add("bw-field-err"); }
    return e;
  }
  function clearFieldErr(id){
    var e = document.getElementById(id);
    if(e) e.classList.remove("bw-field-err");
  }
  ["bwOName","bwOContact","bwOMsg"].forEach(function(id){
    var e = document.getElementById(id);
    if(e) e.addEventListener("input", function(){ clearFieldErr(id); });
  });
  /* a "valid contact" is a phone number OR an email (never trust junk like "sadasd") */
  function looksLikeContact(v){
    var email = /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/.test(v);
    var digits = (v.match(/\d/g) || []).length;
    var phone = /^[+()\-\s\d]+$/.test(v) && digits >= 6;   /* at least 6 digits, only phone chars */
    return email || phone;
  }
  if(orderSend) orderSend.addEventListener("click", function(){
    if(orderSend.disabled) return;
    var v = function(id){ var e = document.getElementById(id); return e ? e.value.trim() : ""; };
    var payload = { name:v("bwOName"), biz:v("bwOBiz"), contact:v("bwOContact"),
                    msg:v("bwOMsg"), lang: root.getAttribute("lang") || "ka",
                    website: (document.querySelector("#bwOrderForm .bw-hp")||{}).value || "" };
    if(orderErr) orderErr.hidden = true;
    ["bwOName","bwOContact","bwOMsg"].forEach(clearFieldErr);

    /* validate each required field, highlighting the first problem */
    if(payload.name.length < 2){ markField("bwOName"); return; }
    if(!looksLikeContact(payload.contact)){ markField("bwOContact"); return; }
    if(payload.msg.length < 4){ markField("bwOMsg"); return; }

    orderSend.disabled = true;
    fetch("/api/orders", { method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify(payload) })
    .then(function(r){ if(!r.ok) throw 0; return r.json(); })
    .then(function(resp){
      if(resp && resp.ok === false) throw 0;
      if(orderForm) orderForm.hidden = true;
      if(orderDone) orderDone.hidden = false;
      try{ orderEl.scrollTop = 0; }catch(e){}
    })
    .catch(function(){ if(orderErr) orderErr.hidden = false; })
    .then(function(){ orderSend.disabled = false; });
  });
  document.addEventListener("keydown", function(e){
    if(e.key === "Escape" && orderEl && !orderEl.hidden) closeOrder();
  });

  /* ---------- Portfolio data + carousel ---------- */
  /* ⬇⬇⬇  PORTFOLIO — CHANGE IMAGES / VIDEO HERE  ⬇⬇⬇
     Easiest way: overwrite these files with your own (keep the same names):
       images/portfolio/video-1.mp4   → slide 1 (showreel video)
       images/portfolio/shot-1.png    → slide 2 (screenshot)
       images/portfolio/shot-2.png    → slide 3 (screenshot)
       images/portfolio/shot-3.png    → slide 4 (screenshot)
     Or edit the src paths below to point at any other file.
     A YouTube link also works for the video slide:
       src:"https://www.youtube.com/watch?v=XXXXXXXXXXX" */
  const PROJ = [
    { domain:"BokWeb",         kind:"video", accent:"var(--brand)", src:"images/portfolio/video-1.mp4" },
    { domain:"yourbusiness.ge", kind:"image", accent:"var(--brand)", src:"images/portfolio/shot-1.png" },
    { domain:"yourbusiness.ge", kind:"image", accent:"var(--ok)",    src:"images/portfolio/shot-2.png" },
    { domain:"yourbusiness.ge", kind:"image", accent:"var(--brand)", src:"images/portfolio/shot-3.png" }
  ];
  const PF_TEXT = {
    en:[
      {name:"BokWeb showreel",cat:"BokWeb studio",result:"See our work in motion",t1:"Video",t2:"2025"},
      {name:"Home page",cat:"Sample project",result:"A clean first screen that builds trust",t1:"Web design",t2:"Hero"},
      {name:"Catalog",cat:"Sample project",result:"Products and prices, easy to compare",t1:"Online store",t2:"Prices"},
      {name:"Mobile",cat:"Sample project",result:"Fast and comfortable on any phone",t1:"Responsive",t2:"Speed"}
    ],
    ru:[
      {name:"Шоурил BokWeb",cat:"Студия BokWeb",result:"Наши работы в движении",t1:"Видео",t2:"2025"},
      {name:"Главная",cat:"Пример проекта",result:"Чистый первый экран, который вызывает доверие",t1:"Веб-дизайн",t2:"Hero"},
      {name:"Каталог",cat:"Пример проекта",result:"Товары и цены, легко сравнивать",t1:"Магазин",t2:"Цены"},
      {name:"Мобильная",cat:"Пример проекта",result:"Быстро и удобно на любом телефоне",t1:"Адаптив",t2:"Скорость"}
    ],
    ka:[
      {name:"BokWeb შოურილი",cat:"BokWeb სტუდია",result:"ჩვენი ნამუშევრები მოძრაობაში",t1:"ვიდეო",t2:"2025"},
      {name:"მთავარი",cat:"სანიმუშო პროექტი",result:"სუფთა პირველი ეკრანი, რომელიც ნდობას იწვევს",t1:"ვებ-დიზაინი",t2:"Hero"},
      {name:"კატალოგი",cat:"სანიმუშო პროექტი",result:"პროდუქტები და ფასები — მარტივი შესადარებელი",t1:"მაღაზია",t2:"ფასები"},
      {name:"მობილური",cat:"სანიმუშო პროექტი",result:"სწრაფი და მოსახერხებელი ნებისმიერ ტელეფონზე",t1:"ადაპტიური",t2:"სისწრაფე"}
    ]
  };
  const PLAY_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M10 8.5l6 3.5-6 3.5z" fill="currentColor" stroke="none"/></svg>';
  const IMG_SVG  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M4 17l5-4 4 3 3-2 4 3"/></svg>';
  /* icons for the custom video player */
  const VP = {
    play:  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6.5" y="5" width="4" height="14" rx="1"/><rect x="13.5" y="5" width="4" height="14" rx="1"/></svg>',
    replay:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10a8 8 0 1 1 2 6.9"/><path d="M4 4v6h6" fill="none"/></svg>',
    vol:   '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    volOff:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9l5 6M21 9l-5 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    full:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5"/></svg>',
    fullX: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h5V4M20 9h-5V4M4 15h5v5M20 15h-5v5"/></svg>'
  };
  function fmtTime(s){ s = Math.max(0, Math.floor(s||0)); var m = Math.floor(s/60), r = s%60; return m + ":" + (r<10?"0":"") + r; }
  function esc(s){ return String(s).replace(/[&<>"'/]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;","/":"&#47;"}[c]; }); }
  function ytId(u){ const m = String(u).match(/(?:youtu\.be\/|[?&]v=|shorts\/|embed\/)([\w-]{11})/); return m ? m[1] : null; }

  const trackEl = document.getElementById("bwTrack");
  const thumbsEl = document.getElementById("bwThumbs");
  const progEl = document.getElementById("bwPfProg");
  const pfCount = PROJ.length;
  let pfIndex = 0;
  const pfReduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;

  function renderPortfolio(lang){
    if(!trackEl || !thumbsEl) return;
    const dict = I18N[lang] || I18N.en;
    const txt = PF_TEXT[lang] || PF_TEXT.en;
    trackEl.innerHTML = PROJ.map(function(m,i){
      const p = txt[i] || {};
      const isVideo = m.kind === "video";
      let media;
      if(m.src && isVideo && ytId(m.src)){
        media = '<iframe class="bw-pf-frame" src="https://www.youtube.com/embed/'+ytId(m.src)+'?enablejsapi=1&rel=0&playsinline=1" title="'+esc(p.name||m.domain)+'" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
      }else if(m.src && isVideo){
        media = '<div class="bw-player" tabindex="0" aria-label="Video player">'
          + '<video class="bw-pf-video" src="'+esc(m.src)+'" playsinline preload="metadata"></video>'
          + '<button class="bw-vp-big" type="button" aria-label="Play">'+VP.play+'</button>'
          + '<div class="bw-vp-bar">'
            + '<button class="bw-vp-btn bw-vp-play" type="button" aria-label="Play">'+VP.play+'</button>'
            + '<div class="bw-vp-seek" role="slider" aria-label="Seek" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span class="bw-vp-fill"></span><span class="bw-vp-knob"></span></div>'
            + '<span class="bw-vp-time">0:00 / 0:00</span>'
            + '<button class="bw-vp-btn bw-vp-mute" type="button" aria-label="Mute">'+VP.vol+'</button>'
            + '<button class="bw-vp-btn bw-vp-full" type="button" aria-label="Fullscreen">'+VP.full+'</button>'
          + '</div>'
        + '</div>';
      }else if(m.src){
        media = '<img class="bw-pf-img" src="'+esc(m.src)+'" alt="'+esc(p.name||m.domain)+'" loading="lazy" data-hint="'+esc(m.src)+'">';
      }else{
        media = isVideo
        ? '<div class="bw-pf-ph"><span class="bw-pf-play"></span><span>'+esc(dict.pf_videodrop||"")+'</span></div>'
        : '<div class="bw-pf-ph">'+IMG_SVG+'<span>'+esc(dict.pf_drop||"")+'</span></div>';
      }
      return '<div class="bw-pf-slide'+(i===pfIndex?' is-active':'')+'">'
        + '<span class="bw-pf-accent" style="background:'+m.accent+'"></span>'
        + '<span class="bw-pf-domain">'+esc(m.domain)+'</span>'
        + '<div class="bw-pf-media"><div class="bw-pf-media-in">'+media+'</div></div>'
      + '</div>';
    }).join("");
    thumbsEl.innerHTML = PROJ.map(function(m,i){
      const p = txt[i] || {};
      return '<button class="bw-pf-thumb" type="button" data-pf="'+i+'">'+esc(p.name||("#"+(i+1)))+'</button>';
    }).join("");
    thumbsEl.querySelectorAll("[data-pf]").forEach(function(btn){
      btn.addEventListener("click", function(){ pfGoTo(parseInt(btn.getAttribute("data-pf"),10)||0); });
    });
    // pause the carousel autoplay while a video is playing
    // (info card removed from slides)
    trackEl.querySelectorAll("video").forEach(function(v){
      var slide = v.closest(".bw-pf-slide");
      v.addEventListener("play",  function(){ if(slide) slide.classList.add("is-watching"); if(progEl) progEl.style.animationPlayState = "paused"; });
      v.addEventListener("pause", function(){ if(progEl && progEl.classList.contains("is-run") && !pfVideoBusy()) progEl.style.animationPlayState = "running"; });
      v.addEventListener("ended", function(){ if(slide) slide.classList.remove("is-watching"); if(progEl && progEl.classList.contains("is-run") && !pfVideoBusy()) progEl.style.animationPlayState = "running"; });
    });

    // ---- custom YouTube-style player controls ----
    trackEl.querySelectorAll(".bw-player").forEach(function(pl){
      var v       = pl.querySelector("video");
      var big     = pl.querySelector(".bw-vp-big");
      var bar     = pl.querySelector(".bw-vp-bar");
      var playBtn = pl.querySelector(".bw-vp-play");
      var seek    = pl.querySelector(".bw-vp-seek");
      var fill    = pl.querySelector(".bw-vp-fill");
      var knob    = pl.querySelector(".bw-vp-knob");
      var timeEl  = pl.querySelector(".bw-vp-time");
      var muteBtn = pl.querySelector(".bw-vp-mute");
      var fullBtn = pl.querySelector(".bw-vp-full");
      var idleT   = null;

      function playing(){ return !v.paused && !v.ended; }
      function syncIcons(){
        pl.classList.toggle("is-playing", playing());
        playBtn.innerHTML = playing() ? VP.pause : VP.play;
        playBtn.setAttribute("aria-label", playing() ? "Pause" : "Play");
        big.innerHTML = v.ended ? VP.replay : VP.play;
        big.setAttribute("aria-label", v.ended ? "Replay" : (v.currentTime > 0 ? "Continue" : "Play"));
      }
      function wake(){
        pl.classList.remove("is-idle");
        clearTimeout(idleT);
        idleT = setTimeout(function(){ if(playing()) pl.classList.add("is-idle"); }, 2600);
      }
      function toggle(){ if(v.paused || v.ended) v.play(); else v.pause(); }

      big.addEventListener("click", function(e){ e.stopPropagation(); toggle(); });
      playBtn.addEventListener("click", toggle);
      v.addEventListener("play",  function(){ syncIcons(); wake(); });
      v.addEventListener("pause", function(){ syncIcons(); pl.classList.remove("is-idle"); });
      v.addEventListener("ended", function(){ syncIcons(); pl.classList.remove("is-idle"); });

      // click video body = play/pause (ignore if it was a swipe), double click = fullscreen
      var downX = null;
      v.addEventListener("pointerdown", function(e){ downX = e.clientX; });
      v.addEventListener("click", function(e){
        if(downX !== null && Math.abs(e.clientX - downX) > 10){ downX = null; return; }
        downX = null; toggle();
      });
      v.addEventListener("dblclick", toggleFull);

      // progress + time
      function paint(){
        var d = v.duration || 0, c = v.currentTime || 0;
        var pct = d ? (c / d * 100) : 0;
        fill.style.width = pct + "%";
        knob.style.left  = pct + "%";
        timeEl.textContent = fmtTime(c) + " / " + fmtTime(d);
        seek.setAttribute("aria-valuenow", Math.round(pct));
      }
      v.addEventListener("timeupdate", paint);
      v.addEventListener("loadedmetadata", paint);
      v.addEventListener("durationchange", paint);

      // seeking (click or drag, like YouTube)
      function seekTo(clientX){
        var r = seek.getBoundingClientRect();
        var pct = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
        if(v.duration) v.currentTime = pct * v.duration;
        paint();
      }
      var scrubbing = false;
      seek.addEventListener("pointerdown", function(e){
        e.stopPropagation(); e.preventDefault();
        scrubbing = true; pl.classList.add("is-scrub");
        try{ seek.setPointerCapture(e.pointerId); }catch(err){}
        seekTo(e.clientX);
      });
      seek.addEventListener("pointermove", function(e){ if(scrubbing) seekTo(e.clientX); });
      function endScrub(){ if(scrubbing){ scrubbing = false; pl.classList.remove("is-scrub"); } }
      seek.addEventListener("pointerup", endScrub);
      seek.addEventListener("lostpointercapture", endScrub);

      // don't let the carousel treat clicks on the controls as a swipe
      bar.addEventListener("pointerdown", function(e){ e.stopPropagation(); });

      // mute + fullscreen
      muteBtn.addEventListener("click", function(){
        v.muted = !v.muted;
        muteBtn.innerHTML = v.muted ? VP.volOff : VP.vol;
        muteBtn.setAttribute("aria-label", v.muted ? "Unmute" : "Mute");
      });
      function toggleFull(){
        var cur = document.fullscreenElement || document.webkitFullscreenElement;
        if(cur){ (document.exitFullscreen || document.webkitExitFullscreen).call(document); }
        else{ (pl.requestFullscreen || pl.webkitRequestFullscreen).call(pl); }
      }
      fullBtn.addEventListener("click", toggleFull);

      // controls fade out while playing, come back on mouse move (like YouTube)
      pl.addEventListener("pointermove", wake);
      pl.addEventListener("pointerleave", function(){ if(playing()){ clearTimeout(idleT); pl.classList.add("is-idle"); } });

      // keyboard: space/K play, arrows seek, M mute, F fullscreen
      pl.addEventListener("keydown", function(e){
        var k = e.key.toLowerCase();
        if(k === " " || k === "k"){ e.preventDefault(); toggle(); }
        else if(e.key === "ArrowRight"){ e.preventDefault(); v.currentTime = Math.min(v.duration || 0, v.currentTime + 5); }
        else if(e.key === "ArrowLeft"){ e.preventDefault(); v.currentTime = Math.max(0, v.currentTime - 5); }
        else if(k === "m"){ muteBtn.click(); }
        else if(k === "f"){ e.preventDefault(); toggleFull(); }
      });

      syncIcons(); paint();
    });

    // if a screenshot file is missing, show a friendly placeholder instead of a broken image
    trackEl.querySelectorAll("img.bw-pf-img").forEach(function(img){
      img.addEventListener("error", function(){
        var wrap = img.parentElement;
        if(!wrap) return;
        wrap.innerHTML = '<div class="bw-pf-ph">'+IMG_SVG+'<span>'+esc((dict.pf_drop||"Add screenshot")+" — "+(img.getAttribute("data-hint")||""))+'</span></div>';
      });
    });

    // YouTube iframes: ask the player to start reporting play/pause (needs enablejsapi=1 in the URL)
    trackEl.querySelectorAll("iframe.bw-pf-frame").forEach(function(f){
      f.addEventListener("load", function(){
        try{ f.contentWindow.postMessage(JSON.stringify({event:"listening", id:"bwpf", channel:"widget"}), "*"); }catch(e){}
      });
    });
    if(pfIndex >= pfCount) pfIndex = 0;
    pfApply();
  }
  function pfSlides(){ return trackEl ? trackEl.querySelectorAll(".bw-pf-slide") : []; }
  let ytPlaying = false;
  function pfVideoBusy(){
    if(!trackEl) return ytPlaying;
    // a started-but-unfinished video (even paused) keeps the carousel clock stopped
    if(trackEl.querySelector(".bw-pf-slide.is-watching")) return true;
    return ytPlaying || Array.prototype.some.call(trackEl.querySelectorAll("video"), function(v){ return !v.paused && !v.ended; });
  }
  // React to play/pause reports coming from embedded YouTube players
  window.addEventListener("message", function(e){
    if(e.origin !== "https://www.youtube.com" && e.origin !== "https://www.youtube-nocookie.com") return;
    if(typeof e.data !== "string" || !trackEl) return;
    var d; try{ d = JSON.parse(e.data); }catch(err){ return; }
    var state = null;
    if(d.event === "onStateChange") state = d.info;
    else if(d.event === "infoDelivery" && d.info && typeof d.info.playerState === "number") state = d.info.playerState;
    if(state === null) return;
    Array.prototype.forEach.call(trackEl.querySelectorAll("iframe.bw-pf-frame"), function(f){
      if(f.contentWindow !== e.source) return;
      var slide = f.closest(".bw-pf-slide");
      if(state === 1){                                   // playing
        if(slide) slide.classList.add("is-watching");
        ytPlaying = true;
        if(progEl) progEl.style.animationPlayState = "paused";
      }else if(state === 2 || state === 0){              // paused / ended
        if(state === 0 && slide) slide.classList.remove("is-watching"); // card comes back only when the video ends
        ytPlaying = false;
        if(progEl && progEl.classList.contains("is-run") && !pfVideoBusy()) progEl.style.animationPlayState = "running";
      }
    });
  });
  // swap the fullscreen icon and switch to "contain" fit while a player is fullscreen
  function bwOnFsChange(){
    var cur = document.fullscreenElement || document.webkitFullscreenElement;
    document.querySelectorAll(".bw-player").forEach(function(pl){
      var on = cur === pl;
      pl.classList.toggle("is-full", on);
      var b = pl.querySelector(".bw-vp-full");
      if(b){ b.innerHTML = on ? VP.fullX : VP.full; b.setAttribute("aria-label", on ? "Exit fullscreen" : "Fullscreen"); }
    });
  }
  document.addEventListener("fullscreenchange", bwOnFsChange);
  document.addEventListener("webkitfullscreenchange", bwOnFsChange);
  function runProgress(){
    if(!progEl || pfReduce) return;
    progEl.classList.remove("is-run");
    void progEl.offsetWidth;                 // reflow to restart the fill animation
    progEl.style.animationPlayState = "running";
    progEl.classList.add("is-run");
  }
  function pfApply(){
    pfSlides().forEach(function(s,i){
      s.classList.toggle("is-active", i===pfIndex);
      if(i!==pfIndex){
        s.classList.remove("is-watching");
        s.querySelectorAll("video").forEach(function(v){ v.pause(); });
        s.querySelectorAll("iframe.bw-pf-frame").forEach(function(f){
          try{ f.contentWindow.postMessage(JSON.stringify({event:"command",func:"pauseVideo",args:[]}), "*"); }catch(e){}
        });
      }
    });
    if(thumbsEl) thumbsEl.querySelectorAll(".bw-pf-thumb").forEach(function(b,i){ b.classList.toggle("is-active", i===pfIndex); });
    runProgress();
  }
  function pfGoTo(i){ pfIndex = (i+pfCount)%pfCount; pfApply(); }
  function pfGo(d){ pfGoTo(pfIndex + d); }

  const band = document.querySelector(".bw-pf-band");
  if(band){
    var pfHint = document.getElementById("bwPfHint");
    var pfHintDone = false;
    function hidePfHint(){ if(pfHintDone) return; pfHintDone = true; if(pfHint) pfHint.classList.add("is-hidden"); }
    setTimeout(hidePfHint, 5000);
    // The progress bar is the autoplay clock: when it fills, advance a slide.
    if(progEl) progEl.addEventListener("animationend", function(){ pfGo(1); });
    band.addEventListener("mouseenter", function(){ if(progEl) progEl.style.animationPlayState = "paused"; });
    band.addEventListener("mouseleave", function(){ if(progEl && progEl.classList.contains("is-run") && !pfVideoBusy()) progEl.style.animationPlayState = "running"; });
    let sx = null;
    band.addEventListener("pointerdown", function(e){ sx = e.clientX; if(progEl) progEl.style.animationPlayState = "paused"; });
    window.addEventListener("pointerup", function(e){
      if(sx === null) return;
      const dx = e.clientX - sx; sx = null;
      if(Math.abs(dx) > 40){ pfGo(dx < 0 ? 1 : -1); hidePfHint(); }
      else if(progEl && progEl.classList.contains("is-run") && !pfVideoBusy()){ progEl.style.animationPlayState = "running"; }
    });
  }

  /* ---------- Reviews (dynamic, stored on the server) ---------- */
  var RV_LIST = [];
  var rvGrid = document.getElementById("bwRvGrid");
  var rvTestiInner = document.querySelector(".bw-testi-inner");
  function rvStars(n){
    var out = "";
    for(var i=1;i<=10;i++) out += '<span class="bw-star'+(i<=n?' is-on':'')+'">★</span>';
    return out;
  }
  function rvDate(ts){
    var loc = {ka:"ka-GE", ru:"ru-RU", en:"en-GB"}[root.getAttribute("lang")] || "ka-GE";
    try{ return new Date(ts).toLocaleDateString(loc, {year:"numeric", month:"short", day:"numeric"}); }
    catch(e){ return ""; }
  }
  function rvFeatured(){
    /* the built-in Nino Beridze testimonial stays as the first card */
    var d = I18N[root.getAttribute("lang")] || I18N.en;
    return '<article class="bw-rv-card bw-rv-featured">'
      + '<div class="bw-rv-top"><span class="bw-rv-starrow">'+rvStars(10)+'</span>'
      + '<span class="bw-rv-score">10/10</span></div>'
      + '<p class="bw-rv-text">'+esc(d.ts_quote||"")+'</p>'
      + '<div class="bw-rv-who"><b>'+esc(d.ts_author||"")+'</b><span>'+esc(d.ts_role||"")+'</span></div>'
      + '</article>';
  }
  function renderReviews(){
    if(!rvGrid) return;
    if(!RV_LIST.length){ rvGrid.hidden = true; if(rvTestiInner) rvTestiInner.style.display = ""; return; }
    if(rvTestiInner) rvTestiInner.style.display = "none";
    rvGrid.hidden = false;
    rvGrid.innerHTML = rvFeatured() + RV_LIST.map(function(r){
      r = {rating: Math.max(1, Math.min(10, Math.round(Number(r.rating)) || 1)),
           text: r.text, name: r.name, ts: r.ts};
      return '<article class="bw-rv-card">'
        + '<div class="bw-rv-top"><span class="bw-rv-starrow">'+rvStars(r.rating)+'</span>'
        + '<span class="bw-rv-score">'+r.rating+'/10</span></div>'
        + '<p class="bw-rv-text">'+esc(r.text)+'</p>'
        + '<div class="bw-rv-who"><b>'+esc(r.name)+'</b><span>'+esc(rvDate(r.ts))+'</span></div>'
        + '</article>';
    }).join("");
  }
  
  /* feature images remove themselves if the file is missing (CSP-safe,
     replaces the old inline onerror attributes) */
  document.querySelectorAll('img[src^="images/features/"]').forEach(function(im){
    function drop(){ im.remove(); }
    im.addEventListener("error", drop);
    if(im.complete && im.naturalWidth === 0) drop();
  });

  fetch("/api/reviews").then(function(r){ return r.json(); }).then(function(d){
    if(d && d.ok && d.reviews && d.reviews.length){ RV_LIST = d.reviews; renderReviews(); }
  }).catch(function(){});

  /* review modal */
  (function(){
    var modal = document.getElementById("bwRvModal");
    if(!modal) return;
    var openBtn = document.getElementById("bwRvOpen");
    var closeBtn = document.getElementById("bwRvClose");
    var starsBox = document.getElementById("bwRvStars");
    var formBox = document.getElementById("bwRvFormBox");
    var doneBox = document.getElementById("bwRvDoneBox");
    var errBox = document.getElementById("bwRvErr");
    var sendBtn = document.getElementById("bwRvSend");
    var rating = 0;
    for(var i=1;i<=10;i++){
      var b = document.createElement("button");
      b.type = "button"; b.className = "bw-rv-starbtn"; b.textContent = "★";
      b.setAttribute("aria-label", i + "/10");
      b.dataset.v = i;
      starsBox.appendChild(b);
    }
    function paint(){
      starsBox.querySelectorAll(".bw-rv-starbtn").forEach(function(b){
        b.classList.toggle("is-on", Number(b.dataset.v) <= rating);
      });
    }
    starsBox.addEventListener("click", function(e){
      var b = e.target.closest(".bw-rv-starbtn");
      if(b){ rating = Number(b.dataset.v); paint(); }
    });
    function openM(){
      formBox.hidden = false; doneBox.hidden = true; errBox.hidden = true;
      modal.hidden = false; document.body.style.overflow = "hidden";
    }
    function closeM(){
      modal.hidden = true; document.body.style.overflow = "";
    }
    if(openBtn) openBtn.addEventListener("click", openM);
    closeBtn.addEventListener("click", closeM);
    modal.addEventListener("click", function(e){ if(e.target === modal) closeM(); });
    document.addEventListener("keydown", function(e){ if(e.key === "Escape" && !modal.hidden) closeM(); });
    sendBtn.addEventListener("click", function(){
      if(sendBtn.disabled) return;
      errBox.hidden = true;
      var name = document.getElementById("bwRvName").value.trim();
      var text = document.getElementById("bwRvText").value.trim();
      if(!name || text.length < 4 || !rating){ errBox.hidden = false; return; }
      sendBtn.disabled = true;
      fetch("/api/reviews", { method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ name:name, text:text, rating:rating,
          website: (modal.querySelector(".bw-hp")||{}).value || "" }) })
      .then(function(r){ if(!r.ok) throw 0; return r.json(); })
      .then(function(resp){
        formBox.hidden = true; doneBox.hidden = false;
        var msg = document.getElementById("bwRvDoneMsg");
        var key = (resp && resp.pending === false) ? "rv_done_live" : "rv_done_x";
        if(msg){
          msg.setAttribute("data-i18n", key);
          var d = I18N[root.getAttribute("lang")] || I18N.en;
          msg.textContent = d[key] || "";
        }
        if(resp && resp.pending === false){
          /* published instantly — show it in the section right away */
          fetch("/api/reviews").then(function(x){ return x.json(); }).then(function(dd){
            if(dd && dd.ok){ RV_LIST = dd.reviews || []; renderReviews(); }
          }).catch(function(){});
        }
        document.getElementById("bwRvName").value = "";
        document.getElementById("bwRvText").value = "";
        rating = 0; paint();
      })
      .catch(function(){ errBox.hidden = false; })
      .then(function(){ sendBtn.disabled = false; });
    });
  })();

  /* ---------- Footer columns + subscribe ---------- */
  const FOOT_COLS = {
    en:[
      {title:"Services",links:["Websites","Online shops","Booking pages","Redesign"]},
      {title:"Company",links:["About","Portfolio","Contact"]},
      {title:"Resources",links:["Guides","FAQ","Support"]},
      {title:"Legal",links:["Privacy","Terms"]}
    ],
    ru:[
      {title:"Услуги",links:["Сайты","Интернет-магазины","Страницы записи","Редизайн"]},
      {title:"Компания",links:["О нас","Портфолио","Контакты"]},
      {title:"Ресурсы",links:["Гайды","FAQ","Поддержка"]},
      {title:"Правовое",links:["Конфиденциальность","Условия"]}
    ],
    ka:[
      {title:"სერვისები",links:["საიტები","ონლაინ მაღაზიები","ჩაწერის გვერდები","რედიზაინი"]},
      {title:"კომპანია",links:["ჩვენ შესახებ","პორტფოლიო","კონტაქტი"]},
      {title:"რესურსები",links:["გზამკვლევები","FAQ","მხარდაჭერა"]},
      {title:"იურიდიული",links:["კონფიდენციალურობა","პირობები"]}
    ]
  };
  /* BW-CONTENT-MERGE: texts saved from the admin panel override the built-ins */
  ;(function(){
    var C = window.BW_CONTENT; if(!C) return;
    ["en","ru","ka"].forEach(function(l){
      if(C.i18n && C.i18n[l]) Object.assign(I18N[l] || (I18N[l]={}), C.i18n[l]);
      if(C.pf   && C.pf[l])   PF_TEXT[l]   = C.pf[l];
      if(C.foot && C.foot[l]) FOOT_COLS[l] = C.foot[l];
    });
  })();
  const footColsEl = document.getElementById("bwFootCols");
  function renderFooterCols(lang){
    if(!footColsEl) return;
    const cols = FOOT_COLS[lang] || FOOT_COLS.en;
    footColsEl.innerHTML = cols.map(function(c){
      return '<div class="bw-foot-col"><div class="bw-foot-col-title">'+esc(c.title)+'</div>'
        + c.links.map(function(l){ return '<a href="#">'+esc(l)+'</a>'; }).join("")
        + '</div>';
    }).join("");
  }
  const subForm = document.getElementById("bwSubForm");
  const subThanks = document.getElementById("bwSubThanks");
  const subBtn = document.getElementById("bwSubBtn");
  const subEmail = document.getElementById("bwSubEmail");
  function validEmail(v){ return /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/.test(v); }
  if(subBtn && subEmail){
    function doSubscribe(){
      var email = subEmail.value.trim();
      /* validation — the bug fix: an empty or invalid email is rejected */
      if(!validEmail(email)){
        subEmail.classList.add("bw-input-err");
        subEmail.focus();
        return;
      }
      subEmail.classList.remove("bw-input-err");
      subBtn.disabled = true;
      var lang = document.documentElement.getAttribute("lang") || "ka";
      fetch("/api/subscribe", {
        method: "POST", headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ email: email, lang: lang, website: "" })
      })
      .then(function(r){ if(!r.ok) throw 0; return r.json(); })
      .then(function(){
        if(subForm) subForm.hidden = true;
        if(subThanks) subThanks.hidden = false;
      })
      .catch(function(){
        /* server offline (e.g. opened as a local file) — still confirm so the
           visitor isn't blocked, but only because the email passed validation */
        if(subForm) subForm.hidden = true;
        if(subThanks) subThanks.hidden = false;
      })
      .then(function(){ subBtn.disabled = false; });
    }
    subBtn.addEventListener("click", doSubscribe);
    subEmail.addEventListener("keydown", function(e){ if(e.key === "Enter") doSubscribe(); });
    subEmail.addEventListener("input", function(){ subEmail.classList.remove("bw-input-err"); });
  }

  /* ---------- "Order" buttons + "Contact" nav open the order popup ---------- */
  document.querySelectorAll(".order-btn, .nav-link[href='#contact'], .m-link[href='#contact'], .drop-link[href='#contact'], .m-sub a[href='#contact']").forEach(function(b){
    b.addEventListener("click", function(e){
      e.preventDefault();
      if(typeof closeDrawer === "function") closeDrawer();
      openOrder();
    });
  });

  /* ---------- Scroll reveal (Why + Portfolio + Features + Testimonial) ---------- */
  (function(){
    const reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    if(reduce || !("IntersectionObserver" in window)){
      /* no animation: make sure any reveal elements are simply visible */
      window.bwObserveReveal = function(root){
        (root || document).querySelectorAll("[data-reveal]").forEach(function(n){ n.classList.add("is-in"); });
      };
      window.bwObserveReveal(document);
      return;
    }
    const io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(!en.isIntersecting) return;
        const d = parseInt(en.target.getAttribute("data-reveal"),10) || 0;
        en.target.style.transitionDelay = (d*0.08).toFixed(2) + "s";
        en.target.classList.add("is-in");
        io.unobserve(en.target);
      });
    }, {threshold:0.15, rootMargin:"0px 0px -8% 0px"});
    /* reusable: observe reveal elements inside a given root (for dynamic content) */
    window.bwObserveReveal = function(root){
      if(!root) return;
      var host = root.closest ? (root.closest(".bw-why, .bw-portfolio, .bw-features, .bw-testi") || root) : root;
      host.classList.add("bw-reveal-ready");
      root.querySelectorAll("[data-reveal]:not(.is-in)").forEach(function(n){ io.observe(n); });
    };
    document.querySelectorAll(".bw-why, .bw-portfolio, .bw-features, .bw-testi").forEach(function(sec){
      sec.classList.add("bw-reveal-ready");
      sec.querySelectorAll("[data-reveal]").forEach(function(n){ io.observe(n); });
    });
  })();

  /* ---------- Init ---------- */
  (function(){
    var savedLang; try{ savedLang = localStorage.getItem("bw-lang"); }catch(e){}
    var pathLang = (location.pathname.match(/^\/(en|ru)(\/|$)/) || [])[1];
    setLang(pathLang || savedLang || "ka");
  })();
  // Arriving from the Services page CTA (index.html#order) opens the order popup
  if(location.hash === "#order" && typeof openOrder === "function"){ openOrder(); }
})();
