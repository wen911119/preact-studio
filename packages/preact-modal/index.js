import { h, Component, cloneElement } from 'preact'
import Portal from 'preact-portal'

const baseStyle = {
  display: 'flex',
  position: 'fixed',
  zIndex: 100,
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  animationDuration: '.3s'
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
const keyframesLeftIn = `
    @keyframes modal-content-left-in {
      0%{transform: translate3d(-100%, 0px, 0px)}
      100%{transform: translate3d(0px, 0px, 0px)}
    }`
styleSheet.insertRule(keyframesLeftIn, styleSheet.cssRules.length)
const keyframesRightIn = `
    @keyframes modal-content-right-in {
      0%{transform: translate3d(100%, 0px, 0px)}
      100%{transform: translate3d(0px, 0px, 0px)}
    }`
styleSheet.insertRule(keyframesRightIn, styleSheet.cssRules.length)
const keyframesTopIn = `
    @keyframes modal-content-top-in {
      0%{transform: translate3d(0px, -100%, 0px)}
      100%{transform: translate3d(0px, 0px, 0px)}
    }`
styleSheet.insertRule(keyframesTopIn, styleSheet.cssRules.length)
const keyframesBottomIn = `
    @keyframes modal-content-bottom-in {
      0%{transform: translate3d(0px, 100%, 0px)}
      100%{transform: translate3d(0px, 0px, 0px)}
    }`
styleSheet.insertRule(keyframesBottomIn, styleSheet.cssRules.length)
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

export default class ModalStateless extends Component {
  constructor (props) {
    super(props)
    this.state = {
      close: !props.open
    }
    this.modalContentStyle = {
      animationDuration: '.3s',
      transition: 'transform .3s'
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
    { open, into = 'body', children, onMaskClick, position, mask },
    { close }
  ) => {
    const style = { backgroundColor: `rgba(0,0,0,${mask})` }
    let maskStyle = Object.assign({}, baseStyle, style)
    if (open) {
      maskStyle.animationName = 'modal-mask-fadein'
    }
    else {
      maskStyle.backgroundColor = 'rgba(0,0,0,0)'
    }
    let modalContentStyle = Object.assign({}, this.modalContentStyle)
    if (position === 'center') {
      modalContentStyle.animationName = 'modal-content-zoom'
      maskStyle.transition = 'background-color .3s linear'
      maskStyle.justifyContent = 'center'
      maskStyle.alignItems = 'center'
      if (open) {
        modalContentStyle.transform = 'scale(1)'
      }
      else {
        modalContentStyle.transform = 'scale(0)'
      }
    }
    else if (position === 'left') {
      maskStyle.alignItems = 'center'
      maskStyle.transition = 'background-color .3s easy-out'
      if (open) {
        modalContentStyle.transform = 'translate3d(0px, 0px, 0px)'
        modalContentStyle.animationName = 'modal-content-left-in'
      }
      else {
        modalContentStyle.transform = 'translate3d(-100%, 0px, 0px)'
      }
    }
    else if (position === 'right') {
      maskStyle.alignItems = 'center'
      maskStyle.justifyContent = 'flex-end'
      maskStyle.transition = 'background-color .3s easy-in'
      if (open) {
        modalContentStyle.transform = 'translate3d(0px, 0px, 0px)'
        modalContentStyle.animationName = 'modal-content-right-in'
      }
      else {
        modalContentStyle.transform = 'translate3d(100%, 0px, 0px)'
      }
    }
    else if (position === 'top') {
      maskStyle.alignItems = 'flex-start'
      maskStyle.justifyContent = 'center'
      maskStyle.transition = 'background-color .3s easy-in-out'
      if (open) {
        modalContentStyle.transform = 'translate3d(0px, 0px, 0px)'
        modalContentStyle.animationName = 'modal-content-top-in'
      }
      else {
        modalContentStyle.transform = 'translate3d(0, -100%, 0px)'
      }
    }
    else if (position === 'bottom') {
      maskStyle.alignItems = 'flex-end'
      maskStyle.justifyContent = 'center'
      maskStyle.transition = 'background-color .3s easy-in-out'
      if (open) {
        modalContentStyle.transform = 'translate3d(0px, 0px, 0px)'
        modalContentStyle.animationName = 'modal-content-bottom-in'
      }
      else {
        modalContentStyle.transform = 'translate3d(0, 100%, 0px)'
      }
    }
    return open || !close ? (
      <Portal into={into}>
        <div
          className="_modal_mask_"
          onClick={hack(onMaskClick)}
          onTouchMove={noMove}
          style={maskStyle}
        >
          <div style={modalContentStyle}>{children}</div>
        </div>
      </Portal>
    ) : null
  }
}

export class Modal extends Component {
  show ({
    renderContent = () => null,
    autoClose = true,
    position = 'center',
    mask = 0.2
  }) {
    this.setState({ open: true, renderContent, autoClose, position, mask })
  }
  hide () {
    this.setState({ open: false })
  }
  onMaskClick () {
    if (this.state.autoClose) {
      this.hide()
    }
  }
  constructor (props) {
    super(props)
    this.show = this.show.bind(this)
    this.hide = this.hide.bind(this)
    this.onMaskClick = this.onMaskClick.bind(this)
    this.$modal = {
      show: this.show,
      hide: this.hide
    }
    this.state = {
      open: false,
      autoClose: true,
      position: 'center',
      renderContent: () => null,
      mask: 0.2
    }
  }
  render ({ children }, { open, renderContent, position, mask }) {
    return (
      <div>
        {cloneElement(children[0], { $modal: this.$modal })}
        <ModalStateless
          onMaskClick={this.onMaskClick}
          open={open}
          position={position}
          mask={mask}
        >
          {renderContent()}
        </ModalStateless>
      </div>
    )
  }
}

export const WithModal = BaseComponent => {
  class ComponentWithModal extends Component {
    render () {
      return (
        <Modal>
          <BaseComponent {...this.props} />
        </Modal>
      )
    }
  }
  return ComponentWithModal
}
