import { h, Component } from 'preact'
import NumberInput from '@ruiyun/preact-number-input'
import Text from '@ruiyun/preact-text'

const salaryRange = {
  产品经理: '8000~30000',
  测试工程师: '6000~20000',
  开发工程师: '10000~50000',
  运营专员: '4500~12000'
}

export default class FormInput extends Component {
  onChange = value => {
    this.props.sync(value)
  }
  render () {
    const { label, error, role, ...otherProps } = this.props
    console.log('render-salary-input', role)

    return (
      <div>
        {role && <Text>{`薪资范围${salaryRange[role]}`}</Text>}
        <NumberInput
          format='thousand'
          {...otherProps}
          onChange={this.onChange}
        />
      </div>
    )
  }
}
