import { h, Component, cloneElement } from 'preact'

export default class SwipeResponder extends Component {
  state = {
    distance: 0,
    speed: 0,
    stage: 'swipe-end',
    freeze: false
  }

  onTouchStart = e => {
    this.touchStartPoint = e.touches[0]
    this.touchStartTime = Date.now()
    this.setState({ stage: 'swipe-start', freeze: true })
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
    const angle = this.getSwipeAngle(e)
    if (Math.abs(angle) < 0.5) {
      // 判断角度
      // 小于0.5代表水平滑动手势
      // 这时通过阻止冒泡独占组件范围内的touchmove事件
      e.stopPropagation()
      const distance = e.touches[0].clientX - this.touchStartPoint.clientX
      this.setState({ distance, stage: 'swipe-moving', freeze: true })
      e.cancelable && e.preventDefault()
    } else {
      this.touchStartPoint = e.touches[0]
    }
  }

  onTouchEnd = e => {
    this.angle = null
    const distance = e.changedTouches[0].clientX - this.touchStartPoint.clientX
    const speed = Math.abs(distance / (Date.now() - this.touchStartTime))
    this.setState({ distance, speed, stage: 'swipe-end', freeze: false })
  }

  render() {
    const { children, style = {}, fill, ...otherProps } = this.props
    const { distance, speed, stage, freeze } = this.state
    const wrapStyle = {
      overflow: 'hidden'
    }
    if (fill) {
      wrapStyle.flex = 1
      wrapStyle['-webkit-flex'] = 1
      wrapStyle['-webkit-box-flex'] = 1
    }
    return (
      <div
        onTouchStart={this.onTouchStart}
        onTouchMove={this.onTouchMove}
        onTouchEnd={this.onTouchEnd}
        style={Object.assign(style, wrapStyle)}
      >
        {cloneElement(children, {
          ...otherProps,
          swipeDistance: distance,
          speed,
          stage,
          freeze
        })}
      </div>
    )
  }
}
