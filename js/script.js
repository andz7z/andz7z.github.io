(function () {
  const loader = document.getElementById("loader");
  const loaderVideo = document.getElementById("loader-video");
  const header = document.querySelector(".site-header");
  const burger = document.getElementById("burger");
  const mobileMenu = document.getElementById("mobile-menu");
  const progress = document.getElementById("scroll-progress");

  // Loader: 3s then blur out and remove
  const endLoader = () => {
    if (!loader) return;
    loader.classList.add("blur-out");
    setTimeout(() => loader.remove(), 700);
  };
  // Prefer video end if exactly 3s, fallback timer
  if (loaderVideo) {
    let ended = false;
    loaderVideo.addEventListener("ended", () => { ended = true; endLoader(); });
    setTimeout(() => { if (!ended) endLoader(); }, 3000);
  } else {
    setTimeout(endLoader, 3000);
  }

  // Scroll progress line
  const onScroll = () => {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    const ratio = scrollHeight > 0 ? (scrollTop / scrollHeight) : 0;
    if (progress) progress.style.width = `${ratio * 100}%`;

    // Header fade -> burger on scroll down past 80px (desktop only)
    if (window.innerWidth >= 901) {
      if (scrollTop > 80) header?.classList.add("fade-out");
      else header?.classList.remove("fade-out");
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Burger toggle (always active on phone)
  const toggleMenu = () => {
    const hidden = mobileMenu.hasAttribute("hidden");
    if (hidden) mobileMenu.removeAttribute("hidden");
    else mobileMenu.setAttribute("hidden", "");
    burger.setAttribute("aria-expanded", String(hidden));
  };
  burger?.addEventListener("click", toggleMenu);

  // Close mobile menu on click anchor
  mobileMenu?.addEventListener("click", (e) => {
    const target = e.target;
    if (target.tagName === "A") {
      mobileMenu.setAttribute("hidden", "");
      burger.setAttribute("aria-expanded", "false");
    }
  });

  // Smooth scroll for header and mobile menu links
  const allLinks = document.querySelectorAll('a[href^="#"]');
  allLinks.forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Ensure mobile menu is visible mode on small screens
  const handleResize = () => {
    if (window.innerWidth < 901) {
      header?.classList.remove("fade-out");
    } else {
      mobileMenu?.setAttribute("hidden", "");
      burger?.setAttribute("aria-expanded", "false");
    }
  };
  window.addEventListener("resize", handleResize);
  handleResize();
})();
