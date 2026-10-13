/* Elite Touch Collections - behaviour (cart, menu, slider, filters, animations).
   Page content lives in the .html files and _data/products.json for Decap CMS. */
(() => {
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const NUMBER = "233531331640";                       // WhatsApp number (no +)
const fmt = n => "₵" + Number(n).toLocaleString("en-GH");
const wa = m => `https://wa.me/${NUMBER}?text=${encodeURIComponent(m)}`;
const root = document.documentElement;

/* ---------- Cart (saved in the browser) ---------- */
let cart = [];
try { cart = JSON.parse(localStorage.getItem("etc-cart")) || []; } catch (e) {}
const save = () => { try { localStorage.setItem("etc-cart", JSON.stringify(cart)); } catch (e) {} };

function drawer() {
  const n = cart.reduce((s, i) => s + i.q, 0), t = cart.reduce((s, i) => s + i.p * i.q, 0), cb = $("#cb");
  if (cb) {
    cb.innerHTML = `Bag <b>${n}</b>`;
    cb.setAttribute("aria-label", `Open bag, ${n} items`);
    if (n) $("b", cb).classList.add("bp");
  }
  const db = $("#db");
  if (!db) return;
  db.innerHTML = cart.length
    ? `<ul class="dl">${cart.map(i => `<li><div class="mat"><img class="cv" src="${i.img}" alt="${i.n}"></div><div class="mt2"><div><p class="d" style="font-size:1.05rem">${i.n}</p><p style="opacity:.6">Size ${i.s}</p></div><div style="display:flex;justify-content:space-between;align-items:center"><div class="qt"><button data-a="cq" data-id="${i.id}" data-s="${i.s}" data-d="-1" aria-label="Decrease quantity">−</button><span>${i.q}</span><button data-a="cq" data-id="${i.id}" data-s="${i.s}" data-d="1" aria-label="Increase quantity">+</button></div><span>${fmt(i.p * i.q)}</span></div><button data-a="cq" data-id="${i.id}" data-s="${i.s}" data-d="-99" style="align-self:flex-start;text-decoration:underline;font-size:12px">Remove</button></div></li>`).join("")}</ul><div class="df"><p><span>Subtotal</span><span>${fmt(t)}</span></p><a class="btn bk" target="_blank" rel="noopener noreferrer" href="${wa(`Hello Elite Touch Collections 👋\n\nI'd like to place an order:\n\n${cart.map((i, k) => `${k + 1}. ${i.n} — Size: ${i.s} — Qty: ${i.q} — ${fmt(i.p * i.q)}`).join("\n")}\n\nSubtotal: ${fmt(t)}\n\nPlease confirm availability and delivery. Thank you!`)}">Complete order on WhatsApp</a></div>`
    : `<div class="em"><p>Your bag is empty.</p><a class="btn bk" href="shop.html">Browse the collection</a></div>`;
}

function setDr(o) {
  const dr = $("#dr");
  if (!dr) return;
  const was = dr.classList.contains("open");
  ["#dr", "#bd"].forEach(s => { const el = $(s); if (el) el.classList.toggle("open", !!o); });
  dr.setAttribute("aria-hidden", !o);
  root.classList.toggle("lock", !!o || ($("#mm") && $("#mm").classList.contains("open")));
  if (o && $("#dc")) $("#dc").focus(); else if (was && $("#cb")) $("#cb").focus();
}

function setMenu(o) {
  const m = $("#mm"), b = $(".mbtn");
  if (!m || !b) return;
  m.classList.toggle("open", !!o); b.setAttribute("aria-expanded", !!o); b.textContent = o ? "Close" : "Menu";
  root.classList.toggle("lock", !!o || ($("#dr") && $("#dr").classList.contains("open")));
  if (o && $("#hd")) m.style.paddingTop = $("#hd").getBoundingClientRect().bottom + 16 + "px";
}

/* ---------- Home slider ---------- */
let cur = 0;
function go(d) {
  const sl = $$(".sl"), caps = $$(".ecap");
  if (!sl.length) return;
  const n = (cur + d + sl.length) % sl.length, a = sl[cur], b = sl[n];
  b.className = "sl nt " + (d > 0 ? "pre" : "post"); void b.offsetWidth; b.className = "sl on";
  a.className = "sl " + (d > 0 ? "post" : "pre");
  sl.forEach((s, i) => { s.tabIndex = i === n ? 0 : -1; s.setAttribute("aria-hidden", i !== n); });
  caps.forEach((c, i) => c.classList.toggle("on", i === n));
  cur = n;
  if ($("#pg2")) $("#pg2").style.width = (n + 1) / sl.length * 100 + "%";
}

/* ---------- Product page ---------- */
const pp = $("#pp");
const size = () => { const b = $("[data-a=sz][aria-pressed=true]"); return b ? b.dataset.s : ""; };
let qty = 1;
function updateProduct() {
  if (!pp) return;
  if ($("#qv")) $("#qv").textContent = qty;
  const isSoldOut = pp.dataset.soldOut === "true";
  const note = isSoldOut ? " (Note: marked sold out)" : "";
  if ($("#wa1")) $("#wa1").href = wa(`Hello Elite Touch Collections 👋\n\nI'm interested in: ${pp.dataset.name}\nSize: ${size()}\nPrice: ${fmt(+pp.dataset.price)}${note}\n\nIs this available?`);
}

/* ---------- Clicks ---------- */
document.addEventListener("click", e => {
  const t = e.target.closest("[data-a]"); if (!t) return;
  const a = t.dataset.a;
  if (a === "cart") setDr(1);
  else if (a === "close") setDr(0);
  else if (a === "menu") setMenu(!$("#mm").classList.contains("open"));
  else if (a === "en") go(1);
  else if (a === "ep") go(-1);
  else if (a === "faq") { const o = t.closest(".fq>div").classList.toggle("open"); t.setAttribute("aria-expanded", o); }
  else if (a === "cq") {
    const i = cart.find(x => x.id === t.dataset.id && x.s === t.dataset.s);
    if (i) {
      i.q += +t.dataset.d; cart = cart.filter(x => x.q > 0); save(); drawer();
    }
  }
  else if (a === "sz") {
    if (t.disabled) return;
    $$("[data-a=sz]").forEach(b => b.setAttribute("aria-pressed", b === t));
    updateProduct();
  }
  else if (a === "pq") { qty = Math.max(1, qty + +t.dataset.d); updateProduct(); }
  else if (a === "th") {
    $$("[data-a=th]").forEach(b => b.setAttribute("aria-pressed", b === t));
    const img = $("#mi");
    if (img) {
      img.src = t.dataset.src; img.style.animation = "none"; void img.offsetWidth; img.style.animation = "";
    }
  }
  else if (a === "add") {
    if (t.disabled || (pp && pp.dataset.soldOut === "true")) return;
    const d = pp.dataset, s = size(), h = cart.find(i => i.id === d.id && i.s === s);
    h ? h.q += qty : cart.push({ id: d.id, n: d.name, p: +d.price, img: d.img, s, q: qty });
    save(); drawer(); setDr(1);
  }
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape") { setDr(0); setMenu(0); }
  if (e.target.closest && e.target.closest(".ed")) { if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); }
  const d = $("#dr");
  if (e.key === "Tab" && d && d.classList.contains("open")) {
    const f = $$("a,button", d), x = f[0], z = f[f.length - 1];
    if (e.shiftKey && document.activeElement === x) { e.preventDefault(); z.focus(); }
    else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); x.focus(); }
  }
});

