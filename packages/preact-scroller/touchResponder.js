import { h, Component, cloneElement } from 'preact'

export class TouchResponder extends Component {
  onTouchStart (e) {
    if (this.props.position !== 'middle') {
      this.touchStartPoint = e.targetTouches[0]
    }
  }
  onTouchMove (e) {
    const { position } = this.props
    if (position !== 'middle') {
      const distance = e.targetTouches[0].screenY - this.touchStartPoint.screenY
      if (
        (distance > 0 && position === 'top') ||
        (distance < 0 && position === 'bottom')
      ) {
        // 下拉或上拉动作
        e.preventDefault()
        const action = position === 'top' ? 'pulldown' : 'pullup'
        this.setState({ distance, action })
      }
    }
  }
  onTouchEnd () {
    if (this.props.position !== 'middle') {
      this.setState({ distance: 0, action: 'none' })
    }
  }
  constructor (props) {
    super(props)
    this.onTouchMove = this.onTouchMove.bind(this)
    this.onTouchStart = this.onTouchStart.bind(this)
    this.onTouchEnd = this.onTouchEnd.bind(this)
    this.state = {
      action: 'none', // pulldown,pullup
      distance: 0
    }
  }
  render ({ children, ...otherProps }, { distance, action }) {
    return (
      <div
        onTouchMove={this.onTouchMove}
        onTouchStart={this.onTouchStart}
        onTouchEnd={this.onTouchEnd}
      >
        {cloneElement(children, { distance, action, ...otherProps })}
      </div>
    )
  }
}
