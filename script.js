/* Elite Touch Collections - behaviour (cart, menu, slider, filters, animations).
   Page content lives in the .html files; this file only adds interactivity. */
(() => {
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const NUMBER = "233531331640";                       // WhatsApp number (no +)
const fmt = n => "₵" + n.toLocaleString("en-GH");
const wa = m => `https://wa.me/${NUMBER}?text=${encodeURIComponent(m)}`;
const root = document.documentElement;

/* ---------- Cart (saved in the browser) ---------- */
let cart = [];
try { cart = JSON.parse(localStorage.getItem("etc-cart")) || []; } catch (e) {}
const save = () => { try { localStorage.setItem("etc-cart", JSON.stringify(cart)); } catch (e) {} };

function drawer() {
  const n = cart.reduce((s, i) => s + i.q, 0), t = cart.reduce((s, i) => s + i.p * i.q, 0), cb = $("#cb");
  cb.innerHTML = `Bag <b>${n}</b>`;
  cb.setAttribute("aria-label", `Open bag, ${n} items`);
  if (n) $("b", cb).classList.add("bp");
  $("#db").innerHTML = cart.length
    ? `<ul class="dl">${cart.map(i => `<li><div class="mat"><img class="cv" src="${i.img}" alt="${i.n}"></div><div class="mt2"><div><p class="d" style="font-size:1.05rem">${i.n}</p><p style="opacity:.6">Size ${i.s}</p></div><div style="display:flex;justify-content:space-between;align-items:center"><div class="qt"><button data-a="cq" data-id="${i.id}" data-s="${i.s}" data-d="-1" aria-label="Decrease quantity">−</button><span>${i.q}</span><button data-a="cq" data-id="${i.id}" data-s="${i.s}" data-d="1" aria-label="Increase quantity">+</button></div><span>${fmt(i.p * i.q)}</span></div><button data-a="cq" data-id="${i.id}" data-s="${i.s}" data-d="-99" style="align-self:flex-start;text-decoration:underline;font-size:12px">Remove</button></div></li>`).join("")}</ul>
<div class="df"><p><span>Subtotal</span><span>${fmt(t)}</span></p><a class="btn bk" target="_blank" rel="noopener noreferrer" href="${wa(`Hello Elite Touch Collections 👋\n\nI'd like to place an order:\n\n${cart.map((i, k) => `${k + 1}. ${i.n} — Size: ${i.s} — Qty: ${i.q} — ${fmt(i.p * i.q)}`).join("\n")}\n\nSubtotal: ${fmt(t)}\n\nPlease confirm availability and delivery. Thank you!`)}">Complete order on WhatsApp</a></div>`
    : `<div class="em"><p>Your bag is empty.</p><a class="btn bk" href="shop.html">Browse the collection</a></div>`;
}
function setDr(o) {
  const was = $("#dr").classList.contains("open");
  ["#dr", "#bd"].forEach(s => $(s).classList.toggle("open", !!o));
  $("#dr").setAttribute("aria-hidden", !o);
  root.classList.toggle("lock", !!o || $("#mm").classList.contains("open"));
  if (o) $("#dc").focus(); else if (was) $("#cb").focus();
}
function setMenu(o) {
  const m = $("#mm"), b = $(".mbtn");
  m.classList.toggle("open", !!o); b.setAttribute("aria-expanded", !!o); b.textContent = o ? "Close" : "Menu";
  root.classList.toggle("lock", !!o || $("#dr").classList.contains("open"));
  if (o) m.style.paddingTop = $("#hd").getBoundingClientRect().bottom + 16 + "px";
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
  cur = n; $("#pg2").style.width = (n + 1) / sl.length * 100 + "%";
}

/* ---------- Product page ---------- */
const pp = $("#pp");
const size = () => { const b = $("[data-a=sz][aria-pressed=true]"); return b ? b.dataset.s : ""; };
let qty = 1;
function updateProduct() {
  $("#qv").textContent = qty;
  $("#wa1").href = wa(`Hello Elite Touch Collections 👋\n\nI'm interested in: ${pp.dataset.name}\nSize: ${size()}\nPrice: ${fmt(+pp.dataset.price)}\n\nIs this available?`);
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
    i.q += +t.dataset.d; cart = cart.filter(x => x.q > 0); save(); drawer();
  }
  else if (a === "sz") { $$("[data-a=sz]").forEach(b => b.setAttribute("aria-pressed", b === t)); updateProduct(); }
  else if (a === "pq") { qty = Math.max(1, qty + +t.dataset.d); updateProduct(); }
  else if (a === "th") {
    $$("[data-a=th]").forEach(b => b.setAttribute("aria-pressed", b === t));
    const img = $("#mi"); img.src = t.dataset.src; img.style.animation = "none"; void img.offsetWidth; img.style.animation = "";
  }
  else if (a === "add") {
    const d = pp.dataset, s = size(), h = cart.find(i => i.id === d.id && i.s === s);
    h ? h.q += qty : cart.push({ id: d.id, n: d.name, p: +d.price, img: d.img, s, q: qty });
    save(); drawer(); setDr(1);
  }
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") { setDr(0); setMenu(0); }
  if (e.target.closest && e.target.closest(".ed")) { if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); }
  const d = $("#dr");
  if (e.key === "Tab" && d.classList.contains("open")) {
    const f = $$("a,button", d), x = f[0], z = f[f.length - 1];
    if (e.shiftKey && document.activeElement === x) { e.preventDefault(); z.focus(); }
    else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); x.focus(); }
  }
});

/* ---------- Shop filters ---------- */
const grid = $("#grid");
if (grid) {
  const items = $$("#grid>li"), bands = [() => true, x => x < 380, x => x >= 380 && x <= 420, x => x > 420];
  const apply = () => {
    const s = $("#fs").value, b = +$("#fb").value, o = $("#fo").value;
    const vis = items.filter(li => { const ok = (!s || li.dataset.sizes.split(",").includes(s)) && bands[b](+li.dataset.price); li.hidden = !ok; return ok; });
    vis.sort((x, y) => o === "low" ? x.dataset.price - y.dataset.price : o === "high" ? y.dataset.price - x.dataset.price : x.dataset.i - y.dataset.i);
    vis.forEach(li => grid.append(li)); $("#none").hidden = vis.length > 0;
  };
  $$(".fl select").forEach(s => s.addEventListener("change", apply));
}

/* ---------- Contact form -> WhatsApp ---------- */
const cf = $("#cf");
if (cf) cf.addEventListener("submit", e => {
  e.preventDefault();
  open(wa(`Hello Elite Touch Collections 👋\n\n${$("#cm").value}\n\n— ${$("#cn").value}`), "_blank", "noopener,noreferrer");
});

/* ---------- Animations ---------- */
const mt = $(".mt");
if (mt) $$("a", mt).forEach(a => { const c = a.cloneNode(true); c.setAttribute("aria-hidden", "true"); c.tabIndex = -1; mt.append(c); }); // repeat strip for a seamless loop
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -60px" });
$$(".hd,.sec>h2.d,.pgrid>li,.fq>div,.gr>li,.rw").forEach(e => {
  e.classList.add("rv");
  e.style.transitionDelay = Math.min($$(":scope>*", e.parentNode).indexOf(e), 5) * 80 + "ms";
  io.observe(e);
});
addEventListener("scroll", () => $("#hd").classList.toggle("sc", scrollY > 8), { passive: true });
if ($("#pg2")) $("#pg2").style.width = 100 / $$(".sl").length + "%";
if (pp) updateProduct();
drawer();
})();
