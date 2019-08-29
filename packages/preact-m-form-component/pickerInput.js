import { h, Component } from 'preact'
import { WithPicker } from '@ruiyun/preact-m-picker'
import Text from '@ruiyun/preact-text'
import FormRow from './formRow'

@WithPicker
export default class FormPickerSheet extends Component {
  onClick = () => {
    const { title = '请选择', config, sync, mode, value = [] } = this.props
    const { options } = this.state
    const selectedIndexs = value.map(v =>
      options.findIndex(
        option => this.labelExtractor(v) === this.labelExtractor(option)
      )
    )
    this.props
      .$picker({
        title,
        options: options.map(this.labelExtractor),
        config,
        mode,
        values: selectedIndexs
      })
      .then(indexs => {
        sync(indexs.map(index => options[index]))
      })
  }
  constructor (props) {
    super(props)
    this.labelExtractor = props.labelExtractor || (v => v)
    this.state = {
      options: props.options || []
    }
  }
  componentDidMount () {
    if (this.props.getOptions) {
      this.props.getOptions().then(options => this.setState({ options }))
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
