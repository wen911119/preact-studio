import { h } from 'preact'
import p2r from 'p-to-r'

// 在iconfont，选font-class格式的图标生成链接
export const setIconFontUrl = url => {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = url
  document.body.appendChild(link)
}
// todo
// 没有默认size
const Icon = ({ name, size, color }) => (
  <i className={`iconfont ${name}`} style={{ fontSize: p2r(size), color }} />
)

export default Icon
