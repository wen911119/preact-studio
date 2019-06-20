import { h, Component } from 'preact'
import { WithActionSheet } from '@ruiyun/preact-m-actionsheet'
import Text from '@ruiyun/preact-text'

@WithActionSheet
export default class FormActionSheet extends Component {
  onClick = () => {
    const options = this.props.options || []
    this.props
      .$actionsheet('选择职位', options, { cancelColor: '#f8584f' })
      .then(index => {
        this.props.sync(options[index])
      })
  }
  render () {
    console.log('render-form-actionsheet')
    const { label, error, placeholder, value, ...otherProps } = this.props
    return (
      <Text
        {...otherProps}
        color={value ? '#181818' : '#ccc'}
        onClick={this.onClick}
      >
        {value || placeholder || '请选择'}
      </Text>
    )
  }
}
