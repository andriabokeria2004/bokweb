var SECTIONS = [
  { title:"Logo / ლოგო — used everywhere (header, menu, footer, order page, all pages)",
    where:"Change these 2–4 files and the logo updates across the whole site. Best: PNG with transparent background, about 660×132 px (wordmark) and square (mark).",
    slots:[
      {f:"images/logo/logo-light.png", n:"Full logo — light theme (dark text)"},
      {f:"images/logo/logo-dark.png",  n:"Full logo — dark theme (white text)", dk:1},
      {f:"images/logo/mark-light.png", n:"Square mark — light theme (order page)"},
      {f:"images/logo/mark-dark.png",  n:"Square mark — dark theme", dk:1}
    ]},
  { title:"Home — Portfolio slider / მთავარი — ნამუშევრები",
    where:"index.html, the big sliding gallery.",
    slots:[
      {f:"images/portfolio/video-1.mp4", n:"Slide 1 — showreel video", v:1},
      {f:"images/portfolio/shot-1.png",  n:"Slide 2 — screenshot"},
      {f:"images/portfolio/shot-2.png",  n:"Slide 3 — screenshot"},
      {f:"images/portfolio/shot-3.png",  n:"Slide 4 — screenshot"}
    ]},
  { title:"Home — Features (01 / 02 / 03) / მთავარი — როგორ ვმუშაობთ",
    where:"index.html, the three numbered rows near the bottom.",
    slots:[
      {f:"images/features/feature-1.png", n:"01 — Show what you sell"},
      {f:"images/features/feature-2.png", n:"02 — Make contact effortless"},
      {f:"images/features/feature-3.png", n:"03 — Turn visits into requests"}
    ]},
  { title:"Services page — banners / სერვისების გვერდი",
    where:"services.html — one wide banner per service, in page order. Each banner also has small copies for phones (service-N-640.png and service-N-1024.png): when replacing an image, either replace all three sizes or simply delete the two small copies — the site falls back to your single file automatically.",
    slots:[
      {f:"images/services/service-1.png", n:"1 — Web design"},
      {f:"images/services/service-2.png", n:"2 — Web development"},
      {f:"images/services/service-3.png", n:"3 — Online stores"},
      {f:"images/services/service-4.png", n:"4 — Branding & identity"},
      {f:"images/services/service-5.png", n:"5 — SEO & optimization"},
      {f:"images/services/service-6.png", n:"6 — Landing pages"},
      {f:"images/services/service-7.png", n:"7 — Maintenance & support"},
      {f:"images/services/service-8.png", n:"8 — Hosting & setup"}
    ]},
  { title:"Prices page — hero slideshow / ფასების გვერდი — მთავარი სლაიდები",
    where:"prices.html, the big slideshow at the top (one per plan).",
    slots:[
      {f:"images/prices/hero-1.png", n:"Basic"},
      {f:"images/prices/hero-2.png", n:"Pro"},
      {f:"images/prices/hero-3.png", n:"Pro Plus"}
    ]},
  { title:"Prices page — plan cards / სატარიფო ბარათები",
    where:"prices.html, background of the three price cards.",
    slots:[
      {f:"images/prices/plan-1.png", n:"Basic card"},
      {f:"images/prices/plan-2.png", n:"Pro card"},
      {f:"images/prices/plan-3.png", n:"Pro Plus card"}
    ]},
  { title:"Prices page — highlight cards / აქცენტის ბარათები",
    where:"prices.html, the five small cards.",
    slots:[
      {f:"images/prices/highlight-1.png", n:"Highlight 1 (wide)"},
      {f:"images/prices/highlight-2.png", n:"Highlight 2"},
      {f:"images/prices/highlight-3.png", n:"Highlight 3"},
      {f:"images/prices/highlight-4.png", n:"Highlight 4"},
      {f:"images/prices/highlight-5.png", n:"Highlight 5"}
    ]},
  { title:"Prices page — wide bands + CTA / ფართო ზოლები",
    where:"prices.html, the three wide image bands and the final call-to-action background.",
    slots:[
      {f:"images/prices/band-1.png", n:"Band 1"},
      {f:"images/prices/band-2.png", n:"Band 2"},
      {f:"images/prices/band-3.png", n:"Band 3"},
      {f:"images/prices/cta.png",    n:"CTA background"}
    ]}
];

var app = document.getElementById("app");
SECTIONS.forEach(function(sec){
  var h = document.createElement("h2"); h.textContent = sec.title; app.appendChild(h);
  var w = document.createElement("p"); w.className = "where"; w.textContent = sec.where; app.appendChild(w);
  var g = document.createElement("div"); g.className = "grid";
  sec.slots.forEach(function(s){
    var card = document.createElement("div"); card.className = "slot";
    var pv = document.createElement("div"); pv.className = "pv" + (s.dk ? " dk" : "");
    var m;
    if(s.v){ m = document.createElement("video"); m.src = s.f; m.muted = true; m.preload = "metadata"; }
    else { m = document.createElement("img"); m.src = s.f; m.alt = ""; }
    pv.appendChild(m); card.appendChild(pv);
    var fn = document.createElement("div"); fn.className = "fn"; fn.textContent = s.f; card.appendChild(fn);
    var nt = document.createElement("div"); nt.className = "nt"; nt.textContent = s.n; card.appendChild(nt);
    g.appendChild(card);
  });
  app.appendChild(g);
});
