window.addEventListener("load", () => {
  const loaderScreen = document.querySelector(".loader-screen");
  const bgVideo = document.getElementById("bg-video");

  setTimeout(() => {
    // Blur out loader
    loaderScreen.style.filter = "blur(10px)";
    loaderScreen.style.opacity = "0";

    // Blur in video
    bgVideo.style.filter = "blur(0px)";
    bgVideo.style.opacity = "1";

    setTimeout(() => loaderScreen.remove(), 1000);
  }, 3000);
});
// === LOAD SECTIONS DYNAMICALLY ===
async function loadSections() {
  const sections = ["home", "about", "services", "reviews", "contact"];

  for (let section of sections) {
    const container = document.getElementById(`${section}-container`);
    if (!container) continue;

    const response = await fetch(`sections/${section}.html`);
    const html = await response.text();
    container.innerHTML = html;

    // 🔥 Lazy-load JS specific fiecărei secțiuni dacă există
    loadSectionScript(section);
  }
}

// === OPTIONAL: încarcă script specific pentru fiecare secțiune ===
function loadSectionScript(sectionName) {
  const scriptPath = `js/${sectionName}.js`;

  fetch(scriptPath, { method: "HEAD" })
    .then((res) => {
      if (res.ok) {
        const script = document.createElement("script");
        script.src = scriptPath;
        document.body.appendChild(script);
      }
    })
    .catch(() => {
      // Dacă fișierul nu există, nu face nimic
    });
}
// Scroll lin către fiecare secțiune
document.addEventListener("click", (e) => {
  if (e.target.matches("nav a")) {
    e.preventDefault();
    const target = e.target.getAttribute("href").replace("#", "");
    const section = document.getElementById(`${target}-container`);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  }
});
// === Când DOM-ul este pregătit, încărcăm secțiunile ===
window.addEventListener("DOMContentLoaded", loadSections);
