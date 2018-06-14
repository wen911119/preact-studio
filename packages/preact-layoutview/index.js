import { h } from 'preact'
function pxToRem (px) {
  return px && `${px / 75}rem`
}

function alternateInsert (arr, item) {
  let insertedArr = arr.reduce((all, current) => all.concat(current, item), [])
  insertedArr.pop()
  return insertedArr
}

export const RowView = ({
  children,
  vAlign = 'center',
  hAlign = 'flex-start',
  height,
  width,
  bgColor = 'transparent',
  padding = [0, 0, 0, 0],
  margin = [0, 0, 0, 0],
  style = {},
  className
}) => (
  <div
    className={className}
    style={Object.assign(
      {
        display: 'flex',
        flexDirection: 'row',
        alignItems: vAlign,
        justifyContent: hAlign,
        backgroundColor: bgColor,
        paddingTop: pxToRem(padding[0]),
        paddingRight: pxToRem(padding[1]),
        paddingBottom: pxToRem(padding[2]),
        paddingLeft: pxToRem(padding[3]),
        marginTop: pxToRem(margin[0]),
        marginRight: pxToRem(margin[1]),
        marginBottom: pxToRem(margin[2]),
        marginLeft: pxToRem(margin[3]),
        height: pxToRem(height),
        width: pxToRem(width)
      },
      style
    )}
  >
    {children}
  </div>
)

export const ColumnView = ({
  children,
  flexDirection = 'column',
  vAlign = 'inherit',
  hAlign = 'inherit',
  padding = [0, 0, 0, 0],
  margin = [0, 0, 0, 0],
  bgColor = 'transparent',
  width,
  height,
  style = {},
  className
}) => (
  <div
    className={className}
    style={Object.assign(
      {
        display: 'flex',
        flexDirection: 'column',
        alignItems: hAlign,
        justifyContent: vAlign,
        backgroundColor: bgColor,
        paddingTop: pxToRem(padding[0]),
        paddingRight: pxToRem(padding[1]),
        paddingBottom: pxToRem(padding[2]),
        paddingLeft: pxToRem(padding[3]),
        marginTop: pxToRem(margin[0]),
        marginRight: pxToRem(margin[1]),
        marginBottom: pxToRem(margin[2]),
        marginLeft: pxToRem(margin[3]),
        height: pxToRem(height),
        width: pxToRem(width)
      },
      style
    )}
  >
    {children}
  </div>
)

export const XCenterView = ({
  className,
  children,
  style = {},
  height,
  width,
  bgColor = 'transparent'
}) => (
  <div
    className={className}
    style={Object.assign(
      {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: bgColor,
        height: pxToRem(height),
        width: pxToRem(width)
      },
      style
    )}
  >
    {children}
  </div>
)

export const SpaceHolder = ({ width = 0, height = 0 }) => (
  <div style={{ width: pxToRem(width), height: pxToRem(height) }} />
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
