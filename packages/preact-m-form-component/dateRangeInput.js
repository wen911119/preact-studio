import { h, Component } from 'preact'
import { FormRow } from '@ruiyun/preact-m-form-component'
import { SlotRowView } from '@ruiyun/preact-layout-suite'
import Text from '@ruiyun/preact-text'
import { WithDateRangePicker } from '@ruiyun/preact-m-date-range-picker'

@WithDateRangePicker
export default class FormDateRangeInput extends Component {
  onChose = (start, end) => {
    this.props.sync({
      start,
      end
    })
  }

  onClickHandler = () => {
    const { value, min, max } = this.props
    this.props.$dateRangePicker.show({
      start: value && value.start,
      end: value && value.end,
      min,
      max,
      cb: this.onChose
    })
  }

  render() {
    const {
      label,
      err,
      required,
      height,
      value,
      split = '至',
      startPlaceholder = '开始时间',
      endPlaceholder = '结束时间'
    } = this.props
    return (
      <FormRow label={label} err={err} required={required} height={height}>
        <SlotRowView slot={30} onClick={this.onClickHandler}>
          <Text color={value ? '#919191' : '#ccc'}>
            {value ? value.start : startPlaceholder}
          </Text>
          <Text>{split}</Text>
          <Text color={value ? '#919191' : '#ccc'}>
            {value ? value.end : endPlaceholder}
          </Text>
        </SlotRowView>
      </FormRow>
    )
  }
}
