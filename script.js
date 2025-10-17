// Așteaptă 3 secunde, apoi ascunde loaderul
setTimeout(() => {
  document.querySelector('.loader-wrapper').style.display = 'none';
  document.querySelector('.main').style.display = 'block';
}, 3500);
