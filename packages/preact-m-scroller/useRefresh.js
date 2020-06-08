import { useState, useRef, useEffect, useCallback } from 'preact/compat'
import { computePosition } from './utils'

const useRefresh = ({
  id,
  position,
  onRefresh,
  resetLoadMore,
  degree = 30,
  refreshHeaderHeight = 50,
  refreshDamping = 2.5
}) => {
  const [refreshState, updateRefreshState] = useState({
    stage: 1,
    distance: 0
  })

  const startPoint = useRef(null)
  const isLoading = useRef(false)

  const onTouchStartHandler = useCallback(
    event => {
      if (!isLoading.current) {
        startPoint.current = event.touches[0]
      }
    },
    [isLoading, startPoint]
  )
  const onTouchMoveHandler = useCallback(
    event => {
      if (startPoint.current) {
        const { angle, yDistance } = computePosition(
          startPoint.current,
          event.touches[0]
        )
        if (yDistance > 0 && Math.abs(angle) < degree) {
          event.preventDefault()
          event.stopPropagation()
          const distance = yDistance / refreshDamping
          window.requestAnimationFrame(() => {
            updateRefreshState({
              stage: distance > refreshHeaderHeight ? 2 : 1,
              distance
            })
          })
        }
      }
    },
    [
      startPoint,
      updateRefreshState,
      degree,
      refreshDamping,
      refreshHeaderHeight
    ]
  )
  const onTouchEndHandler = useCallback(
    event => {
      if (startPoint.current) {
        const { yDistance } = computePosition(
          startPoint.current,
          event.changedTouches[0]
        )
        if (yDistance > refreshHeaderHeight * refreshDamping) {
          window.requestAnimationFrame(() => {
            updateRefreshState({
              stage: 3,
              distance: refreshHeaderHeight
            })
          })

          isLoading.current = true
          onRefresh(ret => {
            isLoading.current = false
            updateRefreshState({
              stage: 4,
              distance: 0
            })
            resetLoadMore && ret && ret.success && resetLoadMore()
          })
        } else {
          window.requestAnimationFrame(() => {
            updateRefreshState({
              stage: 4,
              distance: 0
            })
          })
        }
        startPoint.current = null
      }
    },
    [
      startPoint,
      isLoading,
      updateRefreshState,
      refreshHeaderHeight,
      refreshDamping,
      onRefresh,
      resetLoadMore
    ]
  )

  const addListener = useCallback(() => {
    const ele = document.getElementById(id)
    if (ele) {
      ele.addEventListener('touchstart', onTouchStartHandler, {
        passive: true
      })
      ele.addEventListener('touchmove', onTouchMoveHandler, {
        passive: false
      })
      ele.addEventListener('touchend', onTouchEndHandler, {
        passive: true
      })
    }
  }, [id, onTouchStartHandler, onTouchMoveHandler, onTouchEndHandler])

  const removeListener = useCallback(() => {
    const ele = document.getElementById(id)
    if (ele) {
      ele.removeEventListener('touchstart', onTouchStartHandler, {
        passive: true
      })
      ele.removeEventListener('touchmove', onTouchMoveHandler, {
        passive: false
      })
      ele.removeEventListener('touchend', onTouchEndHandler, {
        passive: true
      })
    }
  }, [id, onTouchStartHandler, onTouchMoveHandler, onTouchEndHandler])

  useEffect(() => {
    if (position < 2) {
      addListener()
    }
    return removeListener
  }, [position, addListener, removeListener])

  return refreshState
}

export default useRefresh