/* ---------- Shop filters ---------- */
function setupFilters() {
  const grid = $("#grid");
  if (!grid) return;
  const items = $$("#grid>li"), bands = [() => true, x => x < 380, x => x >= 380 && x <= 420, x => x > 420];
  const apply = () => {
    const s = $("#fs") ? $("#fs").value : "";
    const b = $("#fb") ? +$("#fb").value : 0;
    const o = $("#fo") ? $("#fo").value : "new";
    const vis = items.filter(li => {
      const sizes = li.dataset.sizes ? li.dataset.sizes.split(",") : [];
      const ok = (!s || sizes.includes(s)) && bands[b](+li.dataset.price);
      li.hidden = !ok;
      return ok;
    });
    vis.sort((x, y) => o === "low" ? x.dataset.price - y.dataset.price : o === "high" ? y.dataset.price - x.dataset.price : (x.dataset.i || 0) - (y.dataset.i || 0));
    vis.forEach(li => grid.append(li));
    if ($("#none")) $("#none").hidden = vis.length > 0;
  };
  $$(".fl select").forEach(s => {
    s.onchange = apply;
  });
}
setupFilters();

/* ---------- Contact form -> WhatsApp ---------- */
const cf = $("#cf");
if (cf) cf.addEventListener("submit", e => {
  e.preventDefault();
  open(wa(`Hello Elite Touch Collections 👋\n\n${$("#cm").value}\n\n— ${$("#cn").value}`), "_blank", "noopener,noreferrer");
});

