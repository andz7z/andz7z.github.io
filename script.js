// Selectăm butoanele și panel-ul stâng
const leftPanel = document.getElementById("leftPanel");
const buttons = document.querySelectorAll(".nav-btn");

// Când se apasă un buton -> extindem partea stângă
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    leftPanel.classList.add("expanded");
  });
});
