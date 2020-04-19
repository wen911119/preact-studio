import { h, Component, createRef } from 'preact'
import p2r from 'p-to-r'

import debounce from 'lodash.debounce'

import { WithRefreshController } from './refreshController.js'
import { WithLoadMore } from './loadMore.js'

import classNames from './scroller.css'

const computePosition = (startPoint, currentPoint) => {
  const xDistance = currentPoint.clientX - startPoint.clientX
  const yDistance = currentPoint.clientY - startPoint.clientY
  return {
    angle: (Math.atan(xDistance / yDistance) * 180) / Math.PI,
    xDistance,
    yDistance
  }
}

// 只是隐藏了滚动条的最基础scroller
export const BaseScroller = ({
  height,
  style,
  className = '',
  children,
  footerSlot,
  ...otherProps
}) => (
  <div
    style={Object.assign({ height: p2r(height) }, style)}
    className={
      classNames.scroller + (height ? ' ' : classNames.flex1) + className
    }
    {...otherProps}
  >
    {children}
    {footerSlot && footerSlot()}
  </div>
)

export default class Scroller extends Component {
  position = 0

  touchStartPoint = null

  baseScrollerRef = createRef()

  scrollTo = position => {
    this.baseScrollerRef.current.base.scrollTop = position
  }

  updatePosition = target => {
    const { onBottomThreshold = 25, onWillBottom } = this.props
    if (target.scrollHeight === target.clientHeight) {
      // 内容高度小于等于容器高度
      this.position = 0
    } else if (target.scrollTop === 0) {
      // 在顶部
      this.position = 1
    } else if (target.scrollTop + target.clientHeight === target.scrollHeight) {
      // 在底部
      this.position = 3
      onWillBottom && onWillBottom()
    } else {
      // 在中间
      if (
        target.scrollHeight - target.scrollTop - target.clientHeight <=
        onBottomThreshold
      ) {
        onWillBottom && onWillBottom()
      }
      this.position = 2
    }
    this.props.onScrollerPositionChange &&
      this.props.onScrollerPositionChange(this.position)
  }

  updatePositionDebounce = debounce(this.updatePosition, 50)

  onScroll = event => {
    this.updatePositionDebounce(event.target)
    this.props.onScroll && this.props.onScroll(event)
  }

  onTouchStart = event => {
    this.touchStartPoint = event.targetTouches[0]
    // 为了解决在顶部上滑，200毫秒内突然再次下拉导致position不正确
    this.updatePosition(this.baseScrollerRef.current.base)
  }

  onTouchMove = event => {
    if (this.position !== 2) {
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
        // 在对顶部下拉
        event.preventDefault()
        onPullDown && onPullDown(yDistance)
      } else if (this.position === 3 && yDistance < 0 && Math.abs(angle) < 30) {
        // 在最底部上拉
        event.preventDefault()
        onPullUp && onPullUp(-yDistance)
      }
    }
    event.stopPropagation()
  }

  onTouchEnd = event => {
    const { yDistance } = computePosition(
      this.touchStartPoint,
      event.changedTouches[0]
    )
    this.props.onPullDownEnd && this.props.onPullDownEnd(yDistance)
    this.props.onPullUpEnd && this.props.onPullUpEnd(yDistance)
  }

  componentDidMount() {
    // eslint-disable-next-line
    this.observer = new MutationObserver(() => {
      this.updatePosition(this.baseScrollerRef.current.base)
    })
    this.observer.observe(this.baseScrollerRef.current.base, {
      childList: true,
      subtree: true
    })
    this.updatePosition(this.baseScrollerRef.current.base)
  }

  componentWillUnmount() {
    this.observer && this.observer.disconnect()
    this.observer = null
  }

  render() {
    console.log('render-scroller')
    return (
      <BaseScroller
        {...this.props}
        ref={this.baseScrollerRef}
        onScroll={this.onScroll}
        onTouchStart={this.onTouchStart}
        onTouchMove={this.onTouchMove}
        onTouchEnd={this.onTouchEnd}
      />
    )
  }
}

export const ScrollerWithRefresh = WithRefreshController(Scroller)

export const ScrollerWithLoadMore = WithLoadMore(Scroller)

export const ScrollerWithRefreshAndLoadMore = WithLoadMore(ScrollerWithRefresh)
