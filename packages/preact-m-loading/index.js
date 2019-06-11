import { h, Component, cloneElement } from 'preact'
import { WithModal } from '@ruiyun/preact-modal'
import Text from '@ruiyun/preact-text'
import LoadingIcon from '@ruiyun/preact-loading'
import { SlotRowView } from '@ruiyun/preact-layout-suite'

// eslint-disable-next-line
const renderModalContent = txt => () => {
  const slot = txt ? 15 : 0
  return (
    <SlotRowView
      padding={[15, 20, 15, 20]}
      slot={slot}
      style={{
        backgroundColor: `rgba(0,0,0,0.6`,
        borderRadius: '3px'
      }}
    >
      <LoadingIcon />
      {txt && (
        <Text size={24} color="#fff">
          {txt}
        </Text>
      )}
    </SlotRowView>
  )
}

@WithModal
export class Loading extends Component {
  show (config) {
    const { text = 'loading...', timeout = 6000, mask = 0.15 } = config || {}
    this.loading.count++
    const c = renderModalContent(text)
    this.props.$modal.show({
      content: c,
      autoClose: false,
      mask
    })
    // 在复杂情况下这里有bug
    this.loading.timeoutTimers.push(
      setTimeout(() => {
        this.hide()
      }, timeout)
    )
  }
  hide () {
    this.loading.count--
    clearTimeout(this.loading.timeoutTimers.pop())
    if (this.loading.count <= 0) {
      this.props.$modal.hide()
      this.loading.count = 0
      this.loading.timeoutTimers = []
    }
  }
  constructor (props) {
    super(props)
    this.loading = {
      show: this.show.bind(this),
      hide: this.hide.bind(this),
      count: 0,
      timeoutTimers: []
    }
  }
  render ({ children }) {
    return cloneElement(children, {
      $loading: this.loading
    })
  }
}

export const WithLoading = BaseComponent => {
  class ComponentWithLoading extends Component {
    render () {
      return (
        <Loading>
          <BaseComponent {...this.props} />
        </Loading>
      )
    }
  }
  return ComponentWithLoading
}
