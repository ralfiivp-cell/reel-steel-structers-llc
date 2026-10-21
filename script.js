/* =====================================================================
   PRICING CONFIG  —  PLACEHOLDER VALUES ONLY
   ---------------------------------------------------------------------
   These numbers are NOT Reel Steel Constructions LLC's real prices.
   The client has not provided pricing yet. They are generic placeholder
   rates so the calculator works for demo purposes. Replace every value
   below with real rates before publishing.
   All money values are USD, installed.
   ===================================================================== */
const PRICING = {
  // Roof/frame cost per square foot of footprint, by style (placeholder)
  styles: {
    regular:  { roofPerSqFt: 8 },   // rounded-roof carport
    aframe:   { roofPerSqFt: 10 },  // A-frame / boxed-eave carport
    vertical: { roofPerSqFt: 12 },  // vertical-roof carport
    leanto:   { roofPerSqFt: 12, leanToWidth: 12, leanToPerSqFt: 7 }, // main + one lean-to
    garage:   { roofPerSqFt: 12, forceEnclosure: "full" },
    barn:     { roofPerSqFt: 14, forceEnclosure: "full" },
    rv:       { roofPerSqFt: 11, minHeight: 12 },
    shop:     { roofPerSqFt: 13, forceEnclosure: "full", minWidth: 24 },
  },
  baseLegHeight: 6,              // ft included in base rate
  extraHeightPerFtPerLinFt: 5,   // $ per extra ft of leg height, per linear ft of length (both sides)
  wallPerSqFt: 4.5,              // sheeting for side/end walls
  gauge12Multiplier: 1.15,       // 12-gauge upgrade applied to frame + roof
  rollUpDoor: 1400,              // each, approx 10x10
  walkInDoor: 550,               // each
  window: 325,                   // each
  anchorPerLeg: { ground: 15, asphalt: 30, concrete: 25 }, // per leg
  legSpacingFt: 5,               // legs every N ft per side
  minimumJob: 1800,
  range: { low: 0.9, high: 1.2 } // shown range around computed price
};

/* ===================== STYLE IDEAS (cards + calculator options) ===================== */
const STYLES = [
  { id: "regular",  name: "Regular (Rounded-Roof) Carport", sizes: "12'–24' W × 20'–40' L, 6'–12' legs",
    desc: "The classic, budget-friendly option. Rounded eaves and horizontal roof panels. Great for cars, equipment and mild climates.",
    icon: "regular" },
  { id: "aframe",   name: "A-Frame (Boxed-Eave) Carport", sizes: "12'–30' W × 20'–50' L, 6'–14' legs",
    desc: "A peaked roof with boxed eaves for a cleaner, house-like look. Horizontal panels with a more finished appearance.",
    icon: "aframe" },
  { id: "vertical", name: "Vertical-Roof Carport", sizes: "12'–30' W × 20'–60' L, 6'–16' legs",
    desc: "Roof panels run top to bottom so rain and snow slide off. Our go-to recommendation for Pacific Northwest weather.",
    icon: "vertical" },
  { id: "leanto",   name: "Carport with Lean-To", sizes: "18'–30' main + 10'–12' lean-to",
    desc: "A main structure with an attached lower-slope lean-to on one side. Extra covered space for tractors, firewood or a second vehicle.",
    icon: "leanto" },
  { id: "garage",   name: "Enclosed Garage", sizes: "20'–30' W × 20'–50' L, 8'–14' legs",
    desc: "Fully enclosed steel garage with roll-up and walk-in doors and windows. Secure, weather-tight vehicle and storage space.",
    icon: "garage" },
  { id: "barn",     name: "Barn / Gambrel Style", sizes: "10'–40' W × 12'–60' L",
    desc: "Traditional barn profile with extra headroom and loft space. Perfect as a storage shed, workshop or small farm barn.",
    icon: "barn" },
  { id: "rv",       name: "RV / Boat Cover", sizes: "12'–24' W × 30'–50' L, 12'–16' legs",
    desc: "Tall, long covers that protect motorhomes, trailers and boats from sun, rain and snow. Can be partly or fully enclosed.",
    icon: "rv" },
  { id: "shop",     name: "Steel Shop / Workshop", sizes: "24'–60' W × 30'–100' L, 10'–16' legs",
    desc: "Wide-span steel buildings for work, storage or business. Multiple roll-up doors, walk-in doors and windows as needed.",
    icon: "shop" },
];

