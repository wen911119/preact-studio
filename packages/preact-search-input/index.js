import { h, Component } from 'preact'
import Input from '@ruiyun/preact-input'
import p2r from 'p-to-r'

import debounce from 'lodash.debounce'
import className from './index.css'

export default class SearchInput extends Component {
  onChange = () => {
    this.props.onSearch && this.props.onSearch(this.state.keyword)
  }
  onInput = event => {
    if (!this.isCompositing) {
      this.onTextInput(event.target.value)
    }
  }
  onTextInput = value => {
    this.setState(
      {
        keyword: value
      },
      () => {
        this.debouncedTextInput(value)
      }
    )
  }
  constructor (props) {
    super(props)
    this.inputId = `input_${Math.random()}`.replace('0.', '')
    this.isCompositing = false
    this.debouncedTextInput = debounce(value => {
      this.props.onTextInput && this.props.onTextInput(value)
    }, props.debounce || 400)
    this.state = {
      keyword: ''
    }
  }
  componentDidMount () {
    const inputElement = document.getElementById(this.inputId)
    inputElement.addEventListener('compositionstart', event => {
      this.isCompositing = true
    })
    inputElement.addEventListener('compositionend', event => {
      this.isCompositing = false
      this.onTextInput(event.target.value)
    })
  }
  render () {
    const {
      height,
      width='100%',
      formStyle,
      style,
      ...otherProps
    } = this.props
    return (
      <form
        action={`javascript:${this.inputId}.blur()`}
        className={className.searchform}
        style={Object.assign({ height: p2r(height) }, formStyle)}
      >
        <Input
          id={this.inputId}
          style={Object.assign({ lineHeight: p2r(height) }, style)}
          height="100%"
          width={width}
          type="search"
          {...otherProps}
          value={this.state.value}
          onChange={this.onChange}
          onInput={this.onInput}
        />
      </form>
    )
  }
}
