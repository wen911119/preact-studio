import { h } from 'preact'

const scaleDefault = 1 / (window.devicePixelRatio || 1)

const Line = ({
  color = '#eaeaea',
  v = false,
  width = '100%',
  height = '100%',
  size = '1px',
  scale
}) => {
  let baseStyle = { backgroundColor: color, width, height }
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