/* Simple SVG silhouettes for each style */
const ICONS = {
  regular:  '<path d="M10 70 V36 Q10 26 22 24 L98 24 Q110 26 110 36 V70" /><path d="M10 70 h100" class="ground"/>',
  aframe:   '<path d="M10 70 V36 L60 16 L110 36 V70" /><path d="M10 36 h100" /><path d="M10 70 h100" class="ground"/>',
  vertical: '<path d="M10 70 V36 L60 16 L110 36 V70" /><path d="M30 28 V36 M45 22 V36 M60 16 V36 M75 22 V36 M90 28 V36" /><path d="M10 70 h100" class="ground"/>',
  leanto:   '<path d="M10 70 V34 L50 16 L90 34 V70" /><path d="M90 40 L114 48 V70" /><path d="M6 70 h112" class="ground"/>',
  garage:   '<path d="M14 70 V34 L60 14 L106 34 V70 Z" class="fill"/><rect x="26" y="42" width="34" height="28" class="door"/><rect x="72" y="46" width="14" height="24" class="door"/><path d="M6 70 h108" class="ground"/>',
  barn:     '<path d="M22 70 V38 L32 22 L60 12 L88 22 L98 38 V70 Z" class="fill"/><rect x="50" y="20" width="20" height="10" class="door"/><rect x="44" y="44" width="32" height="26" class="door"/><path d="M6 70 h108" class="ground"/>',
  rv:       '<path d="M6 70 V26 L60 10 L114 26 V70" /><rect x="22" y="44" width="70" height="20" rx="4" class="door"/><circle cx="38" cy="66" r="4" class="door"/><circle cx="76" cy="66" r="4" class="door"/><path d="M4 70 h112" class="ground"/>',
  shop:     '<path d="M4 70 V32 L60 16 L116 32 V70 Z" class="fill"/><rect x="12" y="44" width="22" height="26" class="door"/><rect x="40" y="44" width="22" height="26" class="door"/><rect x="68" y="44" width="22" height="26" class="door"/><rect x="98" y="52" width="10" height="18" class="door"/><path d="M2 70 h116" class="ground"/>',
};

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* ===================== STYLE CARDS ===================== */
function renderStyles() {
  const grid = $("#style-grid");
  grid.innerHTML = STYLES.map((s) => `
    <article class="style-card">
      <div class="style-icon"><svg viewBox="0 0 120 80" aria-hidden="true">${ICONS[s.icon]}</svg></div>
      <h3>${s.name}</h3>
      <p>${s.desc}</p>
      <p class="sizes"><span>Typical sizes</span>${s.sizes}</p>
      <button type="button" class="link-btn" data-style="${s.id}">Estimate this style &rarr;</button>
    </article>`).join("");
  grid.addEventListener("click", (e) => {
    const b = e.target.closest("[data-style]");
    if (!b) return;
    $("#c-style").value = b.dataset.style;
    calculate();
    $("#quote").scrollIntoView({ behavior: "smooth" });
  });
}

/* ===================== CALCULATOR ===================== */
function readInputs() {
  const int = (id) => Math.max(0, parseInt($(id).value, 10) || 0);
  return {
    style: $("#c-style").value,
    width: +$("#c-width").value,
    length: +$("#c-length").value,
    height: +$("#c-height").value,
    gauge: $("#c-gauge").value,
    enclosure: ($('input[name="enclosure"]:checked') || {}).value || "open",
    rollup: int("#c-rollup"),
    walk: int("#c-walk"),
    windows: int("#c-windows"),
    anchor: $("#c-anchor").value,
  };
}

