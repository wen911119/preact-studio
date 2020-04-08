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
import Input from '@ruiyun/preact-input'
import Textarea from '@ruiyun/preact-textarea'
import className from './index.css'

const defaultConfig = {
  titleColor: '#333',
  titleSize: 32,
  contentColor: '#666',
  contentSize: 28,
  btnsColor: ['#fc9153', '#fc9153'],
  btnSize: 32,
  width: 490,
  textareaWith: '100%',
  textareaHeight: 160
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
  slot,
  type
}) => () => (
  <ColumnView
    bgColor='#fff'
    width={config.width}
    style={{ borderRadius: '0.08rem' }}
  >
    <SlotColumnView
      hAlign='center'
      vAlign='center'
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
      {slot && slot()}
      {placeholder && type === 'input' ? (
        <Input
          textSize={26}
          placeholder={placeholder}
          className={className.promptInput}
          id={inputId}
          value={value}
        />
      ) : (
        <Textarea
          width={config.textareaWith}
          height={config.textareaHeight}
          textSize={26}
          placeholder={placeholder}
          id={inputId}
          value={value}
          className={className.promptTextarea}
        />
      )}
    </SlotColumnView>
    <Line color='#ebebeb' />
    <SlotRowView height={100} slot={<Line v />}>
      {btns.map((btn, i) => (
        <XCenterView
          key={btn}
          // eslint-disable-next-line
          onClick={() => cb(i)}
          height={100}
          className={className.shadow}
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
  alert({ title, content, btn, cb, config, slot }) {
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

  confirm({ title, content, btns, cb, config, slot }) {
    const callback = btnIndex => {
      this.props.$modal.hide()
      cb && cb(btnIndex)
    }
    const mergedConfig = Object.assign({}, defaultConfig, config)
    const c = renderModalContent({
      title,
      content,
      btns,
      cb: callback,
      config: mergedConfig,
      slot
    })
    this.props.$modal.show({
      content: c,
      autoClose: false
    })
  }

  prompt({
    title,
    content,
    btns,
    cb,
    placeholder = '请输入',
    value,
    config,
    slot,
    type = 'input'
  }) {
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
      slot,
      type
    })
    this.props.$modal.show({
      content: c,
      autoClose: false
    })
  }

  constructor(props) {
    super(props)
    this.alert = this.alert.bind(this)
    this.confirm = this.confirm.bind(this)
    this.prompt = this.prompt.bind(this)
  }

  render({ children }) {
    return cloneElement(children, {
      $alert: this.alert,
      $confirm: this.confirm,
      $prompt: this.prompt
    })
  }
}

export const WithDialog = BaseComponent => {
  class ComponentWithDialog extends Component {
    render() {
      return (
        <Dialog>
          <BaseComponent {...this.props} />
        </Dialog>
      )
    }
  }
  return ComponentWithDialog
}
