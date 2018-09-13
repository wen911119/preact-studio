import { h, Component } from "preact";

const current = location.pathname.replace(/\/(.+)\.html/, "$1")
const paramsStr = location.search.replace(/.+_p=(.+)&.+|.+_p=(.+)/g, "$1$2");
let appInfo = {};
let onPopListeners = [];
let onBackListeners = [];
try {
  appInfo = JSON.parse(decodeURI(paramsStr));
} catch (e) {
  console.log(paramsStr);
}
if (!appInfo.paths) {
  // 第一个页面
  appInfo.paths = [current];
}
const nav = {
  push: (path, params) => {
    const newAppInfo = {
      params,
      paths: appInfo.paths.concat([path])
    };
    const newAppInfoStr = encodeURI(JSON.stringify(newAppInfo));
    if (typeof wx !== "undefined") {
      wx.miniProgram.navigateTo({
        url: `/pages/${path}/${path}?_p=${newAppInfoStr}`
      });
    } else {
      window.location.href = `/${path}.html?_p=${newAppInfoStr}`;
    }
  },
  pop: params => {
    const target = appInfo.paths[appInfo.paths.length - 2];
    const onPopParams = {
      ts: Date.now(),
      type: "onPop",
      params,
      target
    };
    localStorage.setItem("on-pop-back-params", JSON.stringify(onPopParams));
    if (typeof wx !== "undefined") {
      wx.miniProgram.navigateBack();
    } else {
      history.back();
    }
  },
  backTo: (path, params) => {
    if (appInfo.paths) {
      const onBackParams = {
        ts: Date.now(),
        type: "onBack",
        params,
        target: path
      };
      localStorage.setItem("on-pop-back-params", JSON.stringify(onBackParams));
      const index = appInfo.paths.indexOf(path);
      const backSteps = appInfo.paths.length - index - 1;
      if (typeof wx !== "undefined") {
        wx.miniProgram.navigateBack({
          delta: backSteps
        });
      } else {
        history.go(-backSteps);
      }
    }
  },
  onPop: listener => onPopListeners.push(listener),
  onBack: listener => onBackListeners.push(listener),
  params: appInfo.params
};

const WithNav = BaseComponent => ({ ...props }) => {
  return <BaseComponent {...props} $nav={nav} />;
};

export default WithNav;
if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
  // 在多webview时不会触发
  window.addEventListener("pageshow", event => {
    if (event.persisted) {
      // 从混存恢复的页面
      // 读取onPop参数
      let params = localStorage.getItem("on-pop-back-params");
      if (params) {
        params = JSON.parse(params);
        // 对比时间是不是1秒内，从缓存读取是很快的
        if (Date.now() - params.ts <= 1000) {
          if (params.type === "onPop") {
            // 触发onPop
            onPopListeners.forEach(l => l(params.params));
          } else if (params.type === "onBack") {
            onBackListeners.forEach(l => l(params.params));
          }
        }
      }
    }
  });
}

window.addEventListener("storage", event => {
  if (event.key === "on-pop-back-params") {
    const msg = JSON.parse(event.newValue);
    if (msg.target === current) {
      // 目标正确
      if (msg.type === "onPop") {
        // 触发onPop
        onPopListeners.forEach(l => l(msg.params));
      } else if (msg.type === "onBack") {
        onBackListeners.forEach(l => l(msg.params));
      }
    }
  }
});
