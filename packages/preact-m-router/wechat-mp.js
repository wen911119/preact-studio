import { getWechatWx } from '@ruiyun/platform-env'
import Base from './base.js'
import { serialize, parse } from './utils'
export default class RouterForWechatMp extends Base {
  constructor(props) {
    super(props)
    this.depth = parse(window.location.search).depth
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
      params
    }

    const wxParams = {
      page: path,
      headerConfig,
      _p: newAppInfo,
      host
    }
    getWechatWx().then(wx =>
      wx.miniProgram.navigateTo({
        url: `/pages/h666Container${this.depth + 1}/index${serialize(wxParams)}`
      })
    )
  }

  pushToNative(path, params = {}) {
    getWechatWx().then(wx =>
      wx.miniProgram.navigateTo({
        url: `/pages/${path}/index${serialize(params)}`
      })
    )
  }

  replace(path, params = {}, headerConfig = {}, host) {
    const newAppInfo = {
      params
    }

    const wxParams = {
      page: path,
      headerConfig,
      _p: newAppInfo,
      host
    }
    getWechatWx().then(wx =>
      wx.miniProgram.redirectTo({
        url: `/pages/h666Container${this.depth}/index${serialize(wxParams)}`
      })
    )
  }

  replaceToNative(path, params = {}) {
    getWechatWx().then(wx =>
      wx.miniProgram.redirectTo({
        url: `/pages/${path}/index${serialize(params)}`
      })
    )
  }

  pop(params) {
    getWechatWx().then(wx =>
      wx.miniProgram.postMessage({
        data: {
          params: Object.assign({ ts: Date.now() }, params),
          type: 'pop-params'
        }
      })
    )
    getWechatWx().then(wx => wx.miniProgram.navigateBack())
  }

  back(steps, params) {
    getWechatWx().then(wx =>
      wx.miniProgram.postMessage({
        data: {
          params: Object.assign({ ts: Date.now() }, params),
          type: 'back-params',
          steps
        }
      })
    )
    getWechatWx().then(wx =>
      wx.miniProgram.navigateBack({
        delta: steps
      })
    )
  }
}