/* ---------- Animations (Initial Immediate Run) ---------- */
const mt = $(".mt");
if (mt) $$("a", mt).forEach(a => { const c = a.cloneNode(true); c.setAttribute("aria-hidden", "true"); c.tabIndex = -1; mt.append(c); }); // repeat strip for a seamless loop

const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -60px" });
$$(".hd,.sec>h2.d,.pgrid>li,.fq>div,.gr>li,.rw").forEach(e => {
  e.classList.add("rv");
  e.style.transitionDelay = Math.min($$(":scope>*", e.parentNode).indexOf(e), 5) * 80 + "ms";
  io.observe(e);
});

addEventListener("scroll", () => $("#hd") && $("#hd").classList.toggle("sc", scrollY > 8), { passive: true });
if ($("#pg2") && $$(".sl").length) $("#pg2").style.width = 100 / $$(".sl").length + "%";
if (pp) updateProduct();
drawer();

/* ---------- Decap CMS Dynamic Integration (_data/products.json) ---------- */
async function renderGrids() {
  try {
    const res = await fetch('_data/products.json', { cache: 'no-store' });
    if (!res.ok) return;
    const data = await res.json();
    const products = Array.isArray(data) ? data : (data.products || []);
    if (!products.length) return;

    // 1. Unified product page
    if (pp) {
      const params = new URLSearchParams(location.search);
      const id = params.get('id');
      const p = (id ? products.find(x => x.id === id) : null) || products[0];
      if (p) {
        document.title = p.name + ' | Elite Touch Collections';
        pp.dataset.id = p.id;
        pp.dataset.name = p.name;
        pp.dataset.price = p.price;
        pp.dataset.img = p.image;
        pp.dataset.soldOut = p.soldOut ? "true" : "false";

        const mi = $("#mi");
        if (mi) { mi.src = p.image; mi.alt = p.name; }

        const h1 = $("h1", pp) || $("h1");
        if (h1) h1.textContent = p.name;

        const pr = $(".pr", pp);
        if (pr) pr.textContent = fmt(p.price);

        const pdesc = $("#pdesc");
        if (pdesc) pdesc.textContent = p.description || "";

        const pfab = $("#pfab");
        if (pfab) pfab.textContent = p.fabric || "";

        const psz = $("#psz");
        if (psz) {
          const avail = p.sizes || [];
          const allSizes = ["XS", "S", "M", "L", "XL", "XXL"];
          let picked = false;
          psz.innerHTML = allSizes.map(s => {
            const has = avail.includes(s);
            const sel = has && !picked;
            if (sel) picked = true;
            return `<button data-a="sz" data-s="${s}" aria-pressed="${sel}" ${has ? '' : 'disabled'}>${s}</button>`;
          }).join('');
        }

        const pmat = $("#pmat") || $(".pm .mat");
        if (pmat) {
          const b = pmat.querySelector(".soldout");
          if (b) b.remove();
          if (p.soldOut) {
            const span = document.createElement("span");
            span.className = "soldout";
            span.textContent = "Sold out";
            pmat.prepend(span);
          }
        }

        const addBtn = $('[data-a="add"]');
        if (addBtn) {
          if (p.soldOut) {
            addBtn.textContent = 'Sold out';
            addBtn.disabled = true;
          } else {
            addBtn.textContent = 'Add to cart';
            addBtn.disabled = false;
          }
        }

        const prelated = $("#prelated");
        if (prelated) {
          const others = products.filter(x => x.id !== p.id).slice(0, 4);
          prelated.innerHTML = others.map(r => `
            <li>
              <a class="card" href="product.html?id=${r.id}">
                <div class="mat p45">
                  <img src="${r.image}" alt="${r.name}">
                  ${r.soldOut ? '<span class="soldout">Sold out</span>' : ''}
                </div>
                <div class="cap"><h3>${r.name}</h3><span>${fmt(r.price)}</span></div>
              </a>
            </li>
          `).join('');
        }

        updateProduct();
      }
    }

    // 2. Shop grid on shop & category pages
    const shopGrid = document.getElementById('grid');
    if (shopGrid) {
      const category = document.body.dataset.category;
      const filtered = category ? products.filter(p => p.category === category) : products;
      shopGrid.innerHTML = filtered.map(p => `
        <li data-price="${p.price}" data-sizes="${(p.sizes || []).join(',')}" data-i="${p.id}">
          <a class="card" href="product.html?id=${p.id}">
            <div class="mat p45">
              <img src="${p.image}" alt="${p.name}">
              ${p.soldOut ? '<span class="soldout">Sold out</span>' : ''}
            </div>
            <div class="cap"><h3>${p.name}</h3><span>${fmt(p.price)}</span></div>
          </a>
        </li>`).join('');
      setupFilters();
    }

    // 3. Home slider (.stage & #edt) - updates smoothly if products were added/edited in CMS
    const stage = document.querySelector('.stage');
    const edt = document.getElementById('edt');
    if (stage && edt) {
      const featured = products.slice(0, 6);
      stage.innerHTML = featured.map((p, i) => `
        <a class="sl ${i === 0 ? 'on' : 'pre'}" href="product.html?id=${p.id}" aria-label="${p.name}">
          <img src="${p.image}" alt="">
        </a>`).join('');

      edt.innerHTML = featured.map((p, i) => {
        const num = String(i + 1).padStart(2, '0');
        const total = String(featured.length).padStart(2, '0');
        return `
          <div class="ecap ${i === 0 ? 'on' : ''}">
            <p class="lb">${num} / ${total}</p>
            <h3 class="d">${p.name}</h3>
            <p class="pr">₵${p.price}</p>
            <p class="ed-d">${p.description || ''}</p>
            <a class="btn bk" href="product.html?id=${p.id}">View dress</a>
          </div>
        `;
      }).join('');

      cur = 0;
      if ($("#pg2")) $("#pg2").style.width = (100 / featured.length) + "%";
    }

    // 4. New arrivals strip (.mt) - updates smoothly if products were added/edited in CMS
    const strip = document.querySelector('.mt');
    if (strip) {
      strip.innerHTML = products.map(p => `
        <a href="product.html?id=${p.id}">
          <div class="mat p45">
            <img src="${p.image}" alt="${p.name}">
            ${p.soldOut ? '<span class="soldout">Sold out</span>' : ''}
          </div>
          <p class="cap"><span style="font:1.05rem var(--fd)">${p.name}</span><span>₵${p.price}</span></p>
        </a>`).join('');
      $$("a", strip).forEach(a => { const c = a.cloneNode(true); c.setAttribute("aria-hidden", "true"); c.tabIndex = -1; strip.append(c); });
    }
  } catch (err) {
    console.error("renderGrids error:", err);
  }
}

renderGrids();
})();
