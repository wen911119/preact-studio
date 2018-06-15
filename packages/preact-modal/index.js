import { h, Component } from 'preact'
import Portal from 'preact-portal'

const baseStyle = {
  display: 'flex',
  position: 'fixed',
  zIndex: 100,
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.45)',
  justifyContent: 'center',
  alignItems: 'center',
  animationDuration: '.3s',
  transition: 'opacity .3s',
  opacity: 1
}
let styleSheet = document.styleSheets[0]
const keyframesShow = `
    @keyframes mask-fadein {
        0%{opacity: 0} 
        100%{opacity: 1}
    }`
styleSheet.insertRule(keyframesShow, styleSheet.cssRules.length)

function hack (maskClickHander) {
  return function (e) {
    e.target.className.indexOf('_modal_mask_') > -1 &&
      maskClickHander &&
      maskClickHander()
  }
}

function noMove (e) {
  e.preventDefault()
}

export default class Modal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      close: !props.open
    }
  }
  componentWillReceiveProps (nextProps) {
    if (this.props.open !== nextProps.open) {
      if (!(this.state.close = nextProps.open)) {
        setTimeout(() => this.setState({ close: true }), 300)
      }
    }
  }
  render = (
    { open, into = 'body', children, onMaskClick, style = {} },
    { close }
  ) => {
    let mergedStyle = Object.assign({}, baseStyle, style)
    if (open) {
      mergedStyle.animationName = 'mask-fadein'
    }
    else {
      mergedStyle.opacity = 0
    }
    return open || !close ? (
      <Portal into={into}>
        <div
          className="_modal_mask_"
          onClick={hack(onMaskClick)}
          onTouchMove={noMove}
          style={mergedStyle}
        >
          {children}
        </div>
      </Portal>
    ) : null
  }
}
