import { h, Component } from 'preact'
import Switch from '@ruiyun/preact-switch'
import FormRow from './formRow'

export default class FormSwitchInput extends Component {
  onChange = value => {
    this.props.sync(value)
  }

  render() {
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
      bgColor,
      renderRight,
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
        bgColor={bgColor}
        renderRight={renderRight}
      >
        <Switch {...otherProps} onChange={this.onChange} />
      </FormRow>
    )
  }
}
