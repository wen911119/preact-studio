import { h } from 'preact'
import px2rem from 'p-to-r'
import defaultStyle from './input.css'

const onBlurWrap = onblur => e => {
  onblur && onblur(e)
  // fix#ios 键盘收起页面推上去没有自动拉下来的bug
  window.scrollTo(Math.max(
    window.pageYOffset || 0,
    document.documentElement.scrollTop
  ),0)
}

const Input = ({
  height,
  width,
  textSize = 30,
  textColor = '#666',
  style,
  className = '',
  value = '', // 解决undefined不能覆盖原值的问题
  onBlur,
  ...otherProps
}) => (
  <input
    {...otherProps}
    onBlur={onBlurWrap(onBlur)}
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
