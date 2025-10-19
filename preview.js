// Simplified version of blur preview (no tweakpane UI)
const config = {
  layers: 5,
  mask: 45,
  blur: 40,
  saturate: 0.2,
  padding: 50,
};

const blur = document.querySelector('.blur');

function update() {
  document.documentElement.style.setProperty('--layers', config.layers);
  document.documentElement.style.setProperty('--blur-max', config.blur);
  document.documentElement.style.setProperty('--mask-stop', config.mask);
  document.documentElement.style.setProperty('--saturate', config.saturate);
  document.documentElement.style.setProperty('--padding', config.padding);

  blur.innerHTML = new Array(config.layers)
    .fill()
    .map((_, i) => `<div style="--i:${i + 1};"></div>`)
    .join('');
}

update();
