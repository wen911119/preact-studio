import { h } from 'preact'
import _px2rem from 'p-to-r'

const px2rem = px => typeof px === 'number' ? _px2rem(px) : px

function alternateInsert (arr, item) {
  let insertedArr = arr.reduce((all, current) => all.concat(current, item), [])
  insertedArr.pop()
  return insertedArr
}

export const RowView = ({
  children,
  vAlign = 'center',
  hAlign = 'flex-start',
  height = 'initial',
  width = 'initial',
  bgColor = 'transparent',
  padding = [0, 0, 0, 0],
  margin = [0, 0, 0, 0],
  style = {},
  className = ''
}) => (
  <div
    className={className}
    style={Object.assign(
      {
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'row',
        alignItems: vAlign,
        justifyContent: hAlign,
        backgroundColor: bgColor,
        paddingTop: px2rem(padding[0]),
        paddingRight: px2rem(padding[1]),
        paddingBottom: px2rem(padding[2]),
        paddingLeft: px2rem(padding[3]),
        marginTop: px2rem(margin[0]),
        marginRight: px2rem(margin[1]),
        marginBottom: px2rem(margin[2]),
        marginLeft: px2rem(margin[3]),
        height: px2rem(height),
        width: px2rem(width)
      },
      style
    )}
  >
    {children}
  </div>
)

export const ColumnView = ({
  children,
  vAlign = 'initial',
  hAlign = 'initial',
  padding = [0, 0, 0, 0],
  margin = [0, 0, 0, 0],
  bgColor = 'transparent',
  width = 'initial',
  height = 'initial',
  style = {},
  className = ''
}) => {
  let mergedStyle = Object.assign(
    {
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: hAlign,
      justifyContent: vAlign,
      backgroundColor: bgColor,
      paddingTop: px2rem(padding[0]),
      paddingRight: px2rem(padding[1]),
      paddingBottom: px2rem(padding[2]),
      paddingLeft: px2rem(padding[3]),
      marginTop: px2rem(margin[0]),
      marginRight: px2rem(margin[1]),
      marginBottom: px2rem(margin[2]),
      marginLeft: px2rem(margin[3]),
      height: px2rem(height),
      width: px2rem(width)
    },
    style
  )
  return (
    <div className={className} style={mergedStyle}>
      {children}
    </div>
  )
}

export const XCenterView = ({
  className = '',
  children,
  style = {},
  height = 'initial',
  width = 'initial',
  bgColor = 'transparent'
}) => (
  <div
    className={className}
    style={Object.assign(
      {
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: bgColor,
        height: px2rem(height),
        width: px2rem(width)
      },
      style
    )}
  >
    {children}
  </div>
)

export const SpaceHolder = ({ width = 0, height = 0 }) => (
  <div style={{ width: px2rem(width), height: px2rem(height) }} />
)

export const SlotRowView = ({ slot, children, ...otherProps }) => {
  let allChildren = children
  if (slot) {
    if (typeof slot === 'number') {
      allChildren = alternateInsert(children, <SpaceHolder width={slot} />)
    }
    else {
      allChildren = alternateInsert(children, slot)
    }
  }
  return <RowView {...otherProps}>{allChildren}</RowView>
}

export const SlotColumnView = ({ slot = 0, children, ...otherProps }) => {
  let allChildren = children
  if (slot) {
    if (typeof slot === 'number') {
      allChildren = alternateInsert(children, <SpaceHolder height={slot} />)
    }
    else {
      allChildren = alternateInsert(children, slot)
    }
  }
  return <ColumnView {...otherProps}>{allChildren}</ColumnView>
}
