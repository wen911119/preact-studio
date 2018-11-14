import { h, Component, cloneElement } from 'preact'
import { WithModal } from '@ruiyun/preact-modal'
import Scroller from '@ruiyun/preact-m-scroller'
import { XCenterView } from '@ruiyun/preact-layout-suite'
import Text from '@ruiyun/preact-text'
import { TouchableInline } from '@ruiyun/preact-m-touchable'

const renderModalContent = (options, cb) => () => (
  <div style={{ backgroundColor: '#fff', width: '100vw' }}>
    <Scroller height="40vh">
      {options.map((item, i) => (
        <XCenterView key={i}>
          <TouchableInline onPress={() => cb(i)}>
            <Text>{item}</Text>
          </TouchableInline>
        </XCenterView>
      ))}
    </Scroller>
  </div>
)

@WithModal
export class Picker extends Component {
  constructor(props) {
    super(props)
    this.picker = this.picker.bind(this)
  }
  picker(options) {
    return new Promise((resolve, reject) => {
      const cb = index => {
        this.props.$modal.hide()
        resolve(index)
      }
      const c = renderModalContent(options, cb)
      this.props.$modal.show({
        renderContent: c,
        position: 'bottom',
        allowContentTouchMove: true
      })
    })
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
