import { h } from 'preact'
import px2rem from 'p-to-r'
import { useState, useCallback } from 'preact/compat'
import defaultStyle from './index.css'

const TextArea = ({
  height,
  width,
  textSize = 30,
  textColor = '#666',
  style,
  className = '',
  value = '', // 解决undefined不能覆盖原值的问题
  onBlur,
  onFocus,
  borderColor = '#eaeaea',
  focusBorderColor = '#5581FA',
  padding = 10,
  ...otherProps
}) => {
  const [isFocus, toggleFocus] = useState(false)
  const onFocusHandler = useCallback(e => {
    onFocus && onFocus(e)
    toggleFocus(true)
  }, [])
  const onBlurHandler = useCallback(e => {
    onBlur && onBlur(e)
    toggleFocus(false)
    // fix#ios 键盘收起页面推上去没有自动拉下来的bug
    window.scrollTo()
  }, [])
  return (
    <textarea
      {...otherProps}
      onBlur={onBlurHandler}
      onFocus={onFocusHandler}
      value={value}
      className={`${defaultStyle.textArea} ${className}`}
      style={Object.assign(
        {
          height: px2rem(height),
          width: px2rem(width),
          fontSize: px2rem(textSize),
          color: textColor,
          lineHeight: px2rem(height),
          padding: px2rem(padding),
          border: '1px solid ' + (isFocus ? focusBorderColor : borderColor)
        },
        style
      )}
    />
  )
}

export default TextArea
