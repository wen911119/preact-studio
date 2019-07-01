import { h, Component } from 'preact'
import Switch from '@ruiyun/preact-switch'
import FormRow from './formRow'

export default class FormSwitchInput extends Component {
  onChange = value => {
    this.props.sync(value)
  }
  render () {
    console.log('render-form-switch-input')
    const {
      label,
      err,
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
      >
        <Switch
          {...otherProps}
          onChange={this.onChange}
        />
      </FormRow>
    )
  }
}
