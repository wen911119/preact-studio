import { h } from 'preact'
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
  alignItems: 'center'
}

export const Modal = ({
  open,
  into = 'body',
  children,
  onMaskClick,
  style = {}
}) =>
  open ? (
    <Portal into={into}>
      <div
        className="_modal_mask_"
        onClick={hack(onMaskClick)}
        onTouchMove={noMove}
        style={Object.assign(baseStyle, style)}
      >
        {children}
      </div>
    </Portal>
  ) : null

function hack (maskClickHander) {
  return function (e) {
    e.target.className === '_modal_mask_' &&
      maskClickHander &&
      maskClickHander()
  }
}

function noMove (e) {
  e.preventDefault()
}
