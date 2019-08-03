import { h, Component, cloneElement } from 'preact'

// eslint-disable-next-line
export default class Scrollable extends Component {
  render ({
    children,
    distance,
    action,
    header,
    footer,
    onRefresh, // 过滤
    onLoadMore, // 过滤
    freeze, // 过滤
    resetLoadMore, // 过滤
    ...otherProps
  }) {
    let _style = { transition: action === 'none' ? '330ms' : 'none' }
    if (distance !== 0) {
      // 不能过早的加transform，因为在safari上，加了transform后动态内容高度会导致不能滚动
      _style.transform = `translate3d(0px, ${distance / 2}px, 0px)`
      _style['-webkit-transform'] = `translate3d(0px, ${distance / 2}px, 0px)`
    }
    return (
      <div style={_style}>
        {header && header()}
        {children &&
          (children.length
            ? children
            : cloneElement(children, {
              ...otherProps
            }))}
        {footer && footer()}
      </div>
    )
  }
}
