import { h, Component, cloneElement } from 'preact'

export default class SwipeResponder extends Component {
  onTouchStart (e) {
    this.touchStartPoint = e.touches[0]
    this.touchStartTime = Date.now()
    this.setState({ stage: 'swipe-start' })
  }
  onTouchMove (e) {
    const angle =
      (this.touchStartPoint.clientY - e.touches[0].clientY) /
      (this.touchStartPoint.clientX - e.touches[0].clientX)
    if (Math.abs(angle) < 0.5) {
      const distance = e.touches[0].clientX - this.touchStartPoint.clientX
      this.setState({ distance, stage: 'swipe-moving' })
      e.preventDefault()
    }
    else {
      this.touchStartPoint = e.touches[0]
    }
  }
  onTouchEnd (e) {
    const distance = e.changedTouches[0].clientX - this.touchStartPoint.clientX
    const speed = Math.abs(distance / (Date.now() - this.touchStartTime))
    this.setState({ distance, speed, stage: 'swipe-end' })
  }
  constructor (props) {
    super(props)
    this.onTouchStart = this.onTouchStart.bind(this)
    this.onTouchMove = this.onTouchMove.bind(this)
    this.onTouchEnd = this.onTouchEnd.bind(this)
    this.state = {
      distance: 0,
      speed: 0,
      stage: 'swipe-end'
    }
  }
  render () {
    const { children, style = {}, fill, ...otherProps } = this.props
    const { distance, speed, stage } = this.state
    let wrapStyle = {
      overflow: 'hidden'
    }
    if (fill) {
      wrapStyle.flex = 1
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
          stage
        })}
      </div>
    )
  }
}
