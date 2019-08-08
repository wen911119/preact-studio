import { h, Component } from 'preact'
import Input from '@ruiyun/preact-input'
import { SlotRowView } from '@ruiyun/preact-layout-suite'
import Line from '@ruiyun/preact-line'
import Indicator from 'h5-indicator'
import { CountDownTextButton } from '@ruiyun/preact-countdown'
import sentry from 'h666-sentry'
import { FormRow } from './formRow'


const captchInputCheck = (data, type) => {
  if (type === 'phone') {
    return /^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[01356789]\d{2}|4(?:0\d|1[0-2]|9\d))|9[189]\d{2}|6[567]\d{2}|4[579]\d{2})\d{6}$/.test(
      data
    )
  }
  else if (type === 'email') {
    return data.indexOf('@') > -1
  }
}
export default class CaptchInput extends Component {
  state = {
    session: ''
  }
  preflightCheck = async () => {
    const { preflightCheck, data, type = 'phone', sendCode } = this.props
    let result = true
    if (data && captchInputCheck(data, type)) {
      if (preflightCheck) {
        // 父级自定义preflightCheck,比如人机校验
        try {
          result = await preflightCheck()
        }
        catch (error) {
          sentry.captureException(error)
          result = false
        }
      }
      if (result) {
        try {
          const session = await sendCode(data)
          this.setState({
            session
          })
        }
        catch (error) {
          sentry.captureException(error)
          result = false
        }
      }
    }
    else {
      result = false
      Indicator.toast(
        type === 'phone' ? '请输入正确的手机号' : '请输入正确的邮箱'
      )
    }
    return result
  }
  onChange = event => {
    this.props.sync({
      session: this.state.session,
      code: event.target.value
    })
  }
  renderRight = () => {
    const {
      count,
      text,
      textSize,
      textColor,
      countdownHeight = 45,
      splitLineColor = '#ccc',
      splitSlot = 30
    } = this.props
    return (
      <SlotRowView height={countdownHeight} slot={splitSlot}>
        <Line v color={splitLineColor} />
        <CountDownTextButton
          count={count}
          text={text}
          textSize={textSize}
          textColor={textColor}
          preflightCheck={this.preflightCheck}
        />
      </SlotRowView>
    )
  }
  render () {
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
      value,
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
        renderRight={this.renderRight}
      >
        <Input
          {...otherProps}
          value={value && value.code}
          onChange={this.onChange}
          height="0.6rem"
          width="100%"
          style={Object.assign(
            {
              textAlign: direction === 'v' ? 'left' : 'right',
              lineHeight: '0.6rem'
            },
            style
          )}
        />
      </FormRow>
    )
  }
}
