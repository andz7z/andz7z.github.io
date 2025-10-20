// ========== PRELOAD + TRANSITION ==========

// Loader fade-out & video fade-in
window.addEventListener("load", () => {
  setTimeout(() => {
    document.body.classList.add("loaded");
  }, 3000);
});

// ========== SMOOTH SCROLL + STICKY ANIMATIONS ==========
const preloadImages = (selector = "img") => {
  return new Promise((resolve) => {
    imagesLoaded(document.querySelectorAll(selector), { background: true }, resolve);
  });
};

let lenis;
const contentElements = [...document.querySelectorAll(".content--sticky")];
const totalContentElements = contentElements.length;

const initSmoothScrolling = () => {
  lenis = new Lenis({
    lerp: 0.2,
    smoothWheel: true
  });

  lenis.on("scroll", () => ScrollTrigger.update());
  const scrollFn = (time) => {
    lenis.raf(time);
    requestAnimationFrame(scrollFn);
  };
  requestAnimationFrame(scrollFn);
};

const scroll = () => {
  contentElements.forEach((el, position) => {
    const isLast = position === totalContentElements - 1;

    gsap
      .timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=100%",
          scrub: true
        }
      })
      .to(
        el,
        {
          ease: "none",
          startAt: { filter: "brightness(100%) contrast(100%)" },
          filter: isLast ? "none" : "brightness(60%) contrast(135%)",
          yPercent: isLast ? 0 : -15
        },
        0
      )
      .to(
        el.querySelector(".content__img"),
        {
          ease: "power1.in",
          yPercent: -40,
          rotation: -20
        },
        0
      );
  });
};

const init = () => {
  initSmoothScrolling();
  scroll();
};

preloadImages(".content__img").then(() => {
  document.body.classList.remove("loading");
  init();
});
