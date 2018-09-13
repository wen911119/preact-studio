import { h } from 'preact'
import px2rem from 'p-to-r'
const scaleDefault = 1 / (window.devicePixelRatio || 1)

const Line = ({
  color = '#eaeaea',
  v = false,
  // width = '100%',
  // height = '100%',
  size = '1px',
  scale,
  indent = [0, 0]
}) => {
  let wrapStyle = {
    boxSizing: 'border-box'
  }
  let baseStyle = {
    backgroundColor: color,
    width: '100%',
    height: '100%'
  }
  if (!v) {
    baseStyle.height = size
    baseStyle.transform = `scaleY(${scale || scaleDefault})`
    wrapStyle.paddingLeft = px2rem(indent[0])
    wrapStyle.paddingRight = px2rem(indent[1])
    wrapStyle.width = '100%'
  }
  else if (v) {
    baseStyle.width = size
    baseStyle.transform = `scaleX(${scale || scaleDefault})`
    wrapStyle.paddingTop = px2rem(indent[0])
    wrapStyle.paddingBottom = px2rem(indent[1])
    wrapStyle.height = '100%'
  }
  return (
    <div style={wrapStyle}>
      <div style={baseStyle} />
    </div>
  )
}

export default Line
