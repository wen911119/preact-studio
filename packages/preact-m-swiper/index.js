import { h, toChildArray } from 'preact'
import SwipeResponder from './swipeResponder'
import Swipeable from './swipeable'
import SwipeManager from './swipeManager'

const Swiper = ({ children, ...otherProps }) => {
  const itemsNum = toChildArray(children).length
  return (
    <SwipeResponder {...otherProps}>
      <SwipeManager itemsNum={itemsNum}>
        <Swipeable>{children}</Swipeable>
      </SwipeManager>
    </SwipeResponder>
  )
}

export default Swiper
