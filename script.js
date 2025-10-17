// Loader blur-out & reveal transition
document.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro");
  const main = document.getElementById("mainContent");

  // after 2s, add blur-out and remove overlay
  setTimeout(() => {
    intro.classList.add("blur-out");
    setTimeout(() => {
      intro.remove();
      main.classList.remove("hidden");
      main.classList.add("reveal");
    }, 900); // sync with CSS transition
  }, 2000);
});

// Custom cursor animation
(() => {
  const cursor = document.getElementById("cursor");
  const ring = document.getElementById("ring");

  let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let pos = { x: mouse.x, y: mouse.y };
  let ringPos = { x: mouse.x, y: mouse.y };

  function lerp(a, b, t) { return a + (b - a) * t; }

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    cursor.style.opacity = 1;
    ring.style.opacity = 0.6;
  });

  window.addEventListener("mousedown", () => {
    cursor.style.transform = "translate(-50%, -50%) scale(0.7)";
  });
  window.addEventListener("mouseup", () => {
    cursor.style.transform = "translate(-50%, -50%) scale(1)";
  });

  function frame() {
    pos.x = lerp(pos.x, mouse.x, 0.18);
    pos.y = lerp(pos.y, mouse.y, 0.18);
    ringPos.x = lerp(ringPos.x, mouse.x, 0.08);
    ringPos.y = lerp(ringPos.y, mouse.y, 0.08);
    cursor.style.left = pos.x + "px";
    cursor.style.top = pos.y + "px";
    ring.style.left = ringPos.x + "px";
    ring.style.top = ringPos.y + "px";
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // hide cursor outside window
  window.addEventListener("mouseout", () => {
    cursor.style.opacity = 0;
    ring.style.opacity = 0;
  });
})();
