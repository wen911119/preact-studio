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
  backgroundColor: 'rgba(0,0,0,0.2)',
  justifyContent: 'center',
  alignItems: 'center',
  animationDuration: '.3s',
  transition: 'opacity .3s',
  opacity: 1
}
let styleSheet = document.styleSheets[0]
const keyframesFadein = `
    @keyframes modal-mask-fadein {
        0%{opacity: 0} 
        100%{opacity: 1}
    }`
styleSheet.insertRule(keyframesFadein, styleSheet.cssRules.length)
const keyframesZoom = `
    @keyframes modal-content-zoom {
      0%{transform: scale(0)}
      50%{transform: scale(1.1)}
      100%{transform: scale(1)}
    }`
styleSheet.insertRule(keyframesZoom, styleSheet.cssRules.length)
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
    this.modalContentStyle = {
      animationDuration: '.3s',
      transition: 'transform .3s',
      animationName: 'modal-content-zoom'
    }
    if (!props.position || props.position === 'center') {
      this.modalContentStyle.animationName = 'modal-content-zoom'
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
    {
      open,
      into = 'body',
      children,
      onMaskClick,
      style = {}
    },
    { close }
  ) => {
    let mergedStyle = Object.assign({}, baseStyle, style)
    if (open) {
      mergedStyle.animationName = 'modal-mask-fadein'
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
          <div style={this.modalContentStyle}>{children}</div>
        </div>
      </Portal>
    ) : null
  }
}
