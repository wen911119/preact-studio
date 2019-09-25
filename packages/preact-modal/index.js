import { h, Component, cloneElement, Fragment } from 'preact'
import { createPortal } from 'preact/compat'
import className from './index.css'

export default class ModalStateless extends Component {
  noMove = e => e.cancelable && e.preventDefault()
  onContentTouchMove = e => this.props.allowContentTouchMove || this.noMove(e)
  constructor (props) {
    super(props)
    this.state = {
      show: props.open
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.open !== nextProps.open) {
      if (nextProps.open) {
        this.setState({
          show: true
        })
      }
      else {
        setTimeout(() => this.setState({ show: false }), 300)
      }
    }
  }
  render = ({ open, children, position, mask, onMaskClick }, { show }) => {
    let maskClassNames = [className.mask]
    let contentClassNames = [
      className.content,
      className[`content-${position}`]
    ]
    if (open) {
      maskClassNames.push(className['animate-fade-in'])
      contentClassNames.push(className[`animate-${position}-show`])
    }
    else {
      maskClassNames.push(className['animate-fade-out'])
      contentClassNames.push(className[`animate-${position}-hide`])
    }
    return show
      ? createPortal(
        <Fragment>
          <div
            className={maskClassNames.join(' ')}
            onClick={onMaskClick}
            onTouchMove={this.noMove}
            style={{ backgroundColor: `rgba(0,0,0,${mask})` }}
          />
          <div
            onTouchMove={this.onContentTouchMove}
            className={contentClassNames.join(' ')}
          >
            {children}
          </div>
        </Fragment>,
        document.body
      )
      : null
  }
}

export class Modal extends Component {
  show = ({
    content = () => null,
    autoClose = true,
    position = 'center',
    mask = 0.2,
    allowContentTouchMove = false,
    onMaskClick
  }) => {
    this.setState({
      open: true,
      content,
      autoClose,
      position,
      mask,
      allowContentTouchMove,
      onMaskClick
    })
  }
  hide = () => {
    this.setState({ open: false })
  }
  onMaskClick = e => {
    if (this.state.autoClose) {
      this.hide()
    }
    this.state.onMaskClick && this.state.onMaskClick(e)
  }

  constructor (props) {
    super(props)
    this.$modal = {
      show: this.show,
      hide: this.hide
    }
    this.state = {
      open: false,
      autoClose: true,
      position: 'center',
      content: () => null,
      mask: 0.2,
      allowContentTouchMove: false,
      onMaskClick: null
    }
  }

  render (
    { children },
    { open, content: Content, position, mask, allowContentTouchMove }
  ) {
    return (
      <Fragment>
        {cloneElement(children, { $modal: this.$modal })}
        <ModalStateless
          onMaskClick={this.onMaskClick}
          open={open}
          position={position}
          mask={mask}
          allowContentTouchMove={allowContentTouchMove}
        >
          <Content />
        </ModalStateless>
      </Fragment>
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
