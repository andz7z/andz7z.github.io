"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const next = document.querySelector("#services .next");
  const prev = document.querySelector("#services .prev");

  next.addEventListener("click", () => {
    const items = document.querySelectorAll("#services .item");
    document.querySelector("#services .slide").appendChild(items[0]);
  });

  prev.addEventListener("click", () => {
    const items = document.querySelectorAll("#services .item");
    document.querySelector("#services .slide").prepend(items[items.length - 1]);
  });
});

