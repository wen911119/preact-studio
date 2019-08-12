import { h } from 'preact'
import SwipeResponder from './swipeResponder'
import Swipeable from './swipeable'
import SwipeManager from './swipeManager'

const getChildrenLength = children =>
  children === undefined ? 0 : children.length

const Swiper = ({ children, ...otherProps }) => {
  const itemsNum = getChildrenLength(children)
  return (
    <SwipeResponder {...otherProps}>
      <SwipeManager itemsNum={itemsNum}>
        <Swipeable>{children}</Swipeable>
      </SwipeManager>
    </SwipeResponder>
  )
}

export default Swiper
