import { h } from 'preact'
import { forwardRef } from 'preact/compat'

import RouterForBrowser from './browser'
import RouterForWechatMp from './wechat-mp'
import { getEnv, parse, serialize } from './utils'

let routerInstance

switch (getEnv()) {
  case 'wechat-mp':
    routerInstance = new RouterForWechatMp()
    break
  case 'h5plus':
    // todo
    break
  case 'h5plus-local':
    // todo
    break
  default:
    routerInstance = new RouterForBrowser()
}

export const nav = routerInstance
export const router = routerInstance
export const urlParse = parse
export const paramSerialize = serialize

const WithRouter = BaseComponent =>
  forwardRef((props, ref) => (
    <BaseComponent {...props} $nav={nav} $router={routerInstance} ref={ref} />
  ))

export default WithRouter
