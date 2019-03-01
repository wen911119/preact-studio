import { h, Component } from 'preact'
import SwipeResponder from './swipeResponder'
import Swipeable from './swipeable'
import SwipeManager from './swipeManager'

export default class Swiper extends Component {
  shouldComponentUpdate (nextProps) {
    if (
      this.props.activeIndex !== nextProps.activeIndex ||
      this.props.children.length !== nextProps.children.length
    ) {
      return true
    }
    return false
  }
  render () {
    const { children, ...otherProps } = this.props
    const itemsNum = children.length
    return (
      <SwipeResponder {...otherProps}>
        <SwipeManager itemsNum={itemsNum}>
          <Swipeable>{children}</Swipeable>
        </SwipeManager>
      </SwipeResponder>
    )
  }
}
