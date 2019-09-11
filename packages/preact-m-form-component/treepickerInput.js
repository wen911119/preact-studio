import { h, Component } from 'preact'
import { WithTreePicker } from '@ruiyun/preact-m-tree-picker'
import { SlotColumnView } from '@ruiyun/preact-layout-suite'
import Text from '@ruiyun/preact-text'
import FormRow from './formRow'

@WithTreePicker
export default class FormTreePickerInput extends Component {
  onClick = () => {
    const {
      title = '请选择',
      config,
      sync,
      value,
      getLabel,
      getChildren
    } = this.props
    this.props
      .$treepicker({
        title,
        getLabel,
        getChildren,
        value,
        config
      })
      .then(sync)
  }
  render () {
    const {
      label,
      err,
      placeholder,
      textColor = '#666',
      textSize = 30,
      value, // 是数组
      required,
      padding,
      labelSize,
      labelColor,
      errorSize,
      errorColor,
      direction,
      slot,
      valueSlot = 10,
      arrowSize,
      arrowColor,
      getLabel,
      ...otherProps
    } = this.props
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
        arrowSize={arrowSize}
        arrowColor={arrowColor}
        arrow
      >
        {value && value.length ? (
          <SlotColumnView
            onClick={this.onClick}
            slot={valueSlot}
            hAlign="center"
          >
            {value.map(getLabel).map(label => (
              <Text size={textSize} color={textColor} key={label}>
                {label}
              </Text>
            ))}
          </SlotColumnView>
        ) : (
          <Text
            {...otherProps}
            color="#ccc"
            size={textSize}
            onClick={this.onClick}
          >
            {placeholder || '请选择'}
          </Text>
        )}
      </FormRow>
    )
  }
}
