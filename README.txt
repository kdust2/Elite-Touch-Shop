ELITE TOUCH COLLECTIONS - EDITABLE WEBSITE

Open index.html in your browser (double-click). Every page is a real .html file you can open and edit in any text editor:

  index.html            Home (hero, slider, new arrivals, shop by style)
  shop.html             All dresses
  shop-casual.html      Casual   (also shop-occasion, shop-boubou, shop-two-piece)
  product-et-001.html   One file per dress (et-001 to et-009)
  contact.html          Contact + WhatsApp form
  faq.html              Questions and answers
  style.css             All colours, fonts, spacing (see :root at the top)
  script.js             Cart, menu, slider, filters (you rarely need to touch this)
  images/               Dress photos

COMMON EDITS
- Change a price: it appears in the dress's product-et-XXX.html (data-price and the visible price) AND in each page that lists the dress (cards, filters). Search for the old price, e.g. "₵380" and data-price="380", and change every match.
- Change dress name/description: edit its product-et-XXX.html, and search the name to update cards on other pages.
- Navigation, top strip, footer, cart drawer: the same block is repeated at the top and bottom of every page. Change it in each file (use "Find in files" in your editor).
- WhatsApp number: search 233531331640 in all files, and NUMBER in script.js.
- Colours / fonts: top of style.css.

HOST ON GITHUB PAGES
1. New repository on github.com, upload everything in this folder (index.html at the top level).
2. Settings > Pages > Deploy from a branch > main / (root) > Save.
3. Your site appears at https://YOUR-USERNAME.github.io/REPO-NAME/
