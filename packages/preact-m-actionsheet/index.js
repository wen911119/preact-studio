import { h, Component, cloneElement } from 'preact'
import { WithModal } from '@ruiyun/preact-modal'
import {
  XCenterView,
  RowView,
  SlotColumnView
} from '@ruiyun/preact-layout-suite'
import Text from '@ruiyun/preact-text'
import { TouchableBlock } from '@ruiyun/preact-m-touchable'
import Line from '@ruiyun/preact-line'

// eslint-disable-next-line
const renderModalContent = (title, options, cb) => () => (
  <div style={{ backgroundColor: '#fff', width: '100vw' }}>
    <XCenterView height={80}>
      <Text color="#000" size={30}>
        {title}
      </Text>
    </XCenterView>
    <Line />
    <SlotColumnView slot={<Line />}>
      {options.map((item, i) => (
        // eslint-disable-next-line
        <TouchableBlock key={i} onPress={() => cb(i)}>
          <XCenterView height={80}>
            <Text color="#919191" size={26}>
              {item}
            </Text>
          </XCenterView>
        </TouchableBlock>
      ))}
    </SlotColumnView>
    <RowView height={10} bgColor="#ccc" />
    <TouchableBlock onPress={cb}>
      <XCenterView height={80}>
        <Text color="#fc9153">取消</Text>
      </XCenterView>
    </TouchableBlock>
  </div>
)

@WithModal
export class ActionSheet extends Component {
  actionsheet (title, options) {
    return new Promise((resolve, reject) => {
      const cb = index => {
        this.props.$modal.hide()
        typeof index === 'number' && resolve(index)
      }
      const c = renderModalContent(title, options, cb)
      this.props.$modal.show({
        content: c,
        position: 'bottom'
      })
    })
  }
  constructor (props) {
    super(props)
    this.actionsheet = this.actionsheet.bind(this)
  }
  render ({ children }) {
    return cloneElement(children[0], {
      $actionsheet: this.actionsheet
    })
  }
}

export const WithActionSheet = BaseComponent => {
  class ComponentWithActionSheet extends Component {
    render () {
      return (
        <ActionSheet>
          <BaseComponent {...this.props} />
        </ActionSheet>
      )
    }
  }
  return ComponentWithActionSheet
}
