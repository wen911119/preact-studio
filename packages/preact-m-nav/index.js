import { h } from 'preact'

const current = window.location.pathname.replace(/\/(.+)\.html/, '$1')
const paramsStr = window.location.search.replace(
  /.+_p=(.+)&.+|.+_p=(.+)/g,
  '$1$2'
)
let appInfo = {}
let onPopListeners = []
let onBackListeners = []
let onWakeUpListeners = [] // 从后台回到前台,后退从缓存恢复,多webview模式当前webview激活时
let onSleepListeners = [] // 从前台退到后台, 路由前进当前页被加入缓存，多webview模式当前webview失去焦点
try {
  appInfo = JSON.parse(decodeURI(paramsStr))
}
catch (e) {
  console.log(paramsStr)
}
if (!appInfo.paths) {
  // 第一个页面
  appInfo.paths = [current]
}
const nav = {
  push: (path, params) => {
    const newAppInfo = {
      params,
      paths: appInfo.paths.concat([path])
    }
    const newAppInfoStr = encodeURI(JSON.stringify(newAppInfo))
    if (typeof wx !== 'undefined') {
      // eslint-disable-next-line
      wx.miniProgram.navigateTo({
        url: `/pages/${path}/index?_p=${newAppInfoStr}`
      })
    }
    else if (typeof weex !== 'undefined') {
      // eslint-disable-next-line
      weex.push({
        page: path,
        paramsStr: newAppInfoStr
      })
    }
    else {
      window.location.href = `/${path}.html?_p=${newAppInfoStr}`
    }
  },
  pop: params => {
    const target = appInfo.paths[appInfo.paths.length - 2]
    const onPopParams = {
      ts: Date.now(),
      type: 'onPop',
      params,
      target
    }
    window.localStorage.setItem(
      'on-pop-back-params',
      JSON.stringify(onPopParams)
    )
    if (typeof wx !== 'undefined') {
      // eslint-disable-next-line
      wx.miniProgram.navigateBack()
    }
    else if (typeof weex !== 'undefined') {
      // eslint-disable-next-line
      weex.pop()
    }
    else {
      window.history.back()
    }
  },
  backTo: (path, params) => {
    if (appInfo.paths) {
      const onBackParams = {
        ts: Date.now(),
        type: 'onBack',
        params,
        target: path
      }
      window.localStorage.setItem(
        'on-pop-back-params',
        JSON.stringify(onBackParams)
      )
      let index = appInfo.paths.indexOf(path)
      // 找不到就去首页
      index = index === -1 ? 0 : index
      const backSteps = appInfo.paths.length - index - 1
      if (typeof wx !== 'undefined') {
        // eslint-disable-next-line
        wx.miniProgram.navigateBack({
          delta: backSteps
        })
      }
      else {
        window.history.go(-backSteps)
      }
    }
  },
  setTitle: title => {
    document.title = title
  },
  onPop: listener => onPopListeners.push(listener),
  onBack: listener => onBackListeners.push(listener),
  onWakeUp: listener => onWakeUpListeners.push(listener),
  onSleep: listener => onSleepListeners.push(listener),
  params: appInfo.params
}
// eslint-disable-next-line
const WithNav = BaseComponent => ({ ...props }) => (
  <BaseComponent {...props} $nav={nav} />
)

export default WithNav

// 问题1
// 部分安卓机不支持bfcache，只能用storage事件，而storage事件不能捕获用户自主返回
// 问题2
// 在小程序下，只能用storage事件，而storage事件不能捕获用户自主返回

if (location.search.indexOf('_c=mp') > -1) {
  // 小程序内webview
  // 微信多webview只能靠这个
  // todo: storage事件不能捕获用户自主返回
  window.addEventListener('storage', event => {
    if (event.key === 'on-pop-back-params') {
      const msg = JSON.parse(event.newValue)
      if (msg.target === current) {
        // 目标正确
        if (msg.type === 'onPop') {
          // 触发onPop
          onPopListeners.forEach(l => l(msg.params))
        }
        else if (msg.type === 'onBack') {
          onBackListeners.forEach(l => l(msg.params))
        }
      }
    }
  })
}
else {
  // 普通web
  // 部分安卓机event.persisted永远为false
  window.addEventListener('pageshow', event => {
    if (event.persisted) {
      // 从缓存恢复的页面
      onWakeUpListeners.forEach(l => l())
      // 读取onPop参数
      let params = window.localStorage.getItem('on-pop-back-params')
      if (params) {
        params = JSON.parse(params)
        // 对比时间是不是1秒内，从缓存读取是很快的
        if (Date.now() - params.ts <= 1000) {
          if (params.type === 'onPop') {
            // 触发onPop
            onPopListeners.forEach(l => l(params.params))
          }
          else if (params.type === 'onBack') {
            onBackListeners.forEach(l => l(params.params))
          }
        }
      }
    }
  })
  window.addEventListener('pagehide', event => {
    onSleepListeners.forEach(l => l())
  })
}

// 页面唤醒，退后台事件监听
// 在小程序内切换页面
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    onSleepListeners.forEach(l => l())
  }
  else if (document.visibilityState === 'visible') {
    onWakeUpListeners.forEach(l => l())
  }
})
