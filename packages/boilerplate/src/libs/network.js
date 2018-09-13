import axios from 'axios'

let statusCodeErrHandler = statusCode => {
  console.log(statusCode)
}

let commonRequsetErrHandler = err => {
  console.log(err)
  window.alert('网络错误')
}

const requestClient = {
  get () {},
  async post (url, params) {
    url =
      url +
      '?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiIxMDMxODA4MzExMzQxMTQwMDEiLCJpc3MiOiJ3ZWNoYXQtc2VydmljZSIsImF1ZCI6ImVyaXMtbXAiLCJzdWIiOiJlcmlzLW1wIiwiaWF0IjoxNTM2NjM1MzQ1LCJleHAiOjE1NjgxNzEzNDV9.PlHjrOW811FIeIBEtWs9-jzMmgDhyNPRkKENQz0p3SM'
    try {
      const { status, data } = await axios.post(url, params)
      if (status < 300) {
        return data
      }
      statusCodeErrHandler(status)
    } catch (err) {
      commonRequsetErrHandler(err)
    }
  }
}
export default requestClient

export const setStatusCodeErrHandler = hander => {
  statusCodeErrHandler = hander
}

export const setCommonRequsetErrHandler = hander => {
  commonRequsetErrHandler = hander
}
