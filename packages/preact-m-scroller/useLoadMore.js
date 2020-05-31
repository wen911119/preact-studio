import { useState, useRef, useEffect, useCallback } from 'preact/compat'
const useLoadMore = (position, onLoadMore) => {
  const [stage, updateStage] = useState('hide')
  const isLoading = useRef(false)
  const isError = useRef(false)
  const isNoMore = useRef(false)

  const computeStage = useCallback(
    position => {
      if (position === 0) {
        updateStage('hide')
      } else {
        const canLoadMore =
          !isLoading.current && !isError.current && !isNoMore.current
        if (canLoadMore) {
          updateStage('loading')
          if (position > 2) {
            isLoading.current = true
            onLoadMore(({ nomore, success }) => {
              isLoading.current = false
              if (!success) {
                isError.current = true
                updateStage('error')
              }
              if (nomore) {
                isNoMore.current = true
                updateStage('nomore')
              }
            })
          }
        }
      }
    },
    [isLoading, isError, isNoMore, updateStage, onLoadMore]
  )

  useEffect(() => {
    computeStage(position)
  }, [position])

  const reset = useCallback(() => {
    isLoading.current = false
    isError.current = false
    isNoMore.current = false
  }, [isLoading, isError, isNoMore])

  const retry = useCallback(() => {
    reset()
    computeStage(4)
  }, [reset, computeStage])

  return [stage, retry, reset]
}

export default useLoadMore
