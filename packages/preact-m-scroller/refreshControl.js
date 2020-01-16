import { h, Component, cloneElement } from 'preact'

import classNames from './refreshControl.css'

const DefaultRefreshHeader = ({ stage, percent, animation }) => {
  let text
  switch (stage) {
    case 2:
      text = '释放刷新'
      break
    case 3:
      text = '正在刷新'
      break
    case 4:
      text = '刷新完成'
      break
    default:
      text = '下拉刷新'
      break
  }
  return (
    <div
      style={{
        marginTop: `${-50 + (50 * percent) / 100}px`,
        height: '50px',
        lineHeight: '50px',
        backgroundColor: '#eaeaea',
        textAlign: 'center',
        fontSize: '14px',
        transition: animation
      }}
    >
      {text}
      {percent.toFixed(2)}%
    </div>
  )
}

export default class RefreshControl extends Component {
  state = {
    animation: 'none',
    stage: 1,
    percent: 0
  }

  renderRefreshHeader = this.props.renderRefreshHeader || DefaultRefreshHeader

  onGestureStart = () => {
    // this.distance = 0
    // this.setState({
    //   animation: 'none'
    // })
    // this.changeMarginTop(-50, '下拉刷新')
  }

  onPullDown = distance => {
    const percent = (distance / 2 / 50) * 100
    this.setState({
      stage: percent >= 100 ? 2 : 1,
      percent,
      animation: 'none'
    })
  }

  onGestureEnd = () => {
    if (this.state.stage === 2) {
      this.setState(
        {
          stage: 3,
          percent: 100,
          animation: '330ms'
        },
        () => {
          this.props.onRefresh(() => {
            this.setState({
              stage: 4,
              percent: 0
            })
          })
        }
      )
    } else {
      this.setState({
        percent: 0
      })
    }
  }

  render() {
    const { children, height, ...otherProps } = this.props
    const { animation, stage, percent } = this.state
    return (
      <div style={{ height }} className={classNames.flex}>
        {this.renderRefreshHeader({ stage, percent, animation })}
        <div className={classNames.flex}>
          {cloneElement(children, {
            // onGestureStart: this.onGestureStart,
            onPullDown: this.onPullDown,
            onGestureEnd: this.onGestureEnd,
            ...otherProps
          })}
        </div>
      </div>
    )
  }
}
