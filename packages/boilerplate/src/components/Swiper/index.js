import { h, Component } from 'preact'
import SwipeResponder from './swipeResponder'
import Swipeable from './swipeable'
import SwipeManager from './swipeManager'

export default class Swiper extends Component {
  shouldComponentUpdate (nextProps) {
    if (this.props.activeIndex !== nextProps.activeIndex) {
      return true
    }
    return false
  }
  render() {
    const { fill, children, ...otherProps } = this.props
    const itemsNum = children.length
    let wrapStyle = {
      overflow: 'hidden'
    }
    if (fill) {
      wrapStyle.flex = 1
    }
    return (
      <div style={wrapStyle}>
        <SwipeResponder {...otherProps}>
          <SwipeManager itemsNum={itemsNum}>
            <Swipeable>{children}</Swipeable>
          </SwipeManager>
        </SwipeResponder>
      </div>
    )
  }
}
