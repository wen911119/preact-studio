import { h } from 'preact'
import px2rem from 'p-to-r'
const Text = ({ children, size = 30, color = '#333', style = {} }) => (
  <span
    style={Object.assign(
      { color, fontSize: px2rem(size), lineHeight: '1.2em' },
      style
    )}
  >
    {children}
  </span>
)
export default Text