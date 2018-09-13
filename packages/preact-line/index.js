import { h } from 'preact'
import px2rem from 'p-to-r'
const scaleDefault = 1 / (window.devicePixelRatio || 1)

const Line = ({
  color = '#eaeaea',
  v = false,
  width = '100%',
  height = '100%',
  size = '1px',
  scale,
  indent = [0, 0]
}) => {
  let baseStyle = {
    backgroundColor: color,
    width,
    height,
    marginLeft: px2rem(indent[0]),
    marginRight: px2rem(indent[1])
  }
  if (!v) {
    baseStyle.height = size
    baseStyle.transform = `scaleY(${scale || scaleDefault})`
  }
  else if (v) {
    baseStyle.width = size
    baseStyle.transform = `scaleX(${scale || scaleDefault})`
  }
  return <div style={baseStyle} />
}

export default Line
