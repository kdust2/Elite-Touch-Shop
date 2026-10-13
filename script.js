/* Elite Touch Collections - behaviour (cart, menu, slider, filters, animations).
   Page content loaded dynamically from _data/products.json for Decap CMS compatibility. */
(async () => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const NUMBER = "233531331640"; // WhatsApp number (no +)
  const fmt = n => "₵" + Number(n).toLocaleString("en-GH");
  const wa = m => `https://wa.me/${NUMBER}?text=${encodeURIComponent(m)}`;
  const root = document.documentElement;

  const getImgSrc = (src) => {
    if (!src) return "";
    if (src.startsWith("http://") || src.startsWith("https://")) return src;
    return src.replace(/^\/+/, "");
  };

  const getSizesList = (sizes) => {
    if (!sizes) return [];
    if (Array.isArray(sizes)) {
      return sizes.map(s => (typeof s === "object" && s !== null && s.size ? s.size : String(s).trim())).filter(Boolean);
    }
    return [String(sizes).trim()];
  };

  /* ---------- Cart (saved in the browser) ---------- */
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem("etc-cart")) || []; } catch (e) {}
  const save = () => { try { localStorage.setItem("etc-cart", JSON.stringify(cart)); } catch (e) {} };

  function drawer() {
    const n = cart.reduce((s, i) => s + i.q, 0);
    const t = cart.reduce((s, i) => s + i.p * i.q, 0);
    const cb = $("#cb");
    if (cb) {
      cb.innerHTML = `Bag <b>${n}</b>`;
      cb.setAttribute("aria-label", `Open bag, ${n} items`);
      if (n) $("b", cb).classList.add("bp");
    }
    const db = $("#db");
    if (!db) return;
    db.innerHTML = cart.length
      ? `<ul class="dl">${cart.map(i => `<li><div class="mat"><img class="cv" src="${getImgSrc(i.img)}" alt="${i.n}"></div><div class="mt2"><div><p class="d" style="font-size:1.05rem">${i.n}</p><p style="opacity:.6">Size ${i.s}</p></div><div style="display:flex;justify-content:space-between;align-items:center"><div class="qt"><button data-a="cq" data-id="${i.id}" data-s="${i.s}" data-d="-1" aria-label="Decrease quantity">−</button><span>${i.q}</span><button data-a="cq" data-id="${i.id}" data-s="${i.s}" data-d="1" aria-label="Increase quantity">+</button></div><span>${fmt(i.p * i.q)}</span></div><button data-a="cq" data-id="${i.id}" data-s="${i.s}" data-d="-99" style="align-self:flex-start;text-decoration:underline;font-size:12px">Remove</button></div></li>`).join("")}</ul><div class="df"><p><span>Subtotal</span><span>${fmt(t)}</span></p><a class="btn bk" target="_blank" rel="noopener noreferrer" href="${wa(`Hello Elite Touch Collections 👋\n\nI'd like to place an order:\n\n${cart.map((i, k) => `${k + 1}. ${i.n} — Size: ${i.s} — Qty: ${i.q} — ${fmt(i.p * i.q)}`).join("\n")}\n\nSubtotal: ${fmt(t)}\n\nPlease confirm availability and delivery. Thank you!`)}">Complete order on WhatsApp</a></div>`
      : `<div class="em"><p>Your bag is empty.</p><a class="btn bk" href="shop.html">Browse the collection</a></div>`;
  }

  function setDr(o) {
    const dr = $("#dr");
    if (!dr) return;
    const was = dr.classList.contains("open");
    ["#dr", "#bd"].forEach(s => { const el = $(s); if (el) el.classList.toggle("open", !!o); });
    dr.setAttribute("aria-hidden", !o);
    root.classList.toggle("lock", !!o || ($("#mm") && $("#mm").classList.contains("open")));
    if (o && $("#dc")) $("#dc").focus();
    else if (was && $("#cb")) $("#cb").focus();
  }

  function setMenu(o) {
    const m = $("#mm"), b = $(".mbtn");
    if (!m || !b) return;
    m.classList.toggle("open", !!o);
    b.setAttribute("aria-expanded", !!o);
    b.textContent = o ? "Close" : "Menu";
    root.classList.toggle("lock", !!o || ($("#dr") && $("#dr").classList.contains("open")));
    if (o && $("#hd")) m.style.paddingTop = $("#hd").getBoundingClientRect().bottom + 16 + "px";
  }

  /* ---------- Home slider ---------- */
  let cur = 0;
  function go(d) {
    const sl = $$(".sl"), caps = $$(".ecap");
    if (!sl.length) return;
    const n = (cur + d + sl.length) % sl.length;
    const a = sl[cur], b = sl[n];
    b.className = "sl nt " + (d > 0 ? "pre" : "post");
    void b.offsetWidth;
    b.className = "sl on";
    a.className = "sl " + (d > 0 ? "post" : "pre");
    sl.forEach((s, i) => { s.tabIndex = i === n ? 0 : -1; s.setAttribute("aria-hidden", i !== n); });
    caps.forEach((c, i) => c.classList.toggle("on", i === n));
    cur = n;
    const pg2 = $("#pg2");
    if (pg2) pg2.style.width = ((n + 1) / sl.length * 100) + "%";
  }

  /* ---------- Product page state & helpers ---------- */
  const pp = $("#pp");
  const size = () => { const b = $("[data-a=sz][aria-pressed=true]"); return b ? b.dataset.s : ""; };
  let qty = 1;

  function updateProduct() {
    if (!pp) return;
    const qv = $("#qv");
    if (qv) qv.textContent = qty;
    const wa1 = $("#wa1");
    if (wa1) {
      const isSoldOut = pp.dataset.soldOut === "true";
      const soldOutNote = isSoldOut ? " (Note: currently marked sold out on the site)" : "";
      wa1.href = wa(`Hello Elite Touch Collections 👋\n\nI'm interested in: ${pp.dataset.name}\nSize: ${size()}\nPrice: ${fmt(+pp.dataset.price)}${soldOutNote}\n\nIs this available?`);
    }
  }

  /* ---------- Clicks ---------- */
  document.addEventListener("click", e => {
    const t = e.target.closest("[data-a]");
    if (!t) return;
    const a = t.dataset.a;
    if (a === "cart") setDr(1);
    else if (a === "close") setDr(0);
    else if (a === "menu") setMenu(!$("#mm").classList.contains("open"));
    else if (a === "en") go(1);
    else if (a === "ep") go(-1);
    else if (a === "faq") {
      const fq = t.closest(".fq>div");
      if (fq) {
        const o = fq.classList.toggle("open");
        t.setAttribute("aria-expanded", o);
      }
    }
    else if (a === "cq") {
      const i = cart.find(x => x.id === t.dataset.id && x.s === t.dataset.s);
      if (i) {
        i.q += +t.dataset.d;
        cart = cart.filter(x => x.q > 0);
        save();
        drawer();
      }
    }
    else if (a === "sz") {
      if (t.disabled) return;
      $$("[data-a=sz]").forEach(b => b.setAttribute("aria-pressed", b === t));
      updateProduct();
    }
    else if (a === "pq") {
      qty = Math.max(1, qty + +t.dataset.d);
      updateProduct();
    }
    else if (a === "th") {
      $$("[data-a=th]").forEach(b => b.setAttribute("aria-pressed", b === t));
      const img = $("#mi");
      if (img) {
        img.src = t.dataset.src;
        img.style.animation = "none";
        void img.offsetWidth;
        img.style.animation = "";
      }
    }
    else if (a === "add") {
      if (t.disabled || pp.dataset.soldOut === "true") return;
      const d = pp.dataset, s = size(), h = cart.find(i => i.id === d.id && i.s === s);
      h ? h.q += qty : cart.push({ id: d.id, n: d.name, p: +d.price, img: d.img, s, q: qty });
      save();
      drawer();
      setDr(1);
    }
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") { setDr(0); setMenu(0); }
    if (e.target.closest && e.target.closest(".ed")) {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    }
    const d = $("#dr");
    if (e.key === "Tab" && d && d.classList.contains("open")) {
      const f = $$("a,button", d), x = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === x) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); x.focus(); }
    }
  });

  /* ---------- Shop filters setup ---------- */
  function setupFilters() {
    const grid = $("#grid");
    if (!grid) return;
    const items = $$("#grid>li");
    const bands = [() => true, x => x < 380, x => x >= 380 && x <= 420, x => x > 420];
    const apply = () => {
      const s = $("#fs") ? $("#fs").value : "";
      const b = $("#fb") ? +$("#fb").value : 0;
      const o = $("#fo") ? $("#fo").value : "new";
      const vis = items.filter(li => {
        const sizes = li.dataset.sizes ? li.dataset.sizes.split(",").filter(Boolean) : [];
        const ok = (!s || sizes.includes(s)) && bands[b](+li.dataset.price);
        li.hidden = !ok;
        return ok;
      });
      vis.sort((x, y) => o === "low" ? x.dataset.price - y.dataset.price : o === "high" ? y.dataset.price - x.dataset.price : x.dataset.i - y.dataset.i);
      vis.forEach(li => grid.append(li));
      const none = $("#none");
      if (none) none.hidden = vis.length > 0;
    };
    $$(".fl select").forEach(s => {
      s.onchange = apply;
    });
  }

  /* ---------- Contact form -> WhatsApp ---------- */
  const cf = $("#cf");
  if (cf) cf.addEventListener("submit", e => {
    e.preventDefault();
    open(wa(`Hello Elite Touch Collections 👋\n\n${$("#cm").value}\n\n— ${$("#cn").value}`), "_blank", "noopener,noreferrer");
  });

  /* ---------- Dynamic data rendering from _data/products.json ---------- */
  async function renderData() {
    let products = [];
    try {
      const res = await fetch('_data/products.json');
      if (res.ok) {
        const data = await res.json();
        products = Array.isArray(data) ? data : (data.products || []);
      }
    } catch (err) {
      console.warn("Could not load products.json:", err);
    }

    if (!products.length) return;

    // 1. Shop grid
    const shopGrid = $("#grid");
    if (shopGrid) {
      const category = document.body.dataset.category;
      const filtered = category ? products.filter(p => p.category === category) : products;
      shopGrid.innerHTML = filtered.map((p, i) => `
        <li data-price="${p.price}" data-sizes="${getSizesList(p.sizes).join(',')}" data-i="${i}">
          <a class="card" href="product.html?id=${encodeURIComponent(p.id)}">
            <div class="mat p45">
              <img src="${getImgSrc(p.image)}" alt="${p.name}">
              ${p.soldOut ? '<span class="soldout">Sold out</span>' : ''}
            </div>
            <div class="cap"><h3>${p.name}</h3><span>${fmt(p.price)}</span></div>
          </a>
        </li>`).join('');
      setupFilters();
    }

    // 2. Home slider
    const stage = $(".stage");
    const edt = $("#edt");
    if (stage) {
      const featured = products.slice(0, 6);
      stage.innerHTML = featured.map((p, i) => `
        <a class="sl ${i === 0 ? 'on' : 'pre'}" href="product.html?id=${encodeURIComponent(p.id)}" aria-label="${p.name}">
          <img src="${getImgSrc(p.image)}" alt="">
        </a>`).join('');

      if (edt) {
        edt.innerHTML = featured.map((p, i) => {
          const num = String(i + 1).padStart(2, '0');
          const total = String(featured.length).padStart(2, '0');
          return `
            <div class="ecap ${i === 0 ? 'on' : ''}">
              <p class="lb">${num} / ${total}</p>
              <h3 class="d">${p.name}</h3>
              <p class="pr">${fmt(p.price)}</p>
              <p class="ed-d">${p.description || ''}</p>
              <a class="btn bk" href="product.html?id=${encodeURIComponent(p.id)}">View dress</a>
            </div>
          `;
        }).join('');
      }

      const pg2 = $("#pg2");
      if (pg2) pg2.style.width = (100 / (featured.length || 1)) + "%";
      cur = 0;
    }

    // 3. New arrivals strip
    const mt = $(".mt");
    if (mt) {
      mt.innerHTML = products.map(p => `
        <a href="product.html?id=${encodeURIComponent(p.id)}">
          <div class="mat p45">
            <img src="${getImgSrc(p.image)}" alt="${p.name}">
            ${p.soldOut ? '<span class="soldout">Sold out</span>' : ''}
          </div>
          <p class="cap"><span style="font:1.05rem var(--fd)">${p.name}</span><span>${fmt(p.price)}</span></p>
        </a>`).join('');

      $$("a", mt).forEach(a => {
        const c = a.cloneNode(true);
        c.setAttribute("aria-hidden", "true");
        c.tabIndex = -1;
        mt.append(c);
      });
    }

    // 4. More from the collection (home grid)
    const gr = $(".gr");
    if (gr) {
      gr.innerHTML = products.slice(0, 6).map(p => `
        <li>
          <a href="product.html?id=${encodeURIComponent(p.id)}" aria-label="${p.name}">
            <div class="mat sq"><img class="cv" src="${getImgSrc(p.image)}" alt="${p.name}"></div>
          </a>
        </li>
      `).join('');
    }

    // 5. Shop by style piece counts
    const cr2List = $$(".rw .cr2");
    if (cr2List.length) {
      const counts = {};
      products.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1; });
      cr2List.forEach(link => {
        const href = link.getAttribute("href") || "";
        const m = href.match(/shop-(casual|occasion|boubou|two-piece)\.html/);
        if (m) {
          const count = counts[m[1]] || 0;
          const lb = link.querySelector(".lb");
          if (lb) lb.textContent = `${count} ${count === 1 ? 'piece' : 'pieces'}`;
        }
      });
    }

    // 6. Unified product page (#pp)
    if (pp) {
      const params = new URLSearchParams(location.search);
      const id = params.get('id');
      const p = (id ? products.find(x => x.id === id) : null) || products[0];

      if (p) {
        document.title = p.name + ' | Elite Touch Collections';
        const metaDesc = $('meta[name="description"]');
        if (metaDesc) metaDesc.content = p.description || p.name;

        pp.dataset.id = p.id;
        pp.dataset.name = p.name;
        pp.dataset.price = p.price;
        pp.dataset.img = getImgSrc(p.image);
        pp.dataset.soldOut = p.soldOut ? "true" : "false";

        const mi = $("#mi");
        if (mi) {
          mi.src = getImgSrc(p.image);
          mi.alt = p.name;
        }

        const h1 = $("h1", pp) || document.querySelector("h1");
        if (h1) h1.textContent = p.name;

        const pr = $(".pr", pp);
        if (pr) pr.textContent = fmt(p.price);

        const pdesc = $("#pdesc");
        if (pdesc) pdesc.textContent = p.description || "";

        const pfab = $("#pfab");
        const pfabBox = $("#pfab-box");
        if (pfab) {
          pfab.textContent = p.fabric || "";
          if (pfabBox) pfabBox.style.display = p.fabric ? "" : "none";
        }

        // Sizes buttons
        const psz = $("#psz");
        if (psz) {
          const allSizes = ["XS", "S", "M", "L", "XL", "XXL"];
          const availableSizes = getSizesList(p.sizes);
          let firstSelected = false;

          psz.innerHTML = allSizes.map(s => {
            const isAvail = availableSizes.length ? availableSizes.includes(s) : true;
            const isSelected = isAvail && !firstSelected;
            if (isSelected) firstSelected = true;
            return `<button data-a="sz" data-s="${s}" aria-pressed="${isSelected}" ${isAvail ? '' : 'disabled'}>${s}</button>`;
          }).join('');
        }

        // Sold out badge and button
        const pmat = $("#pmat") || $(".pm .mat");
        if (pmat) {
          const existingBadge = pmat.querySelector(".soldout");
          if (existingBadge) existingBadge.remove();
          if (p.soldOut) {
            const badge = document.createElement("span");
            badge.className = "soldout";
            badge.textContent = "Sold out";
            pmat.prepend(badge);
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

        // Related items
        const prelated = $("#prelated");
        if (prelated) {
          const others = products.filter(x => x.id !== p.id).slice(0, 4);
          prelated.innerHTML = others.map(r => `
            <li>
              <a class="card" href="product.html?id=${encodeURIComponent(r.id)}">
                <div class="mat p45">
                  <img src="${getImgSrc(r.image)}" alt="${r.name}">
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

    // Scroll reveal observer on newly created elements
    $$(".pgrid>li, .gr>li").forEach((e, i) => {
      e.classList.add("rv");
      e.style.transitionDelay = (i % 6) * 80 + "ms";
      io.observe(e);
    });
  }

  /* ---------- Animations & Scroll Observer ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("in");
      io.unobserve(e.target);
    }
  }), { rootMargin: "0px 0px -60px" });

  $$(".hd, .sec>h2.d, .pgrid>li, .fq>div, .gr>li, .rw").forEach((e, i) => {
    e.classList.add("rv");
    e.style.transitionDelay = Math.min(i, 5) * 80 + "ms";
    io.observe(e);
  });

  addEventListener("scroll", () => $("#hd") && $("#hd").classList.toggle("sc", scrollY > 8), { passive: true });

  await renderData();
  drawer();
})();
