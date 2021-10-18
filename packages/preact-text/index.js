import { h } from 'preact'
import px2rem from 'p-to-r'

const Text = ({
  children,
  size = 30,
  color = '#333333',
  weight = 'initial',
  style,
  lineHeight = 'normal',
  ...otherProps
}) => (
  <span
    {...otherProps}
    style={Object.assign(
      {
        color,
        fontSize: px2rem(size),
        fontWeight: weight,
        lineHeight
      },
      style
    )}
  >
    {children}
  </span>
)
export default Text
