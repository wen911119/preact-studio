
const { h, render } = require('preact')
require('preact/debug')
let App = require('/Users/wenjun/Documents/preact-toolkit/packages/preact-multi-page-template/src/pages/index/app.js')
  .default
const hotLoader = require('react-hot-loader').default
hotLoader.preact(require('preact').default)
if (typeof App === 'function') {
  let root = document.body.firstElementChild
  let init = () => {
    let _app = require('/Users/wenjun/Documents/preact-toolkit/packages/preact-multi-page-template/src/pages/index/app.js')
      .default
    root = render(h(_app), document.body, root)
  }
  if (module.hot)
    module.hot.accept(
      '/Users/wenjun/Documents/preact-toolkit/packages/preact-multi-page-template/src/pages/index/app.js',
      init
    )
  init()
}
  