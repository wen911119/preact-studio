import { h, Component } from 'preact'
import { FormRow } from '@ruiyun/preact-m-form-component'
import { SlotRowView } from '@ruiyun/preact-layout-suite'
import Text from '@ruiyun/preact-text'
import { WithDateRangePicker } from '@ruiyun/preact-m-date-range-picker'

@WithDateRangePicker
export default class FormDatePicker extends Component {
  onChose = date => {
    this.props.sync(date)
  }

  onClickHandler = () => {
    const { value, min, max } = this.props
    this.props.$dateRangePicker.show({
      start: value,
      min: min,
      max: max,
      cb: this.onChose,
      single: true
    })
  }

  render() {
    const {
      label,
      err,
      required,
      height,
      value,
      placeholder = '请选择日期'
    } = this.props
    return (
      <FormRow
        label={label}
        err={err}
        required={required}
        height={height}
        arrow
      >
        <SlotRowView slot={30} onClick={this.onClickHandler}>
          <Text color={value ? '#919191' : '#ccc'}>{value || placeholder}</Text>
        </SlotRowView>
      </FormRow>
    )
  }
}
