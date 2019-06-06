import { h } from 'preact'
import { RowView } from '@ruiyun/preact-layout-suite'
import Text from '@ruiyun/preact-text'
import p2r from 'p-to-r'
import btnClass from './index.css'
// 解决ios上active伪类无效的问题
document.body.addEventListener('touchstart', () => {})

// eslint-disable-next-line
const withClassName = classNameToAdd => (BaseComponent, defaultDegree) => ({
  className,
  disable,
  ...otherProps
}) => {
  const degree = otherProps[classNameToAdd] || defaultDegree
  const _classNameToAdd = classNameToAdd + (degree ? degree * 1000 : '')
  const _className = disable
    ? className
    : className
      ? className + ` ${btnClass[_classNameToAdd]}`
      : btnClass[_classNameToAdd]
  return (
    <BaseComponent {...otherProps} disable={disable} className={_className} />
  )
}

export const withOpacity = withClassName('opacity')

export const withScale = withClassName('scale')

export const withShadow = withClassName('shadow')

export const RawButton = ({
  children,
  height,
  width,
  textColor,
  textSize,
  color,
  disable,
  borderRadius = 8,
  borderColor = '#333',
  disableColor = '#ccc',
  style,
  onClick,
  _undefine_,
  ...otherProps
}) => {
  const _textColor = disable ? '#fff' : textColor || (color && '#fff')
  let _style = {
    borderRadius: p2r(borderRadius)
  }
  if (!color && !disable) {
    _style.border = `0.5px solid ${borderColor}`
  }
  return (
    <RowView
      hAlign="center"
      height={height}
      width={width}
      bgColor={disable ? disableColor : color}
      style={Object.assign({}, style, _style)}
      onClick={disable ? _undefine_ : onClick}
      {...otherProps}
    >
      <Text color={_textColor} size={textSize}>
        {children}
      </Text>
    </RowView>
  )
}

const RawTextButton = ({
  children,
  textColor,
  textSize,
  disable,
  disableColor = '#ccc',
  onClick,
  padding = [0, 0, 0, 0],
  style,
  _undefine_,
  ...otherProps
}) => {
  const _textColor = disable ? disableColor : textColor
  const _style = Object.assign({}, style, {
    paddingTop: p2r(padding[0]),
    paddingRight: p2r(padding[1]),
    paddingBottom: p2r(padding[2]),
    paddingLeft: p2r(padding[3])
  })
  return (
    <Text
      onClick={disable ? _undefine_ : onClick}
      {...otherProps}
      color={_textColor}
      size={textSize}
      style={_style}
    >
      {children}
    </Text>
  )
}

export const FlatButton = withShadow(RawButton, 0.2)

export const TextButton = withOpacity(withScale(RawTextButton, 0.985), 0.3)

export default withOpacity(withScale(RawButton, 0.985), 0.8)
