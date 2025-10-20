// Wait 3 seconds before transition
window.addEventListener("load", () => {
  setTimeout(() => {
    document.body.classList.add("loaded");
  }, 3000);
});

// Optionally, preload video to ensure smooth transition
const video = document.getElementById("bg-video");
video.addEventListener("canplaythrough", () => {
  console.log("Video ready");
});
