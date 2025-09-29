
/*!
 * ScrollReveal (data-driven) v2.1 — by CML
 * - Marca los elementos solo con atributos data-*
 * - Soporta dirección (up|down|left|right), distancia, duración, delay, easing
 * - Stagger por contenedor con data-sr-stagger
 * - Respeta prefers-reduced-motion
 */
class ScrollReveal {
  constructor(options = {}) {
    this.options = Object.assign(
      {
        threshold: 0.15,
        rootMargin: "0px 0px -5% 0px",
        once: true // revelar una sola vez por defecto
      },
      options
    );

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.init());
    } else {
      this.init();
    }
  }

  init() {
    this.addStyles();
    this.io = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      { threshold: this.options.threshold, rootMargin: this.options.rootMargin }
    );
    this.observeElements();
    this.observeMutations();
  }

  addStyles() {
    if (document.getElementById("__sr_data_styles")) return;
    const css = `
/* Estado inicial para cualquier [data-sr] */
[data-sr]{
  opacity: 0;
  transform: translateY(var(--sr-distance, 20px));
  transition:
    opacity var(--sr-duration, .6s) var(--sr-ease, cubic-bezier(0.22,1,0.36,1)) var(--sr-delay, 0s),
    transform var(--sr-duration, .6s) var(--sr-ease, cubic-bezier(0.22,1,0.36,1)) var(--sr-delay, 0s);
  will-change: opacity, transform;
}

/* Direcciones (si no especificás, el default es "up") */
[data-sr="up"]    { transform: translateY(var(--sr-distance, 20px)); }
[data-sr="down"]  { transform: translateY(calc(-1 * var(--sr-distance, 20px))); }
[data-sr="left"]  { transform: translateX(calc(-1 * var(--sr-distance, 20px))); }
[data-sr="right"] { transform: translateX(var(--sr-distance, 20px)); }

/* Visible */
[data-sr][data-sr-state="visible"]{
  opacity: 1;
  transform: none;
}

/* Reduced motion: sin animaciones */
@media (prefers-reduced-motion: reduce){
  [data-sr]{
    transition: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
    `.trim();

    const style = document.createElement("style");
    style.id = "__sr_data_styles";
    style.textContent = css;
    document.head.appendChild(style);
  }

  parseTime(val, fallback = 0) {
    if (val == null) return fallback;
    const s = String(val).trim();
    if (s.endsWith("ms")) return parseFloat(s) / 1000;
    if (s.endsWith("s")) return parseFloat(s);
    if (!isNaN(Number(s))) return Number(s) / 1000; // número pelado = ms
    return fallback;
  }

  toCssTime(seconds) {
    return `${Math.max(0, seconds)}s`;
  }

  parseBool(val, fallback = true) {
    if (val == null) return fallback;
    const s = String(val).toLowerCase();
    if (["false", "0", "no", "off"].includes(s)) return false;
    if (["true", "1", "yes", "on"].includes(s)) return true;
    return fallback;
  }

  setPerElementOptions(el) {
    // Dirección (default "up" si no se especifica)
    const dir = (el.dataset.sr || "up").toLowerCase();
    if (!["up", "down", "left", "right"].includes(dir)) el.dataset.sr = "up";

    // Variables CSS por elemento
    const distance = el.dataset.srDistance || "20px";
    const duration = this.parseTime(el.dataset.srDuration, 0.6);
    const delay    = this.parseTime(el.dataset.srDelay, 0);
    const ease     = el.dataset.srEase || "cubic-bezier(0.22,1,0.36,1)";

    el.style.setProperty("--sr-distance", /px|rem|em|%$/.test(distance) ? distance : `${distance}px`);
    el.style.setProperty("--sr-duration", this.toCssTime(duration));
    // Si hay stagger luego, podemos sobrescribir --sr-delay; por ahora seteamos el base:
    el.style.setProperty("--sr-delay", this.toCssTime(delay));
    el.style.setProperty("--sr-ease", ease);

    // Once por elemento (hereda global si no se define)
    el.__sr_once = this.parseBool(el.dataset.srOnce, this.options.once);
  }

  handleIntersection(entries) {
    for (const entry of entries) {
      const el = entry.target;
      const visible = entry.isIntersecting && entry.intersectionRatio > 0;

      if (visible) {
        el.setAttribute("data-sr-state", "visible");
        if (el.__sr_once) this.io.unobserve(el);
      } else if (!el.__sr_once) {
        el.removeAttribute("data-sr-state");
      }
    }
  }

  observeElements(root = document) {
    // Elementos target
    const els = root.querySelectorAll("[data-sr]");
    els.forEach((el) => {
      this.setPerElementOptions(el);
      this.io.observe(el);
    });

    // Stagger: aplicar delays incrementales a hijos marcados dentro del contenedor
    const containers = root.querySelectorAll("[data-sr-stagger]");
    containers.forEach((c) => {
      const step = this.parseTime(c.dataset.srStagger, 0.1); // ej: "0.12s"
      const base = this.parseTime(c.dataset.srDelay, 0);     // delay base del contenedor (opcional)
      const items = c.querySelectorAll(":scope [data-sr]");
      let i = 0;
      items.forEach((el) => {
        // Respetar delay explícito del item si lo tiene; si no, aplicar el stagger:
        if (!el.hasAttribute("data-sr-delay")) {
          el.style.setProperty("--sr-delay", this.toCssTime(base + i * step));
        }
        i++;
      });
    });
  }

  observeMutations() {
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches?.("[data-sr]") || node.querySelector?.("[data-sr]")) {
            this.observeElements(node);
          }
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
    this.mo = mo;
  }

  refresh() {
    this.observeElements();
  }
}

// Instancia global con valores por defecto
window.scrollReveal = new ScrollReveal({
  threshold: 0.15,
  rootMargin: "0px 0px -5% 0px",
  once: true
});

/*
USO — ScrollReveal (data-driven)

1) Marca los elementos que querés animar con el atributo:
   <div data-sr>...</div>

2) Dirección (opcional): up | down | left | right
   <div data-sr="left">Desde la izquierda</div>
   Si omitís, usa "up" por defecto.

3) Parámetros por elemento (opcionales):
   - data-sr-distance="32px"      // 20px por defecto (admite px, rem, %, etc.)
   - data-sr-duration="0.7s"      // .6s por defecto (también acepta "700ms" o 700)
   - data-sr-delay="0.15s"        // 0s por defecto
   - data-sr-ease="cubic-bezier(0.16,1,0.3,1)"
   - data-sr-once="false"         // por defecto hereda 'once' global (true)

   Ejemplos:
   <h2 data-sr data-sr-distance="40px">Aparezco desde abajo</h2>
   <p data-sr="right" data-sr-delay="120ms">Desde la derecha con delay</p>
   <img data-sr="left" data-sr-duration="800ms" data-sr-ease="ease-out">

4) Stagger (retrasos escalonados) por contenedor:
   <div data-sr-stagger="0.12s" data-sr-delay="0.1s">
     <div data-sr="up">Item 1</div>
     <div data-sr="up">Item 2</div>
     <div data-sr="up">Item 3</div>
   </div>
   // Aplica delays 0.1s, 0.22s, 0.34s, ... salvo que cada item tenga data-sr-delay propio.

5) Reduced motion:
   Si el usuario tiene 'prefers-reduced-motion: reduce', los elementos se muestran sin animación.

6) API:
   - window.scrollReveal.refresh()  // re-escanea el DOM (por si agregás nodos dinámicamente)

Colocá este script al final del <body> o con 'defer' para asegurar que el DOM esté disponible.
*/
