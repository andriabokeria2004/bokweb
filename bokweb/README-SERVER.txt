==============================================
 BokWeb server + admin panel — how to run
==============================================

WHAT IT DOES
  • Hosts your website
  • The admin panel edits EVERYTHING through the server:
      - all texts on the site (KA / EN / RU) — Home, Services, Prices
      - plan names & prices, features, FAQ, footer links
      - images and videos (uploaded straight into the site folder)
      - home page sections (hide built-ins, add your own)
  • Receives contact-form messages  -> Admin panel > Messages
  • Receives client reviews (1-10 stars) -> Admin panel > Reviews
    (reviews appear on the site ONLY after you press Approve,
     unless you switch on auto-publish)
  • Stores messages/reviews/login in the "data" folder

RUN IT ON YOUR COMPUTER
  1. Install Node.js LTS from  https://nodejs.org  (one time)
  2. Open a terminal in this folder and run:      node server.js
  3. Open the site:    http://localhost:3000
     Admin panel:      http://localhost:3000/admin.html
  4. SIGN IN with the default login:
         login:     admin
         password:  admin123
     Then open the "Security" tab and set your own login and
     password (takes 10 seconds — please do it!).

EDITING TEXTS
  Admin panel > Home / Services / Prices tabs. Pick the language
  (KA / EN / RU) at the top right, change any field, press SAVE at
  the bottom, then refresh the website. All texts live in the file
  site-content.js — the panel writes it for you. If you save a
  mistake, the previous version is kept in data/site-content-prev.js
  (rename it back to site-content.js to undo).

ADMIN TOKEN (master key — still works)
  The ADMIN TOKEN is printed in the terminal and saved in
  data/secret.txt. On the login screen press
  "Sign in with admin token instead" to use it. It always works,
  even if you forget the password. Keep it private.

FORGOT THE PASSWORD?
  Option A: sign in with the admin token (see above), then set a
            new password in the Security tab.
  Option B: stop the server, delete data/admin-login.json, start
            again — the login resets to admin / admin123.

PHONE FRIENDLY
  The admin panel works comfortably on phones — the menu slides in
  from the left, forms and buttons are sized for touch.

NOTES
  • The admin panel needs the server (node server.js). The website
    itself still works on any static hosting — texts and sections
    are read from plain files (site-content.js / site-config.js).
  • BACK UP the "data" folder and never upload data/secret.txt
    anywhere public.

PUT IT ONLINE
  Any Node.js hosting works. Easy options: Render.com or Railway.app
  (free tiers) — connect the folder, set the start command to
  "node server.js"; the PORT is picked up automatically. Classic
  VPS/cPanel-with-Node hosting works the same way.
