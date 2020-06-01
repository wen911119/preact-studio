import { useRef } from 'preact/compat'

const useId = id => {
  if (id) {
    return id
  }
  return useRef(`scroller_${Math.random()}`).current
}

export default useId
