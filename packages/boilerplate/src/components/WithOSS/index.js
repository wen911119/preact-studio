import { h, Component, cloneElement } from 'preact'

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

const upload = config => async (files, genFileName) => {
  if (files.length > 0) {
    const ossClient = await getOSS()
    const rets = await Promise.all(
      files.map(async file => {
        const client = new ossClient(config)
        const fileName = genFileName ? genFileName(file) : file.name
        const ret = await client.put(fileName, file)
        return ret.res.requestUrls[0]
      })
    )
    return rets
  }
  return []
}

const WithOSS = ossConfig => BaseComponent => ({ ...props }) => (
  <BaseComponent {...props} $upload={upload(ossConfig)} />
)

export default WithOSS
