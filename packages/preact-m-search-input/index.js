import { h, Component } from 'preact'
import Input from '@ruiyun/preact-input'

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
    const { keyword } = this.state
    return (
      <form
        action={`javascript:${this.inputId}.blur()`}
        className={className.searchform}
      >
        <Input
          id={this.inputId}
          width="100%"
          type="search"
          {...this.props}
          value={keyword}
          onChange={this.onChange}
          onInput={this.onInput}
          style={{ backgroundColor: 'transparent' }}
        />
      </form>
    )
  }
}
