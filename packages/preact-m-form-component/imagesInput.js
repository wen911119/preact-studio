import { h, Component } from 'preact'
import Text from '@ruiyun/preact-text'
import ImageUploader from '@ruiyun/preact-image-uploader'

import FormRow from './formRow'

export default class FormImagesInput extends Component {
  onChange = images => {
    this.props.sync(images)
  }

  renderRight = () => {
    const { max = 999, mode = 'edit', value = [] } = this.props
    if (mode === 'edit' && max !== 999) {
      return (
        <Text size={26} color='#919191'>
          {`(${value.length}/${max})`}
        </Text>
      )
    }
  }

  render() {
    const {
      label,
      err,
      value = [],
      required,
      padding,
      labelSize,
      labelColor,
      errorSize,
      errorColor,
      slot,
      max = 999,
      mode = 'edit',
      bgColor,
      ...otherProps
    } = this.props
    return (
      <FormRow
        label={label}
        err={err}
        direction='v'
        required={required}
        padding={padding}
        labelSize={labelSize}
        labelColor={labelColor}
        errorSize={errorSize}
        errorColor={errorColor}
        slot={slot}
        bgColor={bgColor}
        renderRight={this.renderRight}
      >
        <ImageUploader
          mode={mode}
          max={max}
          {...otherProps}
          onChange={this.onChange}
          urls={value}
        />
      </FormRow>
    )
  }
}
