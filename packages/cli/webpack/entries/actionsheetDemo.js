
    const { h, render } = require('preact')
    require('preact/debug')
    let App = require('/Users/user/Documents/preact-studio/packages/demo/src/pages/actionsheetDemo/app.js')
      .default
    const hotLoader = require('react-hot-loader').default
    hotLoader.preact(require('preact'))
    if (typeof App === 'function') {
      let init = () => {
        let _app = require('/Users/user/Documents/preact-studio/packages/demo/src/pages/actionsheetDemo/app.js')
          .default
        let root = document.getElementById('app')
        render(h(_app), root || document.body)
      }
      if (module.hot)
        module.hot.accept(
          '/Users/user/Documents/preact-studio/packages/demo/src/pages/actionsheetDemo/app.js',
          init
        )
      init()
    }
      