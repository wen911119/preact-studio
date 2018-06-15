import { h } from 'preact'
const Text = ({ children, size = 30, color = '#333', style = {} }) => (
  <span
    style={Object.assign(
      { color, fontSize: pxToRem(size), lineHeight: '1.2em' },
      style
    )}
  >
    {children}
  </span>
)
export default Text

function pxToRem (px) {
  return `${px / 75}rem`
}
