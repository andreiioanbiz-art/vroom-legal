/**
 * La interacción de la landing, sin React.
 *
 * El export original traía React y ReactDOM de unpkg (unos 130 KB) para mover
 * tres cosas: el acordeón de las FAQ, el selector de plan y el abanico de
 * móviles del hero. Esto hace lo mismo en JS plano y sin dependencias.
 */
(() => {
  "use strict";

  /* ------------------------------------------------------------- FAQ */

  document.querySelectorAll(".faq-q").forEach((btn) => {
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      const panel = document.getElementById(btn.getAttribute("aria-controls"));
      if (panel) panel.hidden = open;
    });
  });

  /* ----------------------------------------------------- Selector de plan */

  const PLANS = {
    monthly: { price: "4,99 €", unit: "al mes", note: "Cancela cuando quieras." },
    lifetime: { price: "12,99 €", unit: "una vez", note: "Sin suscripción ni renovaciones." },
  };

  const segs = document.querySelectorAll(".seg[data-plan]");
  const slots = {
    price: document.querySelector("[data-plan-price]"),
    unit: document.querySelector("[data-plan-unit]"),
    note: document.querySelector("[data-plan-note]"),
  };

  segs.forEach((seg) => {
    seg.addEventListener("click", () => {
      const plan = PLANS[seg.dataset.plan];
      if (!plan) return;
      segs.forEach((s) => s.setAttribute("aria-pressed", String(s === seg)));
      if (slots.price) slots.price.textContent = plan.price;
      if (slots.unit) slots.unit.textContent = plan.unit;
      if (slots.note) slots.note.textContent = plan.note;
    });
  });

  /* --------------------------------------------- Abanico de móviles (hero) */

  /**
   * Los cinco móviles arrancan apilados en el centro y se abren conforme
   * avanza el scroll dentro del track. Cada uno tiene su ventana de progreso,
   * por eso se despliegan escalonados y no todos a la vez.
   */
  const FAN_WINDOWS = [[0, 0.44], [0.11, 0.58], [0.22, 0.7], [0.33, 0.84], [0.44, 1]];
  const easeFan = (t) => 1 - Math.pow(1 - t, 3);
  const clamp01 = (t) => (t < 0 ? 0 : t > 1 ? 1 : t);

  const row = document.querySelector("[data-fan-row]");
  const track = document.querySelector("[data-fan-track]");
  if (!row || !track) return;

  const items = Array.prototype.slice.call(row.children);
  let geo = null;
  let frame = 0;

  /** Distancia de cada móvil al centro de la fila, ya desplegada. */
  function measure() {
    items.forEach((el) => {
      el.style.transform = "none";
      if (el.firstElementChild) el.firstElementChild.style.transform = "none";
    });
    const rect = row.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    geo = items.map((el) => {
      const r = el.getBoundingClientRect();
      return cx - (r.left + r.width / 2);
    });
    apply();
  }

  function apply(forced) {
    if (!geo) return;
    const sticky = row.parentElement;
    const span = Math.max(240, track.offsetHeight - sticky.offsetHeight);
    const p = forced != null ? forced : clamp01(-track.getBoundingClientRect().top / span);

    items.forEach((el, i) => {
      const w = FAN_WINDOWS[i] || [0, 1];
      const t = easeFan(clamp01((p - w[0]) / (w[1] - w[0])));
      const depth = parseFloat(el.dataset.depth) || 0;
      const rest = 1 - t;
      el.style.transform = "translateX(" + (geo[i] * rest).toFixed(2) + "px)";
      if (el.firstElementChild) {
        el.firstElementChild.style.transform =
          "translateY(" + (rest * depth * 13).toFixed(2) + "px) scale(" +
          (1 + rest * (0.17 - depth * 0.03)).toFixed(4) + ")";
      }
    });
  }

  const compacto = window.matchMedia("(max-width: 640px)");
  const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)");

  /** Devuelve los móviles a lo que diga el CSS, sin transform inline. */
  function limpiar() {
    items.forEach((el) => {
      el.style.transform = "";
      if (el.firstElementChild) el.firstElementChild.style.transform = "";
    });
    geo = null;
  }

  function sincronizar() {
    // Por debajo de 640px el CSS deja un solo móvil: no hay abanico que abrir.
    if (compacto.matches) return limpiar();
    measure();
    // Con reduced-motion se queda abierto y no se engancha al scroll.
    if (sinMovimiento.matches) apply(1);
  }

  sincronizar();

  window.addEventListener("scroll", () => {
    if (compacto.matches || sinMovimiento.matches || frame) return;
    frame = requestAnimationFrame(() => { frame = 0; apply(); });
  }, { passive: true });

  window.addEventListener("resize", sincronizar);
  compacto.addEventListener("change", sincronizar);

  // Las imágenes cambian el ancho de la fila al cargar, así que se remide.
  window.addEventListener("load", sincronizar);
})();