function estimate(v) {
  const st = PRICING.styles[v.style];
  const notes = [];
  let width = v.width, height = v.height, enclosure = v.enclosure;
  if (st.minWidth && width < st.minWidth) { width = st.minWidth; notes.push(`Minimum width for this style is ${st.minWidth}'.`); }
  if (st.minHeight && height < st.minHeight) { height = st.minHeight; notes.push(`Using ${st.minHeight}' minimum leg height for this style.`); }
  if (st.forceEnclosure) enclosure = st.forceEnclosure;

  const lines = [];
  const area = width * v.length;
  let structure = area * st.roofPerSqFt;
  lines.push([`Frame & roof (${width}' × ${v.length}')`, area * st.roofPerSqFt]);

  if (st.leanToWidth) {
    const lt = st.leanToWidth * v.length * st.leanToPerSqFt;
    structure += lt;
    lines.push([`Lean-to (${st.leanToWidth}' × ${v.length}')`, lt]);
  }

  const extraH = Math.max(0, height - PRICING.baseLegHeight);
  if (extraH) {
    const h = extraH * v.length * 2 * PRICING.extraHeightPerFtPerLinFt;
    structure += h;
    lines.push([`Leg height ${height}'`, h]);
  }

  if (v.gauge === "12") {
    const g = structure * (PRICING.gauge12Multiplier - 1);
    lines.push(["12-gauge framing upgrade", g]);
    structure += g;
  }

  // Wall sheeting
  const side = v.length * height, end = width * height + (width * width) / 8; // end wall incl. rough gable
  const wallArea = { open: 0, oneSide: side, bothSides: side * 2, full: side * 2 + end * 2 }[enclosure];
  const walls = wallArea * PRICING.wallPerSqFt;
  if (walls) lines.push([`Walls (${{ oneSide: "one side", bothSides: "both sides", full: "fully enclosed" }[enclosure]})`, walls]);

  const doors = v.rollup * PRICING.rollUpDoor + v.walk * PRICING.walkInDoor + v.windows * PRICING.window;
  if (v.rollup) lines.push([`Roll-up doors × ${v.rollup}`, v.rollup * PRICING.rollUpDoor]);
  if (v.walk) lines.push([`Walk-in doors × ${v.walk}`, v.walk * PRICING.walkInDoor]);
  if (v.windows) lines.push([`Windows × ${v.windows}`, v.windows * PRICING.window]);
  if (doors && enclosure === "open") notes.push("Doors and windows need walls; consider an enclosed option.");

  const legs = (Math.ceil(v.length / PRICING.legSpacingFt) + 1) * 2 + (st.leanToWidth ? Math.ceil(v.length / PRICING.legSpacingFt) + 1 : 0);
  const anchors = legs * PRICING.anchorPerLeg[v.anchor];
  lines.push([`Anchoring (${v.anchor}, ~${legs} legs)`, anchors]);

  let total = structure + walls + doors + anchors;
  if (total < PRICING.minimumJob) { notes.push("Minimum project price applied."); total = PRICING.minimumJob; }

  return { total, low: total * PRICING.range.low, high: total * PRICING.range.high, lines, notes, width, height, enclosure, forced: !!st.forceEnclosure };
}

const money = (n) => "$" + (Math.round(n / 50) * 50).toLocaleString("en-US");

