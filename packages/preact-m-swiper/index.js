import { h, Component } from 'preact'
import SwipeResponder from './swipeResponder'
import Swipeable from './swipeable'
import SwipeManager from './swipeManager'

const getChildrenLength = children => (children ? children.length || 1 : 0)

export default class Swiper extends Component {
  shouldComponentUpdate (nextProps) {
    if (
      this.props.activeIndex !== nextProps.activeIndex ||
      getChildrenLength(this.props.children) !==
        getChildrenLength(nextProps.children)
    ) {
      return true
    }
    return false
  }
  render () {
    const { children, ...otherProps } = this.props
    const itemsNum = getChildrenLength(children)
    return (
      <SwipeResponder {...otherProps}>
        <SwipeManager itemsNum={itemsNum}>
          <Swipeable>{children}</Swipeable>
        </SwipeManager>
      </SwipeResponder>
    )
  }
}
