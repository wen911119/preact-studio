import { h, Component } from 'preact'

export default class FormInput extends Component {
  onChange = event => {
    this.props.sync(event.target.value)
  }
  render () {
    console.log('render-form-input')
    const { label, error, ...otherProps } = this.props
    return <input {...otherProps} onChange={this.onChange} />
  }
}
