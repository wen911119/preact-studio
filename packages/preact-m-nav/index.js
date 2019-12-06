import { h } from 'preact'

const isWechatMp = window.location.search.indexOf('_c=mp') > -1
const isH5Plus = navigator.userAgent.indexOf('Html5Plus') > -1
const isH5PlusLocalPath = window.location.href.indexOf('http') < 0

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
export const nav = {
  push: (path, params, headerConfig = {}) => {
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
    else if (isH5Plus && isH5PlusLocalPath) {
      // 是h5+,并且是本地网页
      window.plus.webview.open(`/${path}.html?_p=${newAppInfoStr}`, undefined, Object.assign({
        titleNView: {
          autoBackButton: true
        },
        backButtonAutoControl: 'close'
      }, headerConfig), 'pop-in')
    }
    else {
      window.location.href = `/${path}.html?_p=${newAppInfoStr}`
    }
  },
  replace: (path, params, headerConfig = {}) => {
    appInfo.paths.pop()
    appInfo.paths.push(path)
    const newAppInfo = {
      params,
      paths: appInfo.paths
    }
    const newAppInfoStr = encodeURI(JSON.stringify(newAppInfo))
    if (typeof wx !== 'undefined') {
      // eslint-disable-next-line
      wx.miniProgram.redirectTo({
        url: `/pages/${path}/index?_p=${newAppInfoStr}`
      })
    }
    else if (isH5Plus && isH5PlusLocalPath) {
      // 是h5+,并且是本地网页
      window.plus.webview.open(`/${path}.html?_p=${newAppInfoStr}`, undefined, Object.assign({
        titleNView: {
          autoBackButton: true
        },
        backButtonAutoControl: 'close'
      }, headerConfig), 'pop-in', 200, () => window.plus.webview.currentWebview().close('none'))
    }
    else {
      window.location.replace(`/${path}.html?_p=${newAppInfoStr}`)
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
    const paramsStr = JSON.stringify(onPopParams)
    window.localStorage.setItem(
      'on-pop-back-params',
      paramsStr
    )
    if (typeof wx !== 'undefined') {
      // eslint-disable-next-line
      wx.miniProgram.navigateBack()
    }
    else if (isH5Plus && isH5PlusLocalPath) {
      // 本地网页file://协议下storage事件是不会触发的
      // 所以得用替代方案
      const allWebviews = window.plus.webview.all().filter(v => v.getTitle())
      allWebviews[allWebviews.length - 2].evalJS(`__ON_POP__('${paramsStr}')`)
      window.plus.webview.currentWebview().close('pop-out')
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
      const paramsStr = JSON.stringify(onBackParams)
      window.localStorage.setItem(
        'on-pop-back-params',
        paramsStr
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
      else if (isH5Plus && backSteps > 1) {
        // h5+内多级返回
        if (window.plus) {
          const allWebviews = window.plus.webview.all().filter(v => v.getTitle())
          const toHandledWebviews = allWebviews.slice(-(backSteps + 1))
          const l = toHandledWebviews.length
          // 只有当前webview关闭才需要动画
          toHandledWebviews.map((v, i) => {
            if (i === 0) {
              // 执行onBack回调
              v.evalJS(`__ON_BACK__('${paramsStr}')`)
            }
            else {
              v.close(l === i + 1 ? 'pop-out' : 'none')
            }
          }
          )
        }
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

if (isWechatMp || isH5Plus) {
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

// h5+内加载本地网页不会触发storage事件，所以用这种方法代替
if (isH5Plus && isH5PlusLocalPath) {
  window.__ON_POP__ = paramsStr => {
    const params = JSON.parse(paramsStr)
    onPopListeners.forEach(l => l(params.params))
  }
  window.__ON_BACK__ = paramsStr => {
    const params = JSON.parse(paramsStr)
    onBackListeners.forEach(l => l(params.params))
  }
}
