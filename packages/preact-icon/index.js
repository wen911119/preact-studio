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
const Icon = ({ name, size = 30, color, style, className = '', ...otherProps }) => (
  <i className={`iconfont ${name} ${className}`} style={Object.assign({ fontSize: p2r(size), color }, style)} {...otherProps} />
)

export default Icon
