import { h, Component, cloneElement } from 'preact'
export default class TouchResponder extends Component {
  onTouchStart (e) {
    if (this.props.position !== 'middle') {
      this.touchStartPoint = e.targetTouches[0]
    }
  }
  onTouchMove (e) {
    const { position } = this.props

    if (position !== 'middle' && this.lastMoved) {
      const angle =
        (this.touchStartPoint.clientY - e.touches[0].clientY) /
        (this.touchStartPoint.clientX - e.touches[0].clientX)
      if (Math.abs(angle) > 0.5) {
        // 判断角度，因为swiper的阀值是<0.5，所以这里要大于0.5
        const distance =
          e.targetTouches[0].screenY - this.touchStartPoint.screenY
        if (
          (distance > 0 && position === 'top') ||
          (distance < 0 && position === 'bottom')
        ) {
          // 下拉或上拉动作
          // this.lastMoved = false;
          e.preventDefault()
          const action = position === 'top' ? 'pulldown' : 'pullup'
          this.setState({ distance, action })
          // 换成requestAnimationFrame看不到明显优势，并且在安卓上有一定几率block掉touchend事件，非常坑爹。
          // requestAnimationFrame(() => {
          //   this.setState({ distance, action }, () => {
          //     this.lastMoved = true;
          //   });
          // });
        }
      }
    }
  }
  onTouchEnd () {
    if (this.props.position !== 'middle' && this.state.distance !== 0) {
      this.setState({ distance: 0, action: 'none' })
      // requestAnimationFrame(() => {
      //   this.setState({ distance: 0, action: "none" });
      // });
    }
  }
  constructor (props) {
    super(props)
    this.onTouchMove = this.onTouchMove.bind(this)
    this.onTouchStart = this.onTouchStart.bind(this)
    this.onTouchEnd = this.onTouchEnd.bind(this)
    this.lastMoved = true
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
        {cloneElement(children[0], { distance, action, ...otherProps })}
      </div>
    )
  }
}
