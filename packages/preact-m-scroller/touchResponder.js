import { h, Component, cloneElement } from 'preact'

// 这个组件在最顶部和最底部时候开始起作用
// 需要父组件告知当前位置position
// 这个组件的输出是告知子组件当前手势是什么(pulldown,pullup),距离是多少
export default class TouchResponder extends Component {
  state = {
    action: 'none', // pulldown,pullup
    distance: 0
  }

  onTouchStart = e => {
    this.touchStartPoint = e.targetTouches[0]
  }

  getSwipeAngle = touchMoveEvent => {
    if (!this.angle) {
      this.angle =
        (this.touchStartPoint.clientY - touchMoveEvent.touches[0].clientY) /
        (this.touchStartPoint.clientX - touchMoveEvent.touches[0].clientX)
    }
    return this.angle
  }

  onTouchMove = e => {
    const { position } = this.props
    const angle = this.getSwipeAngle(e)
    if (Math.abs(angle) > 0.5) {
      // 判断角度
      // 大于0.5代表竖直滑动手势
      // 这时通过阻止冒泡独占组件范围内的touchmove事件
      e.stopPropagation()
      if (position === 'top' || position === 'bottom') {
        const distance =
          e.targetTouches[0].screenY - this.touchStartPoint.screenY
        if (
          (distance > 0 && position === 'top') ||
          (distance < 0 && position === 'bottom')
        ) {
          // 在最顶部下拉或最底部上拉需要阻止默认行为，这样可以阻止浏览器自己的bounce效果
          e.cancelable && e.preventDefault()
          const action = position === 'top' ? 'pulldown' : 'pullup'
          this.setState({ distance, action })
          // 换成requestAnimationFrame看不到明显优势，并且在安卓上有一定几率block掉touchend事件，非常坑爹。
          // window.requestAnimationFrame(() => {
          //   this.setState({ distance, action })
          // })
        }
      }
    }
  }

  onTouchEnd = () => {
    this.angle = null
    if (
      (this.props.position === 'top' || this.props.position === 'bottom') &&
      this.state.distance !== 0
    ) {
      this.setState({ distance: 0, action: 'none' })
      // window.requestAnimationFrame(() => {
      //   this.setState({ distance: 0, action: 'none' })
      // })
    }
  }

  render ({ children, position, ...otherProps }, { distance, action }) {
    return (
      // 这个div少不了，这些事件加到子节点上不合适，职责边界就被打破了
      <div
        onTouchMove={this.onTouchMove}
        onTouchStart={this.onTouchStart}
        onTouchEnd={this.onTouchEnd}
        style={{
          minHeight: '100%',
          boxSizing: 'content-box',
          paddingBottom: '1px' // 让它总是可以滚动
        }}
      >
        {cloneElement(children, {
          distance,
          action,
          position,
          ...otherProps
        })}
      </div>
    )
  }
}
