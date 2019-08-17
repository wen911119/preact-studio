import { h } from 'preact'
import sentry from 'h666-sentry'

const getOSS = () =>
  new Promise(resolve => {
    if (window.OSS) {
      resolve(window.OSS)
    }
    else {
      let script = document.createElement('script')
      script.src = '//gosspublic.alicdn.com/aliyun-oss-sdk-6.0.0.min.js'
      script.onload = () => {
        setTimeout(() => {
          resolve(window.OSS)
        }, 0)
      }
      document.body.appendChild(script)
    }
  })
// 不缓存ossconfig，要不然ossconfig过期又要维护它，增加复杂度
// 重新拿一遍ossconfig的代价并不大
const upload = ({ genFileName, getOSSConfig }) => async files => {
  let ossConfig
  if (!genFileName) {
    console.warn('需要传入genFileName参数')
    return []
  }
  if (getOSSConfig) {
    try {
      ossConfig = await getOSSConfig()
      if (!ossConfig) {
        sentry.captureException(new Error('获取ossConfig失败'))
        return []
      }
    }
    catch (error) {
      sentry.captureException(error)
      return []
    }
  }
  else {
    console.warn('getOSSConfig必传')
    return []
  }
  if (files.length > 0) {
    try {
      const OSSClient = await getOSS()
      const rets = await Promise.all(
        files.map(async file => {
          const client = new OSSClient(ossConfig)
          const fileName = genFileName ? genFileName(file) : file.name
          const ret = await client.put(fileName, file)
          return ret.res.requestUrls[0]
        })
      )
      return rets
    }
    catch (error) {
      sentry.captureException(error)
      return []
    }
  }
  return []
}
// eslint-disable-next-line
export const WithOSS = config => BaseComponent => ({ ...props }) => (
  <BaseComponent {...props} $upload={upload(config)} />
)
