import { h, Component } from 'preact'
import { WithPicker } from '@ruiyun/preact-m-picker'
import Text from '@ruiyun/preact-text'
import FormRow from './formRow'

@WithPicker
export default class FormPickerSheet extends Component {
  defaultMapIndexsToValues = (indexs = [], options = []) => {
    const split = this.props.split || ','
    return indexs.map(index => options[index]).join(split)
  }
  defaultMapValuesToIndexs = (values, options = []) => {
    const split = this.props.split || ','
    return (
      values &&
      values
        .split(split)
        .map(value => options.findIndex(item => item === value))
    )
  }

  onClick = () => {
    const {
      title = '请选择',
      options = [],
      config,
      sync,
      mode,
      value,
      mapIndexsToValues,
      mapValuesToIndexs
    } = this.props
    if (
      (mapIndexsToValues && !mapValuesToIndexs) ||
      (mapValuesToIndexs && !mapIndexsToValues)
    ) {
      throw new Error(
        'mapIndexsToValues 和 mapValuesToIndexs必须同时传或者同时不传'
      )
    }
    const deFormat = mapValuesToIndexs || this.defaultMapValuesToIndexs
    this.props
      .$picker({
        title,
        options,
        config,
        mode,
        values: deFormat(value, options)
      })
      .then(indexs => {
        const format = mapIndexsToValues || this.defaultMapIndexsToValues
        sync(format(indexs, options))
      })
  }
  render () {
    console.log('render-form-picker')
    const {
      label,
      err,
      placeholder,
      textColor = '#666',
      textSize = 30,
      value,
      required,
      padding,
      labelSize,
      labelColor,
      errorSize,
      errorColor,
      direction,
      slot,
      arrowSize,
      arrowColor,
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
        <Text
          {...otherProps}
          color={value ? textColor : '#ccc'}
          size={textSize}
          onClick={this.onClick}
        >
          {value || placeholder || '请选择'}
        </Text>
      </FormRow>
    )
  }
}
