import { h, Component, cloneElement } from 'preact'

const itemStyle = {
  width: '100vw',
  display: 'inline-block',
  height: '100%',
  verticalAlign: 'top',
  whiteSpace: 'normal'
}
const innerStyle = {
  display: 'inline-block',
  whiteSpace: 'nowrap',
  height: '100%'
}

class SwiperItem extends Component {
  shouldComponentUpdate (nextProps) {
    // 静止下来之后父元素的更新才会导致这里往下更新
    if (
      (this.props.offset === nextProps.offset &&
        this.props.animation === nextProps.animation) ||
      this.props.activeIndex !== nextProps.activeIndex
    ) {
      // 当前选中的item才会更新
      if (nextProps.activeIndex === this.props.index) {
        return true
      }
    }
    return false
  }
  render () {
    const {
      activeIndex,
      index,
      children
    } = this.props
    return cloneElement(children, {
      active: activeIndex === index
    })
  }
}

const Swipeable = ({
  children,
  offset,
  animation,
  style = {},
  freeze,
  activeIndex
}) => {
  const _style = Object.assign({}, style, innerStyle, {
    transform: `translate3d(${offset}px,0,0)`,
    '-webkit-transform': `translate3d(${offset}px,0,0)`,
    transition: animation ? '330ms' : 'none'
  })
  const childrenArr = children ? (children.map ? children : [children]) : []
  return (
    <div style={_style}>
      {childrenArr.map((child, index) => (
        <div style={itemStyle}>
          <SwiperItem
            offset={offset}
            animation={animation}
            freeze={freeze}
            activeIndex={activeIndex}
            index={index}
          >
            {child}
          </SwiperItem>
        </div>
      ))}
    </div>
  )
}

export default Swipeable
