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

  constructor(props) {
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

  onCompositionstart = () => {
    this.isCompositing = true
  }

  onCompositionend = event => {
    this.isCompositing = false
    this.onTextInput(event.target.value)
  }

  componentDidMount() {
    this.inputElement = document.getElementById(this.inputId)
    this.inputElement.addEventListener(
      'compositionstart',
      this.onCompositionstart
    )
    this.inputElement.addEventListener('compositionend', this.onCompositionend)
  }

  componentWillUnmount() {
    this.inputElement.removeEventListener(
      'compositionstart',
      this.onCompositionstart
    )
    this.inputElement.removeEventListener(
      'compositionend',
      this.onCompositionend
    )
  }

  render() {
    const { keyword } = this.state
    // eslint-disable-next-line
    const { onSearch, ...otherProps } = this.props
    return (
      <form
        action={`javascript:${this.inputId}.blur()`}
        className={className.searchform}
      >
        <Input
          id={this.inputId}
          width='100%'
          type='search'
          {...otherProps}
          value={keyword}
          onChange={this.onChange}
          onInput={this.onInput}
          style={{ backgroundColor: 'transparent' }}
        />
      </form>
    )
  }
}
