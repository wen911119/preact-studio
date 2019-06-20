import { h, Component } from 'preact'
import NumberInput from '@ruiyun/preact-number-input'

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
    const { value, label, error, ...otherProps } = this.props
    return <NumberInput {...otherProps} value={value} onChange={this.onChange} />
  }
}
