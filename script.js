setTimeout(() => {
  const loader = document.querySelector('.loader-screen');
  const landing = document.querySelector('.landing-page');
  const vision = document.getElementById('vision-text');

  loader.style.filter = "blur(15px)";
  loader.style.opacity = "0";

  setTimeout(() => {
    loader.style.display = "none";
    landing.classList.remove('hidden');

    setTimeout(() => {
      landing.classList.add('active');

      setTimeout(() => {
        // Sparge textul în litere individuale
        if (!vision.dataset.split) {
          const letters = [...vision.textContent];
          vision.textContent = "";
          letters.forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.setProperty('--i', i);

            const mirror = span.cloneNode(true);
            vision.appendChild(span);
          });
          vision.dataset.split = true;
        }
        vision.classList.add('show');
        const letters = vision.querySelectorAll('span');
        letters.forEach((span, i) => {
          span.style.animationDelay = `${i * 0.12}s`;
        });
      }, 400);
    }, 100);
  }, 1000);
}, 3000);
import { Pane } from 'https://cdn.skypack.dev/tweakpane@4.0.4';

const config = {
  theme: 'system',
  layers: 5,
  debug: false,
  mask: 45,
  blur: 40,
  padding: 50,
  gap: 2,
  saturate: 0.1
};

const ctrl = new Pane({
  title: 'config',
  expanded: true
});

const blur = document.querySelector('.blur');

const update = () => {
  document.documentElement.dataset.theme = config.theme;
  document.documentElement.dataset.debug = config.debug;
  document.documentElement.style.setProperty('--layers', config.layers);
  document.documentElement.style.setProperty('--blur-max', config.blur);
  document.documentElement.style.setProperty('--mask-stop', config.mask);
  document.documentElement.style.setProperty('--padding', config.padding);
  document.documentElement.style.setProperty('--saturate', config.saturate);
  blur.innerHTML = new Array(config.layers)
    .fill()
    .map((_, index) => {
      return <div style="--i: ${index + 1};"></div>;
    })
    .join('');
};

const sync = (event) => {
  if (
    !document.startViewTransition ||
    event.target.controller.view.labelElement.innerText !== 'theme'
  )
    return update();
  document.startViewTransition(() => update());
};

ctrl.addBinding(config, 'layers', { label: 'layers', min: 2, max: 10, step: 1 });
ctrl.addBinding(config, 'mask', { label: 'mask', min: 5, max: 100, step: 1 });
ctrl.addBinding(config, 'blur', { label: 'blur', min: 2, max: 100, step: 1 });
ctrl.addBinding(config, 'saturate', { label: 'saturate', min: 0, max: 1, step: 0.01 });
ctrl.addBinding(config, 'padding', { label: 'padding', min: 0, max: 100, step: 1 });
ctrl.addBinding(config, 'debug', { label: 'debug' });
ctrl.addBinding(config, 'theme', {
  label: 'theme',
  options: { system: 'system', light: 'light', dark: 'dark' }
});

ctrl.on('change', sync);
update();
