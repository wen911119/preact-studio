import { h, Component } from 'preact'
import Input from '@ruiyun/preact-input'
import FormRow from './formRow'

export default class FormTextInput extends Component {
  onChange = event => {
    this.props.sync(event.target.value)
  }
  render () {
    const {
      label,
      err,
      style,
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
        <Input
          {...otherProps}
          onChange={this.onChange}
          height="0.6rem"
          width="100%"
          style={Object.assign(
            {
              textAlign: direction === 'v' ? 'left' : 'right',
              lineHeight: '0.6rem'
            },
            style
          )}
        />
      </FormRow>
    )
  }
}
