import { h, render } from 'preact'
import App from './app'

if (typeof App === 'function') {
  let root = document.body.firstElementChild
  let init = () => {
    root = render(h(App), document.body, root)
    if (module.hot) module.hot.accept('./app', init)
  }
  init()
}
