// ===== Click sound (optional small fx) =====
function playClick() {
  const audio = new Audio("click.mp3");
  audio.volume = 0.3;
  audio.play().catch(() => {});
}

// ===== Toggle nav buttons under title =====
const title = document.getElementById("main-title");
const nav = document.querySelector(".nav-buttons");
let navOpen = false;

function toggleNav() {
  playClick();
  navOpen = !navOpen;

  if (navOpen) {
    nav.classList.add("show-buttons");
    nav.classList.remove("hidden");
    title.classList.add("move-up");
  } else {
    nav.classList.remove("show-buttons");
    title.classList.remove("move-up");
  }
}

// Click on title → show nav
title.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleNav();
});

// Close nav if click outside
document.addEventListener("click", (e) => {
  if (
    navOpen &&
    !e.target.closest(".nav-buttons") &&
    e.target !== title &&
    !title.contains(e.target)
  ) {
    nav.classList.remove("show-buttons");
    navOpen = false;
    title.classList.remove("move-up");
  }
});

// ===== Section switching =====
document.querySelectorAll(".nav-buttons button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.section;
    playClick();

    // Hide all
    document.querySelectorAll(".section").forEach((sec) => {
      sec.classList.add("hidden");
    });

    // Show chosen
    const show = document.getElementById(target);
    if (show) {
      show.classList.remove("hidden");
      show.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // Close nav
    nav.classList.remove("show-buttons");
    navOpen = false;
    title.classList.remove("move-up");
  });
});
