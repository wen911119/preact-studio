import { h, Component, cloneElement, toChildArray } from 'preact'

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
    // 连续2个false才更新
    return !nextProps.freeze && !this.props.freeze && nextProps.active
  }
  render () {
    const {
      active,
      children
    } = this.props
    return cloneElement(children, {
      active
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
  const childrenArr = toChildArray(children)
  return (
    <div style={_style}>
      {childrenArr.map((child, index) => (
        <div style={itemStyle} key={index}>
          <SwiperItem
            offset={offset}
            animation={animation}
            freeze={freeze}
            active={activeIndex === index}
          >
            {child}
          </SwiperItem>
        </div>
      ))}
    </div>
  )
}

export default Swipeable
