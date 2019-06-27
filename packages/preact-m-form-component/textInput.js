import { h, Component } from 'preact'
import Input from '@ruiyun/preact-input'
import FormRow from './formRow'

export default class FormTextInput extends Component {
  onChange = event => {
    this.props.sync(event.target.value)
  }
  render () {
    console.log('render-form-text-input')
    const { label, err, style, required, height, ...otherProps } = this.props
    return (
      <FormRow label={label} err={err} required={required} height={height}>
        <Input
          {...otherProps}
          onChange={this.onChange}
          height="100%"
          width="100%"
          style={Object.assign(
            {
              textAlign: 'right'
            },
            style
          )}
        />
      </FormRow>
    )
  }
}
