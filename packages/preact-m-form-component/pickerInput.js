import { h, Component } from 'preact'
import { WithPicker } from '@ruiyun/preact-m-picker'
import Text from '@ruiyun/preact-text'
import FormRow from './formRow'

@WithPicker
export default class FormPickerSheet extends Component {
  onClick = () => {
    const { title = '请选择', config, sync, mode } = this.props
    const { options, selectedIndexs } = this.state

    this.props
      .$picker({
        title,
        options: options.map(this.labelExtractor),
        config,
        mode,
        values: selectedIndexs
      })
      .then(indexs => {
        this.setState(
          {
            selectedIndexs: indexs
          },
          () => {
            sync(indexs.map(index => options[index]))
          }
        )
      })
  }
  updateOptions = options => {
    let selectedIndexs = this.state.selectedIndexs
    if (
      this.props.value &&
      this.props.value.length &&
      options &&
      options.length
    ) {
      // 需要将value转化为selectedIndexs
      selectedIndexs = this.props.value.map(v =>
        options.findIndex(
          option => this.labelExtractor(v) === this.labelExtractor(option)
        )
      )
    }
    this.setState({
      options,
      selectedIndexs
    })
  }
  constructor (props) {
    super(props)
    this.labelExtractor = props.labelExtractor || (v => v)
    let selectedIndexs = []
    if (
      props.value &&
      props.value.length &&
      props.options &&
      props.options.length
    ) {
      // 有初始值并且有初始options
      // 需要将value转化为selectedIndexs
      selectedIndexs = props.value.map(v =>
        props.options.findIndex(
          option => this.labelExtractor(v) === this.labelExtractor(option)
        )
      )
    }
    this.state = {
      options: props.options || [],
      selectedIndexs
    }
  }
  componentDidMount () {
    if (this.props.getOptions) {
      this.props.getOptions().then(this.updateOptions)
    }
  }
  render () {
    const {
      label,
      err,
      placeholder,
      textColor = '#666',
      textSize = 30,
      value, // 是数组
      split = ',',
      required,
      padding,
      labelSize,
      labelColor,
      errorSize,
      errorColor,
      direction,
      slot,
      arrowSize,
      arrowColor,
      ...otherProps
    } = this.props
    let valueShow
    if (value && value.length) {
      valueShow = value.map(this.labelExtractor).join(split)
    }
    return (
      <FormRow
        label={label}
        err={err}
        direction={direction}
        required={required}
        padding={padding}
        labelSize={labelSize}
        labelColor={labelColor}
        errorSize={errorSize}
        errorColor={errorColor}
        slot={slot}
        arrowSize={arrowSize}
        arrowColor={arrowColor}
        arrow
      >
        <Text
          {...otherProps}
          color={valueShow ? textColor : '#ccc'}
          size={textSize}
          onClick={this.onClick}
        >
          {valueShow || placeholder || '请选择'}
        </Text>
      </FormRow>
    )
  }
}
