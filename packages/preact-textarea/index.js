import { h } from 'preact'
import px2rem from 'p-to-r'
import defaultStyle from './index.css'

const onBlurWrap = onblur => e => {
  onblur && onblur(e)
  // fix#ios 键盘收起页面推上去没有自动拉下来的bug
  window.scrollTo()
}

const TextArea = ({
  height,
  width,
  textSize = 30,
  textColor = '#666',
  style,
  className = '',
  value = '', // 解决undefined不能覆盖原值的问题
  onBlur,
  borderColor = '#eaeaea',
  padding = 10,
  ...otherProps
}) => {
  return (
    <textarea
      {...otherProps}
      onBlur={onBlurWrap(onBlur)}
      value={value}
      className={`${defaultStyle.textArea} ${className}`}
      style={Object.assign(
        {
          height: px2rem(height),
          width: px2rem(width),
          fontSize: px2rem(textSize),
          color: textColor,
          padding: px2rem(padding),
          border: '1px solid ' + borderColor
        },
        style
      )}
    />
  )
}

export default TextArea
