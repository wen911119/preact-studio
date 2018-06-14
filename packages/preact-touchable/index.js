import { h, Component } from 'preact'

export default class Touchable extends Component {
  state = {
    opacity: 1
  }
  onTouchStart () {
    this.props.onLongPress && (this.touchStartAt = Date.now())
    this.setState({ opacity: 0.3 })
  }
  onTouchEnd () {
    this.setState({ opacity: 1 })
    if (
      this.props.onLongPress &&
      typeof this.props.onLongPress === 'function'
    ) {
      const ts = Date.now() - this.touchStartAt
      const delay = this.props.longPressDelay || 1500
      if (ts > delay) {
        this.props.onLongPress()
      }
    }
  }
  constructor (props) {
    super(props)
    this.onTouchStart = this.onTouchStart.bind(this)
    this.onTouchEnd = this.onTouchEnd.bind(this)
  }
  render ({ children, onPress }, { opacity }) {
    return (
      <span
        onTouchStart={this.onTouchStart}
        onTouchEnd={this.onTouchEnd}
        onClick={onPress}
        style={{ opacity }}
      >
        {children}
      </span>
    )
  }
}
