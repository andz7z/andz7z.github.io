// Smooth scroll cu Lenis
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
  gestureDirection: "vertical",
  smoothTouch: true,
  touchMultiplier: 2,
});

function raf(time) {
  lenis.raf(time);
  ScrollTrigger.update();
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Z-index pentru imagini
document.querySelectorAll(".arch__right .img-wrapper").forEach((el) => {
  const order = el.getAttribute("data-index");
  if (order !== null) el.style.zIndex = order;
});

// Responsive order
function handleMobileLayout() {
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const leftItems = gsap.utils.toArray(".arch__left .arch__info");
  const rightItems = gsap.utils.toArray(".arch__right .img-wrapper");

  if (isMobile) {
    leftItems.forEach((item, i) => (item.style.order = i * 2));
    rightItems.forEach((item, i) => (item.style.order = i * 2 + 1));
  } else {
    [...leftItems, ...rightItems].forEach((item) => (item.style.order = ""));
  }
}

let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(handleMobileLayout, 100);
});
handleMobileLayout();

// GSAP Scroll Animations
const imgs = gsap.utils.toArray(".img-wrapper img");
const bgColors = ["#EDF9FF", "#FFECF2", "#FFE8DB"];

ScrollTrigger.matchMedia({
  "(min-width: 769px)": function () {
    const mainTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".arch",
        start: "top top",
        end: "bottom bottom",
        pin: ".arch__right",
        scrub: true,
      },
    });

    gsap.set(imgs, { clipPath: "inset(0)", objectPosition: "0px 0%" });

    imgs.forEach((_, i) => {
      const current = imgs[i];
      const next = imgs[i + 1];
      if (next) {
        const tl = gsap.timeline();
        tl.to("body", { backgroundColor: bgColors[i], duration: 1.5, ease: "power2.inOut" })
          .to(current, { clipPath: "inset(0 0 100%)", objectPosition: "0px 60%", duration: 1.5, ease: "none" }, 0)
          .to(next, { objectPosition: "0px 40%", duration: 1.5, ease: "none" }, 0);
        mainTimeline.add(tl);
      }
    });
  },

  "(max-width: 768px)": function () {
    imgs.forEach((img, i) => {
      gsap.timeline({
        scrollTrigger: {
          trigger: img,
          start: "top-=70% top+=50%",
          end: "bottom+=200% bottom",
          scrub: true,
        },
      })
        .to(img, { objectPosition: "0px 30%", duration: 5, ease: "none" })
        .to("body", { backgroundColor: bgColors[i], duration: 1.5, ease: "power2.inOut" });
    });
  },
});
