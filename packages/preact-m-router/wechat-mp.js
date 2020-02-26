import Base from './base.js'
import { serialize } from './utils'
export default class RouterForWechatMp extends Base {
  constructor(props) {
    super(props)
    this.depth = parseInt(
      window.location.search.replace(/.+depth=(.+)&.+|.+depth=(.+)/g, '$1$2')
    )
    this.popToNative = this.pop
    this.backToNative = this.back
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash
      if (hash.indexOf('#onPopParams') > -1) {
        const onPopParamsStr = decodeURIComponent(
          hash.replace('#onPopParams=', '')
        )
        const onPopParams =
          onPopParamsStr === '{}' ? undefined : JSON.parse(onPopParamsStr)
        this.onPopListeners.forEach(l => l(onPopParams))
      } else if (hash.indexOf('#onBackParams') > -1) {
        const onBackParamsStr = decodeURIComponent(
          hash.replace('#onBackParams=', '')
        )
        const onBackParams =
          onBackParamsStr === '{}' ? undefined : JSON.parse(onBackParamsStr)
        this.onBackListeners.forEach(l => l(onBackParams))
      }
      // 改变hash会新增一条历史记录，这里需要back一次抵消影响
      if (window.history.length > 1) {
        window.history.back()
      }
    })
  }

  push(path, params = {}, headerConfig = {}, host) {
    const newAppInfo = {
      params,
      title: headerConfig.title || this.pagesTitleMap[path]
    }

    const wxParams = {
      page: path,
      headerConfig: Object.assign(
        { title: this.pagesTitleMap[path] },
        headerConfig
      ),
      _p: newAppInfo,
      host
    }
    // eslint-disable-next-line
    wx.miniProgram.navigateTo({
      url: `/pages/h666Container${this.depth + 1}/index${serialize(wxParams)}`
    })
  }

  pushToNative(path, params = {}) {
    // eslint-disable-next-line
    wx.miniProgram.navigateTo({
      url: `/pages/${path}/index${serialize(params)}`
    })
  }

  replace(path, params = {}, headerConfig = {}, host) {
    const newAppInfo = {
      params,
      title: headerConfig.title || this.pagesTitleMap[path]
    }

    const wxParams = {
      page: path,
      headerConfig: Object.assign(
        { title: this.pagesTitleMap[path] },
        headerConfig
      ),
      _p: newAppInfo,
      host
    }
    // eslint-disable-next-line
    wx.miniProgram.redirectTo({
      url: `/pages/h666Container${this.depth}/index${serialize(wxParams)}`
    })
  }

  replaceToNative(path, params = {}) {
    // eslint-disable-next-line
    wx.miniProgram.redirectTo({
      url: `/pages/${path}/index${serialize(params)}`
    })
  }

  pop(params) {
    // eslint-disable-next-line
    wx.miniProgram.postMessage({
      data: {
        params: Object.assign({ ts: Date.now() }, params),
        type: 'pop-params'
      }
    })
    // eslint-disable-next-line
    wx.miniProgram.navigateBack()
  }

  back(steps, params) {
    // eslint-disable-next-line
    wx.miniProgram.postMessage({
      data: {
        params: Object.assign({ ts: Date.now() }, params),
        type: 'back-params',
        steps
      }
    })
    // eslint-disable-next-line
    wx.miniProgram.navigateBack({
      delta: steps
    })
  }
}
