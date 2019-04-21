
    const { h, render } = require('preact')
    let App = require('/Users/wenjun/Documents/preact-toolkit/packages/preact-multi-page-template/src/pages/index/app.js')
      .default
    if (typeof App === 'function') {
      let root = document.body.firstElementChild
      root = render(h(App), document.body, root)
    }
      