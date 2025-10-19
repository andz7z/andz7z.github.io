import { Pane } from 'https://cdn.skypack.dev/tweakpane@4.0.4'
const blur = document.querySelector('.blur')

const sync = (event) => {
  if (
    !document.startViewTransition ||
    event.target.controller.view.labelElement.innerText !== 'theme'
  )
    return update()
  document.startViewTransition(() => update())
}

ctrl.on('change', sync)
update()
