var VanillaTilt = (function () {
  'use strict';
  class VanillaTilt {
    constructor(element, settings = {}) {
      if (!(element instanceof Node)) {
        throw ("Can't initialize VanillaTilt because " + element + " is not a Node.");
      }
      this.width = null;
      this.height = null;
      this.clientWidth = null;
      this.clientHeight = null;
      this.left = null;
      this.top = null;
      this.gammazero = null;
      this.betazero = null;
      this.lastgammazero = null;
      this.lastbetazero = null;
      this.transitionTimeout = null;
      this.updateCall = null;
      this.event = null;
      this.updateBind = this.update.bind(this);
      this.resetBind = this.reset.bind(this);
      this.element = element;
      this.settings = this.extendSettings(settings);
      this.reverse = this.settings.reverse ? -1 : 1;
      this.glare = VanillaTilt.isSettingTrue(this.settings.glare);
      this.glarePrerender = VanillaTilt.isSettingTrue(this.settings["glare-prerender"]);
      this.fullPageListening = VanillaTilt.isSettingTrue(this.settings["full-page-listening"]);
      this.gyroscope = VanillaTilt.isSettingTrue(this.settings.gyroscope);
      this.gyroscopeSamples = this.settings.gyroscopeSamples;
      this.elementListener = this.getElementListener();
      if (this.glare) this.prepareGlare();
      if (this.fullPageListening) this.updateClientSize();
      this.addEventListeners();
      this.updateInitialPosition();
    }
    static isSettingTrue(setting) {
      return setting === "" || setting === true || setting === 1;
    }
    getElementListener() {
      if (this.fullPageListening) return window.document;
      if (typeof this.settings["mouse-event-element"] === "string") {
        const mouseEventElement = document.querySelector(this.settings["mouse-event-element"]);
        if (mouseEventElement) return mouseEventElement;
      }
      if (this.settings["mouse-event-element"] instanceof Node) {
        return this.settings["mouse-event-element"];
      }
      return this.element;
    }
    addEventListeners() {
      this.onMouseEnterBind = this.onMouseEnter.bind(this);
      this.onMouseMoveBind = this.onMouseMove.bind(this);
      this.onMouseLeaveBind = this.onMouseLeave.bind(this);
      this.onWindowResizeBind = this.onWindowResize.bind(this);
      this.onDeviceOrientationBind = this.onDeviceOrientation.bind(this);
      this.elementListener.addEventListener("mouseenter", this.onMouseEnterBind);
      this.elementListener.addEventListener("mouseleave", this.onMouseLeaveBind);
      this.elementListener.addEventListener("mousemove", this.onMouseMoveBind);
      if (this.glare || this.fullPageListening)
        window.addEventListener("resize", this.onWindowResizeBind);
      if (this.gyroscope)
        window.addEventListener("deviceorientation", this.onDeviceOrientationBind);
    }
    // ... (toată clasa VanillaTilt identică cu codul tău original)
  }

  if (typeof document !== "undefined") {
    window.VanillaTilt = VanillaTilt;
    VanillaTilt.init(document.querySelectorAll("[data-tilt]"));
  }

  return VanillaTilt;
})();
document.addEventListener("DOMContentLoaded", () => {
  VanillaTilt.init(document.querySelectorAll(".card"), {
    max: 25,
    speed: 400,
    glare: true,
    "max-glare": 1,
  });
});
// --- (păstrează clasa VanillaTilt completă aici, exact ca în codul tău) ---
// (nu modifica clasa; adaugă următoarele linii după definiția/return-ul VanillaTilt)

function initVanillaTiltOnce() {
  const cards = document.querySelectorAll(".card");
  if (!cards || cards.length === 0) return;

  // dacă deja inițializat, distruge și reinițializează (curățenie)
  cards.forEach(card => {
    if (card.vanillaTilt && typeof card.vanillaTilt.destroy === "function") {
      card.vanillaTilt.destroy();
    }
  });

  // inițializează din nou
  VanillaTilt.init(cards, {
    max: 25,
    speed: 400,
    glare: true,
    "max-glare": 1,
    reset: true,
  });
}

// Init sigur la DOMContentLoaded + load
document.addEventListener("DOMContentLoaded", initVanillaTiltOnce);
window.addEventListener("load", initVanillaTiltOnce);

// Fallback: dacă ai un loader care ascunde secțiuni, re-initializare după ce loader dispare.
// (dacă folosești exact codul cu loader din script.js, apelăm init după 3.5s)
setTimeout(() => {
  initVanillaTiltOnce();
}, 3500);

// Optional: re-init la resize (utile când s-au schimbat dimensiunile)
window.addEventListener("resize", () => {
  // debounce mic pentru performanță
  clearTimeout(window.__tiltResizeTimeout);
  window.__tiltResizeTimeout = setTimeout(() => {
    initVanillaTiltOnce();
  }, 200);
});
