import { h, Component } from 'preact'
import Input from '@ruiyun/preact-input'
import FormRow from './formRow'
import classNames from './nativeDateTime.css'

export default class FormNativeDateTimeInput extends Component {
  onChange = event => {
    this.props.sync(event.target.value)
  }

  render() {
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
      bgColor,
      renderRight,
      placeholder,
      value,
      inputType = 'datetime-local',
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
        inputType={inputType}
        arrow
      >
        <Input
          {...otherProps}
          className={classNames.datetimeInput}
          onChange={this.onChange}
          height='0.6rem'
          width='100%'
          type={inputType}
          placeholder={value ? '' : placeholder}
          value={value}
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
