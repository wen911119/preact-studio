import { h } from 'preact'
import p2r from 'p-to-r'

import classNames from './scroller.css'

import useId from './useId'
import usePreventBounce from './usePreventBounce'
import usePosition from './usePosition'
import useLoadMore from './useLoadMore'
import useRefresh from './useRefresh'

import { DefaultLoadMoreFooter, DefaultRefreshHeader } from './default'

export const BaseScroller = ({
  children,
  height,
  className,
  id,
  hideScrollBar = true,
  minHeight
}) => {
  const classNamesArr = []
  const style = {
    minHeight
  }
  if (height) {
    classNamesArr.push(classNames.scrollerWithHeight)
    if (height === 'flex1') {
      classNamesArr.push(classNames.flex1)
    } else {
      style.height = p2r(height)
    }
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

export const ScrollerWithPreventBounce = ({ degree, id, ...otherProps }) => {
  const scrollerId = useId(id)
  const position = usePosition(scrollerId)
  usePreventBounce(scrollerId, position, degree)
  return <BaseScroller id={scrollerId} {...otherProps} />
}

export const ScrollerWithLoadMore = ({
  onLoadMore,
  children,
  LoadMoreFooter = DefaultLoadMoreFooter,
  id,
  ...otherProps
}) => {
  const scrollerId = useId(id)
  const position = usePosition(scrollerId)
  const [stage, retry] = useLoadMore(position, onLoadMore)
  return (
    <BaseScroller id={scrollerId} {...otherProps}>
      {children}
      <LoadMoreFooter stage={stage} onRetry={retry} />
    </BaseScroller>
  )
}

export const ScrollerWithRefresh = ({
  onRefresh,
  children,
  RefreshHeader = DefaultRefreshHeader,
  refreshHeaderHeight,
  refreshDamping,
  degree,
  id,
  ...otherProps
}) => {
  const scrollerId = useId(id)
  const position = usePosition(scrollerId)
  const { stage, distance } = useRefresh({
    id: scrollerId,
    position,
    onRefresh,
    resetLoadMore: undefined,
    refreshHeaderHeight,
    refreshDamping,
    degree
  })
  return (
    <BaseScroller id={scrollerId} {...otherProps}>
      <RefreshHeader
        stage={stage}
        distance={distance}
        refreshHeaderHeight={refreshHeaderHeight}
      />
      {children}
    </BaseScroller>
  )
}

export const ScrollerWithRefreshAndLoadMore = ({
  onLoadMore,
  onRefresh,
  children,
  RefreshHeader = DefaultRefreshHeader,
  LoadMoreFooter = DefaultLoadMoreFooter,
  refreshHeaderHeight,
  refreshDamping,
  degree,
  id,
  ...otherProps
}) => {
  const scrollerId = useId(id)
  const position = usePosition(scrollerId)
  const [stage, retry, reset] = useLoadMore(position, onLoadMore)
  const { stage: step, distance } = useRefresh({
    id: scrollerId,
    position,
    onRefresh,
    resetLoadMore: reset,
    refreshHeaderHeight,
    refreshDamping,
    degree
  })
  return (
    <BaseScroller id={scrollerId} {...otherProps}>
      <RefreshHeader
        stage={step}
        distance={distance}
        refreshHeaderHeight={refreshHeaderHeight}
      />
      {children}
      <LoadMoreFooter stage={stage} onRetry={retry} />
    </BaseScroller>
  )
}
