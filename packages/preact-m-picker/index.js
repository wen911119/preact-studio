import { h, Component, cloneElement } from 'preact'
import { WithModal } from '@ruiyun/preact-modal'
import { XCenterView, RowView, SlotRowView } from '@ruiyun/preact-layout-suite'
import Text from '@ruiyun/preact-text'
import Line from '@ruiyun/preact-line'
import { ScrollerWithPreventBounce } from '@ruiyun/preact-m-scroller'
import p2r from 'p-to-r'
import style from './index.css'

// 这个组件只接受扁平options,和options的index的值为value
// 这个组件是无状态的
// 复杂的options和状态交给调用者或者父级组件处理

class PickerContent extends Component {
  onCancel = () => {
    this.props.cb && this.props.cb()
  }

  onConfirm = () => {
    this.props.cb && this.props.cb(Array.from(this.state.selectedIndexs))
  }

  onSelect = index => {
    const mode = this.props.mode || 1
    if (mode > 1) {
      // 多选模式
      const selectedIndexs = Array.from(this.state.selectedIndexs)
      if (selectedIndexs.length < mode) {
        selectedIndexs.push(index)
        this.setState({
          selectedIndexs
        })
      }
    } else if (mode === 1) {
      // 单选模式
      this.setState({
        selectedIndexs: [index]
      })
    }
  }

  onRemove = index => {
    const selectedIndexs = Array.from(this.state.selectedIndexs).filter(
      item => item !== index
    )
    this.setState({
      selectedIndexs
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      selectedIndexs: props.values || []
    }
  }

  componentDidMount() {
    let target
    if (this.state.selectedIndexs.length) {
      target = document.getElementsByClassName('_item_selected_')[0]
    } else {
      target = document.getElementsByClassName(style.shadow)[0]
    }
    try {
      // 不管有没有选中的值都要scrollIntoView,这样可以解决ios键盘把页面顶上去后不会自动收下来的奇怪bug
      target.scrollIntoView()
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    const {
      title = '',
      options = [],
      mode = 1,
      config: {
        titleSize,
        titleColor,
        cancelSize,
        cancelColor,
        confirmSize,
        confirmColor,
        itemSize,
        itemColor,
        itemHeight,
        selectedColor
      }
    } = this.props
    const { selectedIndexs } = this.state
    return (
      <div style={{ backgroundColor: '#fff', width: '100vw' }}>
        <RowView
          hAlign='between'
          height={80}
          padding={[0, 30, 0, 30]}
          style={{
            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0.06rem 0.06rem 0px'
          }}
        >
          <Text size={cancelSize} color={cancelColor} onClick={this.onCancel}>
            取消
          </Text>
          <Text size={titleSize} color={titleColor}>
            {title}
            {mode > 1 && mode !== 999 && (
              <Text color='#ccc' size={24}>
                {`(${selectedIndexs.length}/${mode})`}
              </Text>
            )}
          </Text>
          <Text
            size={confirmSize}
            color={confirmColor}
            onClick={this.onConfirm}
          >
            确定
          </Text>
        </RowView>
        <ScrollerWithPreventBounce height={p2r(440)}>
          {options.map((item, i) => (
            <div
              key={item}
              className={
                selectedIndexs.indexOf(i) > -1
                  ? `${style.shadow} _item_selected_`
                  : style.shadow
              }
              // eslint-disable-next-line
              onClick={
                selectedIndexs.indexOf(i) > -1
                  ? this.onRemove.bind(this, i)
                  : this.onSelect.bind(this, i)
              }
            >
              <XCenterView height={itemHeight}>
                <SlotRowView slot={30}>
                  {selectedIndexs.indexOf(i) > -1 && (
                    <Text color='transparent' style={{ opacity: 0 }}>
                      &#10003;
                    </Text>
                  )}
                  <Text
                    color={
                      selectedIndexs.indexOf(i) > -1 ? selectedColor : itemColor
                    }
                    size={itemSize}
                  >
                    {item}
                  </Text>
                  {selectedIndexs.indexOf(i) > -1 && (
                    <Text color={selectedColor}>&#10003;</Text>
                  )}
                </SlotRowView>
              </XCenterView>
              <Line />
            </div>
          ))}
        </ScrollerWithPreventBounce>
      </div>
    )
  }
}

// eslint-disable-next-line
const renderModalContent = props => () => <PickerContent {...props} />

@WithModal
export class Picker extends Component {
  picker({ title, options, config, mode, values }) {
    const styleConfig = Object.assign(
      {
        titleSize: 30,
        titleColor: '#333',
        cancelSize: 28,
        cancelColor: '#919191',
        confirmSize: 28,
        confirmColor: '#0078FE',
        itemSize: 28,
        itemColor: '#919191',
        itemHeight: 80,
        selectedColor: '#39b54a'
      },
      config
    )
    return new Promise(resolve => {
      const cb = indexs => {
        this.props.$modal.hide()
        if (indexs) {
          resolve(indexs)
        }
      }
      const c = renderModalContent({
        title,
        options,
        cb,
        config: styleConfig,
        mode,
        values
      })
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
    return cloneElement(children, {
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
