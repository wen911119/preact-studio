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
  render () {
    console.log('render-form-number-input')
    const { label, err, style, required, height, ...otherProps } = this.props
    return (
      <FormRow label={label} err={err} required={required} height={height}>
        <NumberInput
          {...otherProps}
          height="100%"
          width="100%"
          onChange={this.onChange}
          style={Object.assign({ textAlign: 'right' }, style)}
        />
      </FormRow>
    )
  }
}