function calculate() {
  const v = readInputs();
  const r = estimate(v);
  $("#o-width").textContent = v.width + "'";
  $("#o-length").textContent = v.length + "'";
  $("#o-height").textContent = v.height + "'";

  // lock enclosure for always-enclosed styles
  $$('input[name="enclosure"]').forEach((el) => {
    el.disabled = r.forced && el.value !== "full";
    if (r.forced && el.value === "full") el.checked = true;
  });

  $("#r-price").innerHTML = `${money(r.low)} &ndash; ${money(r.high)}`;
  const styleName = STYLES.find((s) => s.id === v.style).name;
  $("#r-size").textContent = `${styleName} · ${r.width}' W × ${v.length}' L × ${r.height}' H · ${v.gauge}-ga`;
  $("#r-breakdown").innerHTML = r.lines.map(([k, n]) => `<li><span>${k}</span><span>${money(n)}</span></li>`).join("");
  const hint = $("#calc-hint");
  hint.hidden = !r.notes.length;
  hint.textContent = r.notes.join(" ");
  return { v, r, styleName };
}

function initCalculator() {
  $("#c-style").innerHTML = STYLES.map((s) => `<option value="${s.id}">${s.name}</option>`).join("");
  $("#calc-form").addEventListener("input", calculate);
  $("#calc-form").addEventListener("change", calculate);
  $("#send-estimate").addEventListener("click", () => {
    const { v, r, styleName } = calculate();
    const encl = { open: "Open", oneSide: "One side enclosed", bothSides: "Both sides enclosed", full: "Fully enclosed" }[r.enclosure];
    $("#f-msg").value =
      `Interested in: ${styleName}\nSize: ${r.width}' W x ${v.length}' L x ${r.height}' leg height\n` +
      `Gauge: ${v.gauge} | Enclosure: ${encl} | Anchoring: ${v.anchor}\n` +
      `Roll-up doors: ${v.rollup} | Walk-in doors: ${v.walk} | Windows: ${v.windows}\n` +
      `Online estimate: ${money(r.low)} - ${money(r.high)}`;
  });
  calculate();
}

/* ===================== GALLERY LIGHTBOX ===================== */
function initLightbox() {
  const items = $$(".g-item");
  const lb = $("#lightbox"), img = $("#lb-img"), cap = $("#lb-cap");
  let i = 0;
  const show = (n) => {
    i = (n + items.length) % items.length;
    const src = $("img", items[i]);
    img.src = src.src; img.alt = src.alt;
    cap.textContent = $("figcaption", items[i]).textContent;
  };
  const open = (n) => { show(n); lb.hidden = false; document.body.style.overflow = "hidden"; $(".lb-close").focus(); };
  const close = () => { lb.hidden = true; document.body.style.overflow = ""; };
  items.forEach((el, n) => {
    el.tabIndex = 0;
    el.addEventListener("click", () => open(n));
    el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(n); } });
  });
  $(".lb-close").addEventListener("click", close);
  $(".lb-prev").addEventListener("click", () => show(i - 1));
  $(".lb-next").addEventListener("click", () => show(i + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(i - 1);
    if (e.key === "ArrowRight") show(i + 1);
  });
}

/* ===================== NAV + CONTACT FORM ===================== */
function initNav() {
  const btn = $(".nav-toggle"), nav = $("#site-nav");
  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", open);
  });
  $$("#site-nav a").forEach((a) => a.addEventListener("click", () => { nav.classList.remove("open"); btn.setAttribute("aria-expanded", false); }));
  const header = $(".site-header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function initContact() {
  // Front-end only: no data is sent anywhere yet. Connect a form service later.
  const form = $("#contact-form"), status = $("#form-status");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.name.value.trim(), email = form.email.value.trim();
    if (!name || !/^\S+@\S+\.\S+$/.test(email)) {
      status.textContent = "Please enter your name and a valid email.";
      status.className = "form-status full error";
      return;
    }
    status.textContent = `Thanks, ${name}! (Demo form: not connected yet; nothing was sent.)`;
    status.className = "form-status full ok";
    form.reset();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  $("#year").textContent = new Date().getFullYear();
  renderStyles();
  initCalculator();
  initLightbox();
  initNav();
  initContact();
});
