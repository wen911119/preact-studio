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
  animationDuration: '0.3s'
}

let styleSheet = document.styleSheets[0]
const keyframesShow = `
    @keyframes mask-fadein {
        0%{opacity: 0} 
        100%{opacity: 1}
    }`
const keyframesHide = `
    @keyframes mask-fadeout {
      0%{opacity: 1} 
      100%{opacity: 0}
    }`
styleSheet.insertRule(keyframesShow, styleSheet.cssRules.length)
styleSheet.insertRule(keyframesHide, styleSheet.cssRules.length)
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
    if (!(this.state.close = nextProps.open)) {
      // 延迟0.3s关闭，等动画结束
      setTimeout(() => this.setState({ close: true }), 300)
    }
  }
  render = (
    { open, into = 'body', children, onMaskClick, style = {} },
    { close }
  ) =>
    open || !close ? (
      <Portal into={into}>
        <div
          className="_modal_mask_"
          onClick={hack(onMaskClick)}
          onTouchMove={noMove}
          style={Object.assign({}, baseStyle, style, {
            animationName: open ? 'mask-fadein' : 'mask-fadeout'
          })}
        >
          {children}
        </div>
      </Portal>
    ) : null
}
