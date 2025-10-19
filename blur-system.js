// === blur-system.js ===
// rulează doar după ce pagina e complet încărcată
window.addEventListener("DOMContentLoaded", () => {
  import("https://cdn.skypack.dev/tweakpane@4.0.4").then(({ Pane }) => {
    const config = {
      theme: "system",
      layers: 5,
      debug: false, // lasă fals, altfel vezi doar contururi
      mask: 45,
      blur: 40,
      padding: 50,
      gap: 2,
      saturate: 0.3
    };

    const ctrl = new Pane({
      title: "blur config",
      expanded: false,
    });

    const blur = document.querySelector(".blur");
    if (!blur) {
      console.warn("❗ Element .blur nu a fost găsit în DOM.");
      return;
    }

    const update = () => {
      document.documentElement.dataset.theme = config.theme;
      document.documentElement.dataset.debug = config.debug;
      document.documentElement.style.setProperty("--layers", config.layers);
      document.documentElement.style.setProperty("--blur-max", config.blur);
      document.documentElement.style.setProperty("--mask-stop", config.mask);
      document.documentElement.style.setProperty("--padding", config.padding);
      document.documentElement.style.setProperty("--saturate", config.saturate);

      blur.innerHTML = new Array(config.layers)
        .fill()
        .map((_, i) => `<div style="--i:${i + 1}"></div>`)
        .join("");
    };

    // fix: actualizare automată la scroll și resize
    window.addEventListener("resize", update);
    window.addEventListener("scroll", () => {
      if (!document.startViewTransition) update();
    });

    // setup tweakpane UI (opțional)
    ctrl.addBinding(config, "layers", { min: 2, max: 10, step: 1 });
    ctrl.addBinding(config, "mask", { min: 5, max: 100, step: 1 });
    ctrl.addBinding(config, "blur", { min: 2, max: 100, step: 1 });
    ctrl.addBinding(config, "saturate", { min: 0, max: 1, step: 0.05 });
    ctrl.addBinding(config, "padding", { min: 0, max: 100, step: 1 });
    ctrl.addBinding(config, "debug");
    ctrl.addBinding(config, "theme", {
      options: { system: "system", light: "light", dark: "dark" },
    });

    ctrl.on("change", update);

    // rulează prima dată după mic delay (pentru layout stabil)
    setTimeout(update, 400);
  });
});
