import Base from './base.js'

export default class RouterForBrowser extends Base {
  constructor(props) {
    super(props)
    this.paths = this._p.paths || [this.current]
    window.addEventListener('pageshow', event => {
      // 部分安卓机event.persisted永远为false
      if (event.persisted) {
        // 从缓存恢复的页面
        // 读取onPop参数
        let params = window.localStorage.getItem('on-pop-back-params')
        if (params) {
          params = JSON.parse(params)
          // 对比时间是不是1秒内，从缓存读取是很快的
          if (Date.now() - params.ts <= 1000) {
            if (params.type === 'onPop') {
              // 触发onPop
              this.onPopListeners.forEach(l => l(params.params))
            } else if (params.type === 'onBack') {
              this.onBackListeners.forEach(l => l(params.params))
            }
          }
        }
      }
    })
  }

  // eslint-disable-next-line
  push(path, params = {}, headerConfig = {}, host) {
    const newAppInfo = {
      params,
      paths: this.paths.concat([path])
    }
    const newAppInfoStr = encodeURIComponent(JSON.stringify(newAppInfo))
    window.location.href = `/${path}.html?_p=${newAppInfoStr}&_t=${headerConfig.title ||
      ''}`
  }

  // eslint-disable-next-line
  replace(path, params = {}, headerConfig = {}, host) {
    this.paths.pop()
    this.paths.push(path)
    const newAppInfo = {
      params,
      paths: this.paths
    }
    const newAppInfoStr = encodeURIComponent(JSON.stringify(newAppInfo))
    window.location.replace(
      `/${path}.html?_p=${newAppInfoStr}&_t=${headerConfig.title || ''}`
    )
  }

  pop(params = {}) {
    const target = this.paths[this.paths.length - 2]
    const onPopParams = {
      ts: Date.now(),
      type: 'onPop',
      params,
      target
    }
    const paramsStr = JSON.stringify(onPopParams)
    window.localStorage.setItem('on-pop-back-params', paramsStr)
    window.history.back()
  }

  back(steps, params = {}) {
    const onBackParams = {
      ts: Date.now(),
      type: 'onBack',
      params,
      target: this.paths[this.paths.length - steps - 1]
    }
    const paramsStr = JSON.stringify(onBackParams)
    window.localStorage.setItem('on-pop-back-params', paramsStr)
    window.history.go(-steps)
  }
}
