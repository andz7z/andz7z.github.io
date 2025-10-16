const toggle = document.getElementById("themeToggle");
const container = document.querySelector(".theme-container");
const body = document.body;

// Verifică tema salvată
if (localStorage.getItem("theme") === "light") {
  body.classList.replace("theme-dark", "theme-light");
  toggle.checked = true;
}

// Când apăsăm pe switch
toggle.addEventListener("change", () => {
  container.classList.add("fade-out");

  setTimeout(() => {
    if (toggle.checked) {
      body.classList.replace("theme-dark", "theme-light");
      localStorage.setItem("theme", "light");
    } else {
      body.classList.replace("theme-light", "theme-dark");
      localStorage.setItem("theme", "dark");
    }

    container.classList.remove("fade-out");
  }, 400); // durata efectului fade
});
