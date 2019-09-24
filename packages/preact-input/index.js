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
  value = '', // 解决undefined不能覆盖原值的问题
  ...otherProps
}) => (
  <input
    {...otherProps}
    value={value}
    className={`${defaultStyle.input} ${className}`}
    style={Object.assign(
      {
        height: px2rem(height),
        width: px2rem(width),
        fontSize: px2rem(textSize),
        color: textColor,
        lineHeight: px2rem(height)
      },
      style
    )}
  />
)

export default Input
