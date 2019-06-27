import { h, Component } from 'preact'
import { WithActionSheet } from '@ruiyun/preact-m-actionsheet'
import Text from '@ruiyun/preact-text'
import FormRow from './formRow'

@WithActionSheet
export default class FormActionSheet extends Component {
  onClick = () => {
    const { title = '请选择', options = [], config, sync } = this.props
    this.props.$actionsheet(title, options, config).then(index => {
      sync(options[index])
    })
  }
  render () {
    console.log('render-form-actionsheet')
    const {
      label,
      err,
      placeholder,
      textColor = '#666',
      textSize = 30,
      value,
      required,
      padding,
      labelSize,
      labelColor,
      errorSize,
      errorColor,
      direction,
      slot,
      ...otherProps
    } = this.props
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
        arrow
      >
        <Text
          {...otherProps}
          color={value ? textColor : '#ccc'}
          size={textSize}
          onClick={this.onClick}
        >
          {value || placeholder || '请选择'}
        </Text>
      </FormRow>
    )
  }
}
