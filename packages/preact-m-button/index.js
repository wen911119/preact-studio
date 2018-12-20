import { h } from 'preact'
import { XCenterView } from '@ruiyun/preact-layout-suite'
import Text from '@ruiyun/preact-text'
import { TouchableInline } from '@ruiyun/preact-m-touchable'
import p2r from 'p-to-r'

const Button = ({
  children,
  height = 80,
  width = 690,
  textColor,
  textSize,
  color,
  onPress,
  disable,
  borderRadius = 8,
  borderColor = '#333'
}) => {
  const _textColor = disable ? '#fff' : textColor || (color && '#fff')
  let _style = {
    borderRadius: p2r(borderRadius)
  }
  if (!color && !disable) {
    _style.border = `1px solid ${borderColor}`
  }
  return (
    <TouchableInline
      opacity={color ? 0.8 : 0.3}
      onPress={onPress}
      disable={disable}
    >
      <XCenterView
        height={height}
        width={width}
        bgColor={disable ? '#ccc' : color}
        style={_style}
      >
        <Text color={_textColor} size={textSize}>
          {children}
        </Text>
      </XCenterView>
    </TouchableInline>
  )
}

export default Button
