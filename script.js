// Wait for window load
window.addEventListener("load", () => {
  const loader = document.querySelector(".loader-wrapper");
  const video = document.getElementById("bg-video");

  // After 3s, blur out loader and blur in video
  setTimeout(() => {
    loader.classList.add("blur-out");
    setTimeout(() => {
      loader.style.display = "none";
      video.style.opacity = "1";
      video.style.filter = "blur(0)";
    }, 1000);
  }, 3000);
});

// Smooth scroll + sticky animations
const contentElements = [...document.querySelectorAll(".content--sticky")];
let lenis;

function initSmoothScrolling() {
  lenis = new Lenis({ lerp: 0.2, smoothWheel: true });
  lenis.on("scroll", () => ScrollTrigger.update());
  const scrollFn = (time) => {
    lenis.raf(time);
    requestAnimationFrame(scrollFn);
  };
  requestAnimationFrame(scrollFn);
}

function scrollAnimations() {
  contentElements.forEach((el, i) => {
    const isLast = i === contentElements.length - 1;
    gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top top",
        end: "+=100%",
        scrub: true,
      },
    })
      .to(el, {
        ease: "none",
        filter: isLast ? "none" : "brightness(60%) contrast(135%)",
        yPercent: isLast ? 0 : -15,
      }, 0)
      .to(el.querySelector(".content__img"), {
        ease: "power1.in",
        yPercent: -40,
        rotation: -20,
      }, 0);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  initSmoothScrolling();
  scrollAnimations();
});
