import { h, Component } from 'preact'
import Text from '@ruiyun/preact-text'
import ImageUploader from '@ruiyun/preact-image-uploader'

import FormRow from './formRow'

export default class FormImagesInput extends Component {
  onChange = images => {
    this.props.sync(images)
  }
  render () {
    const {
      label,
      err,
      value = [],
      required,
      padding = [30, 30, 0, 30],
      labelSize,
      labelColor,
      errorSize,
      errorColor,
      slot,
      max = 999,
      mode = 'edit',
      ...otherProps
    } = this.props
    return (
      <FormRow
        label={label}
        err={err}
        direction="v"
        required={required}
        padding={padding}
        labelSize={labelSize}
        labelColor={labelColor}
        errorSize={errorSize}
        errorColor={errorColor}
        slot={slot}
        style={{ position: 'relative' }}
      >
        {mode === 'edit' && max !== 999 && (
          <Text
            size={26}
            style={{ position: 'absolute', right: '0.4rem', margin: 0 }}
            color="#919191"
          >{`(${value.length}/${max})`}</Text>
        )}
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
