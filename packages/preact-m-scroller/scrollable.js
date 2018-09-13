import { h, Component, cloneElement } from 'preact'

export default class Scrollable extends Component {
  render ({
    children,
    distance,
    action,
    header,
    footer,
    recomputeLayout, // 过了掉以下属性，要不然这些属性加到dom上会报警告
    onRefresh,
    onLoadMore,
    freeze,
    resetLoadMore,
    ...otherProps
  }) {
    let _style = { transition: action === 'none' ? '330ms' : 'none' }
    if (distance !== 0) {
      // 不能过早的加transform，因为在safari上，加了transform后动态内容高度会导致不能滚动
      _style.transform = `translate3d(0px, ${distance / 2}px, 0px)`
    }
    return (
      <div style={_style}>
        {header && header()}
        {children.length > 1
          ? children
          : cloneElement(children[0], {
            ...otherProps
          })}
        {footer && footer()}
      </div>
    )
  }
}
