import { h, Component } from 'preact'
import p2r from 'p-to-r'
import { getScrollEventTarget, computePosition, throttle } from './utils'

import WithRefresh from './withRefresh.js'
import WithLoadMore from './withLoadMore.js'

import classNames from './scroller.css'

export const BaseScroller = ({
  children,
  height,
  className,
  id,
  hideScrollBar = true
}) => {
  const classNamesArr = []
  const style = {}
  if (height) {
    classNamesArr.push(classNames.scrollerWithHeight)
    style.height = p2r(height)
  } else {
    classNamesArr.push(classNames.scrollerWithNoHeight)
  }
  if (hideScrollBar) {
    classNamesArr.push(classNames.hideScrollBar)
  }
  if (className) {
    classNamesArr.push(className)
  }
  return (
    <div className={classNamesArr.join(' ')} style={style} id={id}>
      {children}
    </div>
  )
}

export default class Scroller extends Component {
  id = `scroller_${Date.now()}`

  position = 0

  touchStartPoint = null

  gestureListenerBinded = false

  scrollTo = position => {
    this.scrollEle.scrollTop = position
  }

  updatePosition = () => {
    const { onBottomThreshold = 100 } = this.props

    const { scrollTop, scrollHeight, clientHeight } = this.scrollEle
    let newPosition
    if (scrollTop <= 0) {
      if (clientHeight >= scrollHeight) {
        // 顶部，内容少，不足以滚动
        newPosition = 0
      } else {
        // 顶部，可以滚动
        newPosition = 1
      }
    } else if (scrollTop + clientHeight >= scrollHeight) {
      // 底部
      newPosition = 4
    } else if (scrollTop + clientHeight > scrollHeight - onBottomThreshold) {
      // 接近底部
      newPosition = 3
    } else {
      // 中间
      newPosition = 2
    }
    if (this.position !== newPosition) {
      this.position = newPosition
      this.onPositionChange(this.position)
    }
  }

  updatePositionThrottle = throttle(this.updatePosition, 200, 200)

  onPositionChange = newPosition => {
    const { onWillBottom, onBottom, onScrollerPositionChange } = this.props
    if (newPosition < 2 || newPosition > 3) {
      this.bindGestureListener()
    } else {
      this.unbindGestureListener()
    }
    newPosition === 3 && onWillBottom && onWillBottom()
    newPosition === 4 && onBottom && onBottom()
    onScrollerPositionChange && onScrollerPositionChange(newPosition)
  }

  onTouchStart = event => {
    if (!event.LOCKED_BY_CHILDREN) {
      event.LOCKED_BY_CHILDREN = true
      this.touchStartPoint = event.targetTouches[0]
    }
  }

  onTouchMove = event => {
    if (!event.LOCKED_BY_CHILDREN) {
      const { onPullDown, onPullUp } = this.props
      const { angle, yDistance } = computePosition(
        this.touchStartPoint,
        event.touches[0]
      )
      if (
        (this.position === 0 || this.position === 1) &&
        yDistance > 0 &&
        Math.abs(angle) < 30
      ) {
        // 在顶部下拉
        event.preventDefault()
        onPullDown && onPullDown(yDistance)
      } else if (this.position === 4 && yDistance < 0 && Math.abs(angle) < 30) {
        // 在最底部上拉
        event.preventDefault()
        onPullUp && onPullUp(-yDistance)
      }
    }
    event.LOCKED_BY_CHILDREN = true
  }

  onTouchEnd = event => {
    if (!event.LOCKED_BY_CHILDREN) {
      event.LOCKED_BY_CHILDREN = true
      const { yDistance } = computePosition(
        this.touchStartPoint,
        event.changedTouches[0]
      )
      this.props.onPullDownEnd && this.props.onPullDownEnd(yDistance)
      this.props.onPullUpEnd && this.props.onPullUpEnd(yDistance)
    }
  }

  bindPositionListener = () => {
    if (!this.scrollEventTarget.__LISTEN_BY__) {
      this.scrollEventTarget.__LISTEN_BY__ = this.id
      this.scrollEventTarget.addEventListener(
        'scroll',
        this.updatePositionThrottle,
        {
          passive: true
        }
      )
      // eslint-disable-next-line
      this.observer = new MutationObserver(this.updatePosition)
      this.observer.observe(this.observerEle, {
        childList: true,
        subtree: true
      })
    }
  }

  unbindPositionListener = () => {
    this.scrollEventTarget.__LISTEN_BY__ = undefined
    this.scrollEventTarget.removeEventListener(
      'scroll',
      this.updatePositionThrottle,
      {
        passive: true
      }
    )
    this.observer && this.observer.disconnect()
    this.observer = null
  }

  bindGestureListener = () => {
    if (!this.gestureListenerBinded) {
      this.mySelf.addEventListener('touchstart', this.onTouchStart, {
        passive: true
      })
      this.mySelf.addEventListener('touchmove', this.onTouchMove, {
        passive: false
      })
      this.mySelf.addEventListener('touchend', this.onTouchEnd, {
        passive: true
      })
      this.gestureListenerBinded = true
    }
  }

  unbindGestureListener = () => {
    if (this.gestureListenerBinded) {
      this.mySelf.removeEventListener('touchstart', this.onTouchStart, {
        passive: true
      })
      this.mySelf.removeEventListener('touchmove', this.onTouchMove, {
        passive: false
      })
      this.mySelf.removeEventListener('touchend', this.onTouchEnd, {
        passive: true
      })
      this.gestureListenerBinded = false
    }
  }

  componentDidMount() {
    this.mySelf = document.getElementById(this.id)
    this.scrollEventTarget = getScrollEventTarget(this.mySelf)
    if (this.scrollEventTarget === window) {
      this.scrollEle = document.documentElement
      this.observerEle = document.body
    } else {
      this.observerEle = this.scrollEle = this.scrollEventTarget
    }
    this.bindPositionListener()
    this.bindGestureListener()
  }

  componentWillUnmount() {
    this.unbindPositionListener(this.scrollEventTarget)
    this.unbindGestureListener()
  }

  render() {
    return <BaseScroller {...this.props} id={this.id} />
  }
}

export const ScrollerWithRefresh = WithRefresh(Scroller)

export const ScrollerWithLoadMore = WithLoadMore(Scroller)

export const ScrollerWithRefreshAndLoadMore = WithLoadMore(ScrollerWithRefresh)
