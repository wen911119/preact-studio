import { h, Component } from 'preact'
import NumberInput from '@ruiyun/preact-number-input'

import FormRow from './formRow'

// 只能输入数字
// 只能输入整数
// 数字小数点后只能{2}位
// 数字千分位显示

export default class FormNumberInput extends Component {
  onChange = value => {
    this.props.sync(value)
  }

  render() {
    const {
      label,
      err,
      style,
      required,
      padding,
      direction,
      labelSize,
      labelColor,
      errorSize,
      errorColor,
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
        renderRight={renderRight}
        bgColor={bgColor}
      >
        <NumberInput
          {...otherProps}
          height='0.6rem'
          width='100%'
          onChange={this.onChange}
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
