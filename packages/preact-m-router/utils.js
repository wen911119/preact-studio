export const getEnv = () => {
  let env = 'browser'
  if (window.location.search.indexOf('_c=mp') > -1) {
    // 微信小程序内
    env = 'wechat-mp'
  } else if (navigator.userAgent.indexOf('Html5Plus') > -1) {
    // h5plus 在线包
    env = 'h5plus'
    if (window.location.href.indexOf('http') < 0) {
      // h5plus 离线包
      env = 'h5plus-local'
    }
  }
  return env
}

export const serialize = obj => {
  const str =
    '?' +
    Object.keys(obj)
      .reduce((a, k) => {
        ;(obj[k] || obj[k] === 0) &&
          a.push(
            k +
              '=' +
              encodeURIComponent(
                typeof obj[k] === 'object' ? JSON.stringify(obj[k]) : obj[k]
              )
          )
        return a
      }, [])
      .join('&')
  return str
}

export const parse = search => {
  const paramPart = search.substr(1).split('&')
  return paramPart.reduce((res, item) => {
    const parts = item.split('=')
    res[parts[0]] = parts[1]
    return res
  }, {})
}
