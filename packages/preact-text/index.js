import { h } from 'preact'
import px2rem from 'p-to-r'

// lineHeight 默认改为1，为了更精准的还原设计稿 2020-04-02 11:27
const Text = ({
  children,
  size = 30,
  color = '#333',
  weight = 'initial',
  style = {},
  lineHeight = 1,
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
