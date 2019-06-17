
    const { h, render } = require('preact')
    let App = require('/Users/user/Documents/preact-studio/packages/demo/src/pages/dialogDemo/app.js')
      .default
    let root = document.getElementById('app')
    if (typeof App === 'function') {
      render(h(App), root || document.body)
    }
      