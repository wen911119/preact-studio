import { h, Component } from 'preact'
import Loading from '@ruiyun/preact-loading'
import { SlotRowView } from '@ruiyun/preact-layout-suite'
import { TextButton } from '@ruiyun/preact-button'
import sentry from 'h666-sentry'

export class CountDownTextButton extends Component {
  start = () => {
    const nextCount = this.state.count - 1
    if (nextCount > 0) {
      this.timer = setTimeout(() => {
        this.setState(
          {
            count: nextCount
          },
          this.start
        )
      }, 1000)
    }
    else {
      this.setState({
        status: 0,
        count: this.props.count || 60
      })
    }
  }
  onClick = async () => {
    const { preflightCheck } = this.props
    this.setState({
      status: 1
    })
    let nextStatus = 0
    try {
      const isOk = await preflightCheck()
      if (isOk) {
        nextStatus = 2
      }
    }
    catch (error) {
      sentry.captureException(error)
    }
    this.setState(
      {
        status: nextStatus
      },
      () => {
        nextStatus === 2 && this.start()
      }
    )
  }
  constructor (props) {
    super(props)
    this.state = {
      status: 0,
      count: props.count || 60
    }
  }
  render () {
    const { status, count } = this.state
    const {
      text = '获取验证码',
      textSize = 28,
      textColor = '#65CEA3'
    } = this.props
    let showText = text
    if (status === 1) {
      showText = '发送中'
    }
    else if (status === 2) {
      showText = `${text}(${count}s)`
    }
    return (
      <SlotRowView slot={10}>
        <TextButton
          disable={status !== 0}
          onClick={this.onClick}
          textSize={textSize}
          textColor={textColor}
        >
          {showText}
        </TextButton>
        {status === 1 && <Loading size={textSize - 4} />}
      </SlotRowView>
    )
  }
}
