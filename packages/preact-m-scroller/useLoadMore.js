import { useState, useRef, useEffect } from 'preact/compat'
const useLoadMore = (position, onLoadMore) => {
  const [stage, updateStage] = useState('hide')
  const isLoading = useRef(false)
  const isError = useRef(false)
  const isNoMore = useRef(false)

  const computeStage = position => {
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
  }

  useEffect(() => {
    computeStage(position)
  }, [position])

  const reset = () => {
    isLoading.current = false
    isError.current = false
    isNoMore.current = false
  }

  const retry = () => {
    reset()
    computeStage(position)
  }

  return [stage, retry, reset]
}

export default useLoadMore
