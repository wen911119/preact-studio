import { h, Component } from 'preact'
export default class Scrollable extends Component {
  render ({ children, distance, action, header, footer }) {
    let _style = { transition: action === 'none' ? '330ms' : 'none' }
    if (distance !== 0) {
      // 不能过早的加transform，因为在safari上，加了transform后动态内容高度会导致不能滚动
      _style.transform = `translate3d(0px, ${distance / 2}px, 0px)`
    }
    return (
      <div style={_style}>
        {header && header()}
        {children}
        {footer && footer()}
      </div>
    )
  }
}
