import { h, Component, cloneElement } from 'preact'
import { WithModal } from '@ruiyun/preact-modal'
import {
  XCenterView,
  RowView,
  SlotColumnView
} from '@ruiyun/preact-layout-suite'
import Text from '@ruiyun/preact-text'
import Line from '@ruiyun/preact-line'
import style from './index.css'

// eslint-disable-next-line
const renderModalContent = (title, options, config, cb) => () => (
  <div style={{ backgroundColor: '#fff', width: '100vw' }}>
    <XCenterView height={80}>
      <Text color={config.titleColor} size={config.titleSize}>
        {title}
      </Text>
    </XCenterView>
    <Line />
    <SlotColumnView slot={<Line />}>
      {options.map((item, i) => (
        <XCenterView
          className={style.shadow}
          height={80}
          key={i}
          // eslint-disable-next-line
          onClick={() => cb(i)}
        >
          <Text color={config.itemColor} size={config.itemSize}>
            {item}
          </Text>
        </XCenterView>
      ))}
    </SlotColumnView>
    <RowView height={10} bgColor="#ccc" />
    <XCenterView className={style.shadow} onClick={cb} height={80}>
      <Text color={config.cancelColor} size={config.cancelSize}>
        取消
      </Text>
    </XCenterView>
  </div>
)

@WithModal
export class ActionSheet extends Component {
  actionsheet (title, options, config = {}) {
    const styleConfig = Object.assign(
      {
        titleColor: '#000',
        titleSize: 30,
        itemColor: '#919191',
        itemSize: 26,
        cancelColor: '#fc9153',
        cancelSize: 30
      },
      config
    )
    return new Promise((resolve, reject) => {
      const cb = index => {
        this.props.$modal.hide()
        typeof index === 'number' && resolve(index)
      }
      const c = renderModalContent(title, options, styleConfig, cb)
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
