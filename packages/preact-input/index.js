import { h } from 'preact'
import px2rem from 'p-to-r'
import defaultStyle from './input.css'

const Input = ({
  height,
  width,
  textSize = 30,
  textColor = '#666',
  style,
  className = '',
  ...otherProps
}) => (
  <input
    {...otherProps}
    className={`${defaultStyle.input} ${className}`}
    style={Object.assign(
      {
        height: px2rem(height),
        width: px2rem(width),
        fontSize: px2rem(textSize),
        color: textColor
      },
      style
    )}
  />
)

export default Input
