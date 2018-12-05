import { h } from 'preact'
import p2r from 'p-to-r'

export const setIconFontUrl = url => {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = url
  document.body.appendChild(link)
}

const Icon = ({ name, size, color }) => (
  <i className={`iconfont ${name}`} style={{ fontSize: p2r(size), color }} />
)

export default Icon
