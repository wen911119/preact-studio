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
import style from './index.css'

const defaultConfig = {
  titleColor: '#333',
  titleSize: 32,
  contentColor: '#666',
  contentSize: 28,
  btnsColor: ['#fc9153', '#fc9153'],
  btnSize: 32
}

/* eslint-disable react/display-name */
const renderModalContent = ({
  title,
  content,
  btns,
  cb,
  placeholder,
  inputId,
  value,
  config,
  slot
}) => () => (
  <ColumnView bgColor="#fff" width={490} style={{ borderRadius: '0.08rem' }}>
    <SlotColumnView
      hAlign="center"
      vAlign="center"
      padding={[40, 32, 32, 32]}
      slot={20}
    >
      {title && (
        <Text size={config.titleSize} color={config.titleColor}>
          {title}
        </Text>
      )}
      {content && (
        <Text size={config.contentSize} color={config.contentColor}>
          {content}
        </Text>
      )}
      { slot && slot()}
      {placeholder && (
        <input
          placeholder={placeholder}
          className={style.promptInput}
          id={inputId}
          value={value}
        />
      )}
    </SlotColumnView>
    <Line color="#ebebeb" />
    <SlotRowView height={100} slot={<Line v />}>
      {btns.map((btn, i) => (
        <XCenterView
          key={btn}
          // eslint-disable-next-line
          onClick={() => cb(i)}
          height={100}
          className={style.shadow}
          style={{ flex: 1 }}
        >
          <Text size={config.btnSize} color={config.btnsColor[i] || '#fc9153'}>
            {btn}
          </Text>
        </XCenterView>
      ))}
    </SlotRowView>
  </ColumnView>
)
/* eslint-enable */

@WithModal
export class Dialog extends Component {
  alert ({ title, content, btn, cb, config, slot }) {
    const callback = btnIndex => {
      this.props.$modal.hide()
      cb && cb(btnIndex)
    }
    const mergedConfig = Object.assign({}, defaultConfig, config)
    const c = renderModalContent({
      title,
      content,
      btns: [btn],
      cb: callback,
      config: mergedConfig,
      slot
    })
    this.props.$modal.show({
      content: c,
      autoClose: false
    })
  }
  confirm ({ title, content, btns, cb, config, slot }) {
    const callback = btnIndex => {
      this.props.$modal.hide()
      cb && cb(btnIndex)
    }
    const mergedConfig = Object.assign({}, defaultConfig, config)
    const c = renderModalContent({ title, content, btns, cb: callback, config: mergedConfig, slot })
    this.props.$modal.show({
      content: c,
      autoClose: false
    })
  }
  prompt ({ title, content, btns, cb, placeholder = '请输入', value, config, slot }) {
    const inputId = `input_${Math.random()}`
    const callback = btnIndex => {
      this.props.$modal.hide()
      cb && cb(btnIndex, document.getElementById(inputId).value)
    }
    const mergedConfig = Object.assign({}, defaultConfig, config)
    const c = renderModalContent({
      title,
      content,
      btns,
      cb: callback,
      placeholder,
      inputId,
      value,
      config: mergedConfig,
      slot
    })
    this.props.$modal.show({
      content: c,
      autoClose: false
    })
  }
  constructor (props) {
    super(props)
    this.alert = this.alert.bind(this)
    this.confirm = this.confirm.bind(this)
    this.prompt = this.prompt.bind(this)
  }

  render ({ children }) {
    return cloneElement(children[0], {
      $alert: this.alert,
      $confirm: this.confirm,
      $prompt: this.prompt
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
