export default class Base {
  constructor() {
    this.onPopListeners = []
    this.onBackListeners = []

    try {
      // $PAGES_TITLE_MAP$ 来自webpack定义的变量
      // eslint-disable-next-line
      this.pagesTitleMap = $PAGES_TITLE_MAP$
    } catch (err) {
      this.pagesTitleMap = {}
    }
  }

  // eslint-disable-next-line
  push(path, params, headerConfig, host) {
    console.warn('待子类实现')
  }

  // eslint-disable-next-line
  pushToNative(path, params) {
    console.warn('待子类实现')
  }

  // eslint-disable-next-line
  replace(path, params, headerConfig, host) {
    console.warn('待子类实现')
  }

  // eslint-disable-next-line
  replaceToNative(path, params) {
    console.warn('待子类实现')
  }

  // eslint-disable-next-line
  pop(params) {
    console.warn('待子类实现')
  }

  // eslint-disable-next-line
  popToNative(params) {
    console.warn('待子类实现')
  }

  // eslint-disable-next-line
  back(steps, params) {
    console.warn('待子类实现')
  }

  // eslint-disable-next-line
  backToNative(steps, params) {
    console.warn('待子类实现')
  }

  setTitle(title) {
    document.title = title
  }

  onPop(listener) {
    this.onPopListeners.push(listener)
  }

  onBack(listener) {
    this.onBackListeners.push(listener)
  }
}
