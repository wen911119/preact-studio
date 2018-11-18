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
import Scroller from '@ruiyun/preact-m-scroller'
import p2r from 'p-to-r'

const base_mask = {
  position: 'absolute',
  zIndex: 1,
  width: '100%',
  height: p2r(160)
}

const mask_top = Object.assign(
  {
    borderBottom: '1px solid #eaeaea',
    top: 0
  },
  base_mask
)
const mask_bottom = Object.assign(
  {
    borderTop: '1px solid #eaeaea',
    bottom: 0
  },
  base_mask
)

// eslint-disable-next-line
const renderModalContent = (options, cb) => () => (
  <div style={{ backgroundColor: '#fff', width: '100vw', position: 'relative' }}>
    <div style={mask_top} />
    <div style={mask_bottom} />
    <Scroller height={p2r(400)}>
      {options.map((item, i) => (
        <XCenterView height={80}>
          <Text color="#919191" size={26}>
            {item}
          </Text>
        </XCenterView>
      ))}
    </Scroller>
  </div>
)

@WithModal
export class Picker extends Component {
  picker(options) {
    return new Promise((resolve, reject) => {
      const cb = index => {
        this.props.$modal.hide()
        typeof index === 'number' && resolve(index)
      }
      const c = renderModalContent(options, cb)
      this.props.$modal.show({
        content: c,
        position: 'bottom',
        allowContentTouchMove: true
      })
    })
  }
  constructor(props) {
    super(props)
    this.picker = this.picker.bind(this)
  }
  render({ children }) {
    return cloneElement(children[0], {
      $picker: this.picker
    })
  }
}

export const WithPicker = BaseComponent => {
  class ComponentWithPicker extends Component {
    render() {
      return (
        <Picker>
          <BaseComponent {...this.props} />
        </Picker>
      )
    }
  }
  return ComponentWithPicker
}
