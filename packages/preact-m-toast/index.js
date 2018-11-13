import { h, Component, cloneElement } from 'preact'
import { WithModal } from '@ruiyun/preact-modal'
import Text from '@ruiyun/preact-text'
import { RowView } from '@ruiyun/preact-layout-suite'

// eslint-disable-next-line
const renderModalContent = (txt, loading) => () => (
  <RowView
    padding={[15, 20, 15, 20]}
    style={{
      backgroundColor: `rgba(0,0,0,0.6`,
      borderRadius: '3px'
    }}
  >
    <Text size={24} color="#fff">
      {txt}
    </Text>
  </RowView>
)

@WithModal
export class Toast extends Component {
  toast (txt, duration = 1500) {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer)
    }
    const c = renderModalContent(txt)
    this.props.$modal.show({
      renderContent: c,
      autoClose: false,
      mask: 0
    })
    this.toastTimer = setTimeout(() => {
      this.props.$modal.hide()
      this.toastTimer = null
    }, duration)
  }
  constructor (props) {
    super(props)
    this.toast = this.toast.bind(this)
    this.toastTimer = null
  }
  render ({ children }) {
    return cloneElement(children[0], {
      $toast: this.toast
    })
  }
}

export const WithToast = BaseComponent => {
  class ComponentWithToast extends Component {
    render () {
      return (
        <Toast>
          <BaseComponent {...this.props} />
        </Toast>
      )
    }
  }
  return ComponentWithToast
}
