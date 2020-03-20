import { parse } from './utils'
export default class Base {
  constructor() {
    this.onPopListeners = []
    this.onBackListeners = []
    this.current = window.location.pathname.replace(/\/(.+)\.html/, '$1')
    this._p = {}
    try {
      this._p = JSON.parse(decodeURIComponent(parse(window.location.search)._p))
    } catch (err) {
      console.log(err)
    }
    this.params = this._p.params || {}
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
