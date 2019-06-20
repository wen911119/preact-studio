import { h, Component } from 'preact'

// 只能输入数字
// 只能输入整数
// 数字小数点后只能{2}位
// 数字千分位显示
//

// issue  一次有效输入会产生两次render，这个目前权衡下来没有好的解法

export default class NumberInput extends Component {
  onInput = event => {
    let parsedValue = event.target.value
    // 默认digits = 2,保留两位小数
    const { float, limit, digits = 2, onChange } = this.props
    if (float) {
      // 这种实现有bug，比如用户输入的数字刚好包含下面的数字时，就会出错，但是概率太低了。考虑到实现成本和鲁棒性，所以选择就种。
      const holder = '95279528952695249523952956787998'
      const regExp = new RegExp(`(\\.\\d{${digits}}).+`)
      parsedValue = parsedValue.replace(/(\d)\./, '$1' + holder)
      parsedValue = parsedValue.replace(/\..+/gi, '')
      parsedValue = parsedValue.replace(/[^0-9]/gi, '')
      parsedValue = parsedValue.replace(holder, '.')
      parsedValue = parsedValue.replace(regExp, '$1')
    }
    else {
      parsedValue = parsedValue.replace(/[^0-9]/gi, '')
    }

    if (limit) {
      // 限制长度
      const reg = new RegExp(`(^\\d{1,${limit}})\\d*`)
      parsedValue = parsedValue.replace(reg, '$1')
    }

    this.setState({ value: parsedValue }, () => {
      onChange && onChange(parsedValue)
    })
  }
  format = rawValue => {
    const { format } = this.props
    if (format && rawValue) {
      if (typeof format === 'string') {
        // 数字千分位
        if (format === 'thousand') {
          if (rawValue.indexOf('.') > -1) {
            let temp = rawValue.split('.')
            temp[0] = Number(temp[0]).toLocaleString('en-US')
            return temp.join('.')
          }
          return Number(rawValue).toLocaleString('en-US')
        }
      }
      else if (typeof format === 'object') {
        const { delimiter, block } = format
        // 自定义分隔字符，分隔距离
        if (delimiter && block) {
          const reg = new RegExp(`(\\d{${block}})`, 'g')
          if (rawValue.indexOf('.') > -1) {
            // 有小数点，要特殊处理，目前还没想到一个正则搞定
            let temp = rawValue.split('.')
            temp[0] = temp[0].replace(reg, '$1' + delimiter)
            return temp.join('.')
          }
          return rawValue.replace(reg, '$1' + delimiter)
        }
      }
      else if (typeof format === 'function') {
        // 自定义格式化函数
        return format(rawValue)
      }
    }
    return rawValue
  }
  onComplete = () => {
    const { value } = this.state
    if (value && /\d+\.$/.test(value)) {
      // 需要纠错
      // 比如用户用户输入"1234."
      this.setState(
        {
          value: value.replace('.', '')
        },
        () => {
          this.props.onChange && this.props.onChange(this.state.value)
        }
      )
    }
  }
  constructor (props) {
    super(props)
    this.state = {
      value: props.value
    }
  }
  componentWillReceiveProps (nextProps) {
    if (
      nextProps.value !== this.props.value &&
      nextProps.value !== this.state.value
    ) {
      this.setState({ value: nextProps.value })
    }
  }
  render () {
    // eslint-disable-next-line
    const { onChange, value, type, float = false, ...otherProps } = this.props
    return (
      <input
        onBlur={this.onComplete}
        {...otherProps}
        onChange={this.onInput}
        value={this.format(this.state.value)}
        type={float ? 'text' : 'tel'} // 为什么用text不用number？因为在ios上number有解决不了的bug啊！
      />
    )
  }
}
