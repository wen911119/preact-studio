import Base from './base.js'
import { serialize, parse } from './utils'
export default class RouterForWechatMp extends Base {
  constructor(props) {
    super(props)
    const hashParams = parse(window.location.hash)
    this.depth = parseInt(hashParams.depth)
    this._p = {}
    try {
      this._p = JSON.parse(decodeURIComponent(hashParams._p) || '{}')
    } catch (err) {
      console.log(err)
    }
    this.params = this._p.params || {}
    this.popToNative = this.pop
    this.backToNative = this.back
    window.addEventListener('hashchange', () => {
      const hashParams = parse(window.location.hash)
      if (hashParams.onPopParams) {
        const onPopParamsStr = decodeURIComponent(hashParams.onPopParams)
        const onPopParams =
          onPopParamsStr === '{}' ? undefined : JSON.parse(onPopParamsStr)
        this.onPopListeners.forEach(l => l(onPopParams))
      } else if (hashParams.onBackParams) {
        const onBackParamsStr = decodeURIComponent(hashParams.onBackParams)
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

  push(path, params, headerConfig, host) {
    const newAppInfo = {
      params
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

  pushToNative(path, params) {
    if (params && typeof params !== 'object') {
      throw new Error('参数必须为object')
    }
    // eslint-disable-next-line
    wx.miniProgram.navigateTo({
      url: `/pages/${path}/index${serialize(params || {})}`
    })
  }

  replace(path, params, headerConfig, host) {
    const newAppInfo = {
      params
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

  replaceToNative(path, params) {
    if (params && typeof params !== 'object') {
      throw new Error('参数必须为object')
    }
    // eslint-disable-next-line
    wx.miniProgram.redirectTo({
      url: `/pages/${path}/index${serialize(params || {})}`
    })
  }

  pop(params) {
    if (params && typeof params !== 'object') {
      throw new Error('参数必须为object')
    }
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
    if (params && typeof params !== 'object') {
      throw new Error('参数必须为object')
    }
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
