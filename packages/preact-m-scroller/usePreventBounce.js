import { useEffect, useRef, useCallback } from 'preact/compat'
import { computePosition } from './utils'

// 解决滚动穿透问题
// 等overscroll-behavior普及时就可以去掉了
const usePreventBounce = (id, position, degree = 90) => {
  const touchstartPoint = useRef(null)

  const onTouchStartHandler = useCallback(
    event => {
      touchstartPoint.current = event.touches[0]
    },
    [touchstartPoint]
  )

  const preventVerticalTouchMove = useCallback(
    event => {
      const { angle } = computePosition(
        touchstartPoint.current,
        event.touches[0]
      )
      if (Math.abs(angle) < degree) {
        event.preventDefault()
      }
    },
    [touchstartPoint, degree]
  )
  const preventPullDown = useCallback(
    event => {
      const { angle, yDistance } = computePosition(
        touchstartPoint.current,
        event.touches[0]
      )
      if (Math.abs(angle) < degree && yDistance > 0) {
        event.preventDefault()
      }
    },
    [touchstartPoint, degree]
  )
  const preventPullUp = useCallback(
    event => {
      const { angle, yDistance } = computePosition(
        touchstartPoint.current,
        event.touches[0]
      )
      if (Math.abs(angle) < degree && yDistance < 0) {
        event.preventDefault()
      }
    },
    [touchstartPoint, degree]
  )

  const addListener = useCallback(
    position => {
      const ele = document.getElementById(id)
      if (ele) {
        ele.addEventListener('touchstart', onTouchStartHandler, {
          passive: true
        })
        if (position === 0) {
          // 内容高度不足以滚动时阻止垂直touchmove
          ele.addEventListener('touchmove', preventVerticalTouchMove, {
            passive: false
          })
        } else if (position === 1) {
          // 在顶部阻止下拉手势
          ele.addEventListener('touchmove', preventPullDown, {
            passive: false
          })
        } else if (position === 4) {
          // 在底部阻止上拉手势
          ele.addEventListener('touchmove', preventPullUp, {
            passive: false
          })
        }
      }
    },
    [
      id,
      onTouchStartHandler,
      preventVerticalTouchMove,
      preventPullDown,
      preventPullUp
    ]
  )

  const removeListener = useCallback(() => {
    const ele = document.getElementById(id)
    if (ele) {
      ele.removeEventListener('touchstart', onTouchStartHandler, {
        passive: true
      })
      ele.removeEventListener('touchmove', preventVerticalTouchMove, {
        passive: false
      })
      ele.removeEventListener('touchmove', preventPullDown, {
        passive: false
      })
      ele.removeEventListener('touchmove', preventPullUp, {
        passive: false
      })
    }
  }, [
    id,
    onTouchStartHandler,
    preventVerticalTouchMove,
    preventPullDown,
    preventPullUp
  ])

  useEffect(() => {
    if (position < 2 || position === 4) {
      addListener(position)
    }
    return removeListener
  }, [position, addListener, removeListener])
}

export default usePreventBounce
