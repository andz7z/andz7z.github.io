window.addEventListener("load", () => {
  const loader = document.querySelector(".loader-wrapper");
  const video = document.getElementById("bg-video");

  // După 3s → loader blur out, video fade/blur in
  setTimeout(() => {
    loader.classList.add("blur-out");

    setTimeout(() => {
      loader.style.display = "none";
      video.classList.add("active");
      document.body.classList.remove("loading");
      initSmoothScrolling();
      initScrollAnimations();
    }, 1200);
  }, 3000);
});

// Smooth scrolling cu Lenis
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

// GSAP scroll-trigger effects
function initScrollAnimations() {
  const sections = document.querySelectorAll(".content--sticky");
  sections.forEach((el, index) => {
    const isLast = index === sections.length - 1;
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
