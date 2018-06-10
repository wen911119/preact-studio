import { h } from 'preact'
function pxToRem (px) {
  return `${px / 75}rem`
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
  style = {}
}) => (
  <div
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
        height,
        width
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
  style = {}
}) => (
  <div
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
        height,
        width
      },
      style
    )}
  >
    {children}
  </div>
)

export const XCenterView = ({
  children,
  style = {},
  height,
  width,
  bgColor = 'transparent'
}) => (
  <div
    style={Object.assign(
      {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: bgColor,
        height,
        width
      },
      style
    )}
  >
    {children}
  </div>
)

export const Slot = ({ gap = 0 }) => <div style={{ width: gap }} />

export const SlotRowView = ({ gap = 0, children, ...otherProps }) => {
  const allChildren = alternateInsert(children, <Slot gap={gap} />)
  return <RowView {...otherProps}>{allChildren}</RowView>
}

export const Gap = ({ gap = 0 }) => <div style={{ height: gap }} />

export const SlotColumnView = ({ gap = 0, children, ...otherProps }) => {
  const allChildren = alternateInsert(children, <Gap gap={gap} />)
  return <ColumnView {...otherProps}>{allChildren}</ColumnView>
}
