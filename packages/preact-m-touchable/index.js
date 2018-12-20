import { h, Component } from 'preact'

function touchEndHanlder () {
  if (this.props.disable) {
    return
  }
  this.setState({ opacity: 1 })
  if (this.props.onLongPress && typeof this.props.onLongPress === 'function') {
    const ts = Date.now() - this.touchStartAt
    const delay = this.props.longPressDelay || 1500
    if (ts > delay) {
      this.props.onLongPress()
    }
  }
}

function touchStartHanlder (defaultOpcity) {
  if (this.props.disable) {
    return
  }
  this.props.onLongPress && (this.touchStartAt = Date.now())
  this.setState({ opacity: this.props.opacity || defaultOpcity })
}

function pressHandler () {
  if (this.props.disable) {
    return
  }
  this.props.onPress && this.props.onPress()
}

export class TouchableBlock extends Component {
  state = {
    opacity: 1
  }
  onTouchStart = () => {
    touchStartHanlder.call(this, 0.07)
  }
  onTouchEnd = () => {
    touchEndHanlder.call(this)
  }
  onPress = () => {
    pressHandler.call(this)
  }
  render ({ children, style, ...otherProps }, { opacity }) {
    let mergedStyle = Object.assign({}, style)
    if (opacity < 1) {
      mergedStyle.backgroundColor = `rgba(0,0,0,${opacity})`
    }
    return (
      <div
        onTouchStart={this.onTouchStart}
        onTouchEnd={this.onTouchEnd}
        onClick={this.onPress}
        style={mergedStyle}
        {...otherProps}
      >
        {children}
      </div>
    )
  }
}

export class TouchableInline extends Component {
  state = {
    opacity: 1
  }
  onTouchStart = () => {
    touchStartHanlder.call(this, 0.6)
  }
  onTouchEnd = () => {
    touchEndHanlder.call(this)
  }
  onPress = () => {
    pressHandler.call(this)
  }
  render ({ children }, { opacity }) {
    return (
      <span
        onTouchStart={this.onTouchStart}
        onTouchEnd={this.onTouchEnd}
        onClick={this.onPress}
        style={{ opacity }}
      >
        {children}
      </span>
    )
  }
}
