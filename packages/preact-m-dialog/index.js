import { h, Component, cloneElement } from 'preact'
import Text from '@ruiyun/preact-text'
import {
  ColumnView,
  SlotRowView,
  XCenterView,
  SlotColumnView
} from '@ruiyun/preact-layout-suite'
import { WithModal } from '@ruiyun/preact-modal'
import Line from '@ruiyun/preact-line'
import { TouchableBlock } from '@ruiyun/preact-m-touchable'

// eslint-disable-next-line
const renderModalContent = (title, content, btns, cb) => () => (
  <ColumnView bgColor="#fff" width={540} style={{ borderRadius: '0.08rem' }}>
    <SlotColumnView hAlign="center" padding={[40, 32, 32, 32]} slot={20}>
      <Text size={32} color="#333">
        {title}
      </Text>
      <Text size={28} color="#666">
        {content}
      </Text>
    </SlotColumnView>
    <Line color="#ebebeb" />
    <SlotRowView height={100} slot={<Line v />}>
      {btns.map((btn, i) => (
        <TouchableBlock
          // eslint-disable-next-line
          onPress={() => cb(i)}
          key={i}
          style={{ flex: 1, height: '100%' }}
        >
          <XCenterView height={100}>
            <Text size={32} color="#fc9153">
              {btn}
            </Text>
          </XCenterView>
        </TouchableBlock>
      ))}
    </SlotRowView>
  </ColumnView>
)

@WithModal
export class Dialog extends Component {
  alert ({ title, content, btn, cb }) {
    const callback = btnIndex => {
      this.props.$modal.hide()
      cb && cb(btnIndex)
    }
    const c = renderModalContent(title, content, [btn], callback)
    this.props.$modal.show({
      content: c,
      autoClose: false
    })
  }
  confirm ({ title, content, btns, cb }) {
    const callback = btnIndex => {
      this.props.$modal.hide()
      cb && cb(btnIndex)
    }
    const c = renderModalContent(title, content, btns, callback)
    this.props.$modal.show({
      content: c,
      autoClose: false
    })
  }
  constructor (props) {
    super(props)
    this.alert = this.alert.bind(this)
    this.confirm = this.confirm.bind(this)
  }

  render ({ children }) {
    return cloneElement(children[0], {
      $alert: this.alert,
      $confirm: this.confirm
    })
  }
}

export const WithDialog = BaseComponent => {
  class ComponentWithDialog extends Component {
    render () {
      return (
        <Dialog>
          <BaseComponent {...this.props} />
        </Dialog>
      )
    }
  }
  return ComponentWithDialog
}
