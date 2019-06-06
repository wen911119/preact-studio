import { h } from 'preact'
import px2rem from 'p-to-r'
import layout from './layout.css'

const styleEl = document.createElement('style')
let injectedStyle = ''
for (let i = 1; i <= 500; i++) {
  injectedStyle += `.child-mgr-${i}>*{margin-right:${px2rem(
    i
  )}}.child-mgb-${i}>*{margin-bottom:${px2rem(i)}}`
}
styleEl.innerHTML = injectedStyle
document.head.appendChild(styleEl)
const styleParser = ({ padding, margin, bgColor, width, height }) => {
  let composeStyle = {}
  if (padding) {
    composeStyle = Object.assign(composeStyle, {
      paddingTop: px2rem(padding[0]),
      paddingRight: px2rem(padding[1]),
      paddingBottom: px2rem(padding[2]),
      paddingLeft: px2rem(padding[3])
    })
  }
  if (margin) {
    composeStyle = Object.assign(composeStyle, {
      marginTop: px2rem(margin[0]),
      marginRight: px2rem(margin[1]),
      marginBottom: px2rem(margin[2]),
      marginLeft: px2rem(margin[3])
    })
  }
  if (bgColor) {
    composeStyle.backgroundColor = bgColor
  }
  if (width) {
    composeStyle.width = px2rem(width)
  }
  if (height) {
    composeStyle.height = px2rem(height)
  }
  return composeStyle
}

const classNameParser = type => ({ vAlign, hAlign, className }) => {
  let classNames = [layout[type]]
  if (vAlign) {
    const classObject = layout[`${type}-v-${vAlign}`]
    classObject && classNames.push(classObject)
  }
  if (hAlign) {
    const classObject = layout[`${type}-h-${hAlign}`]
    classObject && classNames.push(classObject)
  }
  if (className) {
    classNames.push(className)
  }
  return classNames.join(' ')
}

function alternateInsert (arr, item) {
  let insertedArr = arr.reduce((all, current) => all.concat(current, item), [])
  insertedArr.pop()
  return insertedArr
}

export const RowView = ({
  children,
  vAlign,
  hAlign,
  height,
  width,
  bgColor,
  padding,
  margin,
  style = {},
  className,
  ...otherProps
}) => {
  const classNames = classNameParser('rowview')({ vAlign, hAlign, className })
  const composeStyle = styleParser({ padding, margin, bgColor, width, height })
  return (
    <div
      {...otherProps}
      className={classNames}
      style={Object.assign(composeStyle, style)}
    >
      {children}
    </div>
  )
}

export const ColumnView = ({
  children,
  vAlign,
  hAlign,
  padding,
  margin,
  bgColor,
  width,
  height,
  style = {},
  className,
  ...otherProps
}) => {
  const classNames = classNameParser('columnview')({
    vAlign,
    hAlign,
    className
  })
  const composeStyle = styleParser({ padding, margin, bgColor, width, height })
  return (
    <div
      {...otherProps}
      className={classNames}
      style={Object.assign(composeStyle, style)}
    >
      {children}
    </div>
  )
}

export const XCenterView = ({
  className,
  children,
  style = {},
  height,
  width,
  bgColor,
  ...otherProps
}) => {
  let classNames = layout.xcenter
  if (className) {
    classNames = classNames + ' ' + className
  }
  const composeStyle = styleParser({ bgColor, width, height })
  return (
    <div
      {...otherProps}
      className={classNames}
      style={Object.assign(composeStyle, style)}
    >
      {children}
    </div>
  )
}

export const SpaceHolder = ({ width = 0, height = 0 }) => (
  <div style={{ width: px2rem(width), height: px2rem(height) }} />
)

export const SlotRowView = ({
  slot,
  legacy,
  children,
  className,
  ...otherProps
}) => {
  let allChildren = children
  if (slot) {
    if (typeof slot === 'number') {
      if (legacy) {
        // 保留旧的插div占空间的模式
        allChildren = alternateInsert(children, <SpaceHolder width={slot} />)
      }
      else {
        className = className ? className + ' ' : ''
        className = className + `child-mgr-${slot} ${layout.slotrowview}`
      }
    }
    else if (children.length > 1) {
      allChildren = alternateInsert(children, slot)
    }
  }
  return (
    <RowView {...otherProps} className={className}>
      {allChildren}
    </RowView>
  )
}

export const SlotColumnView = ({
  slot,
  legacy,
  className,
  children,
  ...otherProps
}) => {
  let allChildren = children
  if (slot) {
    if (typeof slot === 'number') {
      if (legacy) {
        // 保留旧的插div占空间的模式
        allChildren = alternateInsert(children, <SpaceHolder height={slot} />)
      }
      else {
        className = className ? className + ' ' : ''
        className = className + `child-mgb-${slot} ${layout.slotcolumnview}`
      }
    }
    else {
      allChildren = alternateInsert(children, slot)
    }
  }
  return (
    <ColumnView {...otherProps} className={className}>
      {allChildren}
    </ColumnView>
  )
}
