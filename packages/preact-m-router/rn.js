import Base from './base.js'

export default class RouterForRN extends Base {
  constructor(props) {
    super(props)
    window.__ON_POP_HOOK__ = paramsStr => {
      const params = JSON.parse(paramsStr)
      this.onPopListeners.map(l => l(params))
    }
    window.__ON_BACK_HOOK__ = paramsStr => {
      const params = JSON.parse(paramsStr)
      this.onBackListeners.map(l => l(params))
    }
  }

  push(path, params = {}, headerConfig = {}, host) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        type: 'navigate',
        action: 'push',
        data: {
          page: path,
          params,
          headerConfig,
          host
        }
      })
    )
  }

  pushToNative(path, params = {}) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        type: 'navigate',
        action: 'push-to-native',
        data: {
          page: path,
          params
        }
      })
    )
  }

  replace(path, params = {}, headerConfig = {}, host) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        type: 'navigate',
        action: 'replace',
        data: {
          page: path,
          params,
          headerConfig,
          host
        }
      })
    )
  }

  replaceToNative(path, params = {}) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        type: 'navigate',
        action: 'replace-to-native',
        data: {
          page: path,
          params
        }
      })
    )
  }

  pop(params) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        type: 'navigate',
        action: 'pop',
        data: {
          params
        }
      })
    )
  }

  back(steps, params) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        type: 'navigate',
        action: 'back',
        data: {
          params,
          steps
        }
      })
    )
  }
}
