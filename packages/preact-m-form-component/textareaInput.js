import { h, Component } from 'preact'
import { RowView } from '@ruiyun/preact-layout-suite'
import { FormRow } from '@ruiyun/preact-m-form-component'
import Text from '@ruiyun/preact-text'
import p2r from 'p-to-r'
import TextareaInput from '@ruiyun/preact-textarea'

export default class FormTextareaInput extends Component {
  state = {
    text: ''
  }

  onChange = event => {
    this.setState({
      text: event.target.value
    })
    this.props.sync(event.target.value)
  }

  render() {
    const {
      label,
      err,
      style,
      required,
      padding,
      labelSize,
      labelColor,
      errorSize,
      errorColor,
      direction,
      slot,
      max,
      ...otherProps
    } = this.props
    const { text } = this.state
    return (
      <FormRow
        label={label}
        err={err}
        direction={direction}
        required={required}
        padding={padding}
        labelSize={labelSize}
        labelColor={labelColor}
        errorSize={errorSize}
        errorColor={errorColor}
        slot={slot}
      >
        <RowView style={{ position: 'relative' }}>
          <TextareaInput
            {...otherProps}
            onChange={this.onChange}
            style={Object.assign(
              {
                textAlign: 'left',
                lineHeight: '0.6rem',
                resize: 'none'
              },
              style
            )}
            {...(max && { maxLength: max })}
          />
          {max && (
            <Text
              size={20}
              color='#eaeaea'
              style={{ position: 'absolute', right: p2r(10), bottom: 0 }}
            >
              {text.length}/{max}
            </Text>
          )}
        </RowView>
      </FormRow>
    )
  }
}
