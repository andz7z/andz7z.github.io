// Initialize Lenis smooth scroll
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
  gestureDirection: "vertical",
  smoothTouch: true,
  touchMultiplier: 2
});

function raf(time) {
  lenis.raf(time);
  ScrollTrigger.update();
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Set z-index for images
document.querySelectorAll(".arch__right .img-wrapper").forEach((element) => {
  const order = element.getAttribute("data-index");
  if (order !== null) {
    element.style.zIndex = order;
  }
});

// Mobile layout handler (only handle order)
function handleMobileLayout() {
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const leftItems = gsap.utils.toArray(".arch__left .arch__info");
  const rightItems = gsap.utils.toArray(".arch__right .img-wrapper");

  if (isMobile) {
    // Interleave items using order
    leftItems.forEach((item, i) => {
      item.style.order = i * 2;
    });
    rightItems.forEach((item, i) => {
      item.style.order = i * 2 + 1;
    });
  } else {
    // Clear order for desktop
    leftItems.forEach((item) => {
      item.style.order = "";
    });
    rightItems.forEach((item) => {
      item.style.order = "";
    });
  }
}

// Debounce resize for performance
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(handleMobileLayout, 100);
});

// Run on initial load
handleMobileLayout();

const imgs = gsap.utils.toArray(".img-wrapper img");
const bgColors = ["#EDF9FF", "#FFECF2", "#FFE8DB"];

// GSAP Animation with Media Query
ScrollTrigger.matchMedia({
  "(min-width: 769px)": function () {
    const mainTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".arch",
        start: "top top",
        end: "bottom bottom",
        pin: ".arch__right",
        scrub: true
      }
    });

    gsap.set(imgs, {
      clipPath: "inset(0)",
      objectPosition: "0px 0%"
    });

    imgs.forEach((_, index) => {
      const currentImage = imgs[index];
      const nextImage = imgs[index + 1] ? imgs[index + 1] : null;

      const sectionTimeline = gsap.timeline();

      if (nextImage) {
        sectionTimeline
          .to(
            "body",
            {
              backgroundColor: bgColors[index],
              duration: 1.5,
              ease: "power2.inOut"
            },
            0
          )
          .to(
            currentImage,
            {
              clipPath: "inset(0px 0px 100%)",
              objectPosition: "0px 60%",
              duration: 1.5,
              ease: "none"
            },
            0
          )
          .to(
            nextImage,
            {
              objectPosition: "0px 40%",
              duration: 1.5,
              ease: "none"
            },
            0
          );
      }

      mainTimeline.add(sectionTimeline);
    });
  },
  "(max-width: 768px)": function () {
    const mbTimeline = gsap.timeline();
    gsap.set(imgs, {
      objectPosition: "0px 60%"
    });

    imgs.forEach((image, index) => {
      const innerTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: image,
          start: "top-=70% top+=50%",
          end: "bottom+=200% bottom",
          scrub: true
        }
      });

      innerTimeline
        .to(image, {
          objectPosition: "0px 30%",
          duration: 5,
          ease: "none"
        })
        .to("body", {
          backgroundColor: bgColors[index],
          duration: 1.5,
          ease: "power2.inOut"
        });

      mbTimeline.add(innerTimeline);
    });
  }
});
