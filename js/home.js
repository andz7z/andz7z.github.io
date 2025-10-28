(function () {
  const headline = document.querySelector(".headline");
  if (!headline) return;

  // Build letters from words
  const words = Array.from(headline.querySelectorAll(".word"));
  words.forEach((span) => {
    const text = span.getAttribute("data-word") || "";
    span.textContent = "";
    for (const ch of text) {
      const c = document.createElement("span");
      c.className = "char";
      c.textContent = ch;
      span.appendChild(c);
    }
  });

  // On click: fade a letter out and back in after 3-4s
  headline.addEventListener("click", (e) => {
    const t = e.target;
    if (!(t instanceof HTMLElement)) return;
    if (!t.classList.contains("char")) return;

    if (t.dataset.locked === "1") return; // avoid re-trigger while hidden
    t.dataset.locked = "1";
    t.style.transition = "opacity .25s ease, filter .25s ease, transform .25s ease";
    t.style.opacity = "0";
    t.style.filter = "blur(3px)";
    t.style.transform = "translateY(6px)";

    const delay = 3000 + Math.floor(Math.random() * 1000);
    setTimeout(() => {
      t.style.opacity = "";
      t.style.filter = "";
      t.style.transform = "";
      t.dataset.locked = "0";
    }, delay);
  });
})();
