import { Component, cloneElement } from 'preact'

export default class SwipeManager extends Component {
  constructor(props) {
    super(props)
    // 在rn安卓webview内document.documentElement.clientWidth有时候是0
    this.containerWidth =
      props.containerWidth ||
      Math.max(document.documentElement.clientWidth, window.screen.width)
    this.state = {
      offset: -this.containerWidth * (props.activeIndex || 0),
      animation: false,
      index: props.activeIndex || 0
    }
  }

  // eslint-disable-next-line
  componentWillReceiveProps(nextProps) {
    const containerWidth = this.containerWidth
    const itemsNum = nextProps.itemsNum || 2
    if (
      nextProps.activeIndex !== this.props.activeIndex &&
      nextProps.activeIndex !== this.state.index
    ) {
      this.setState({
        offset: -nextProps.activeIndex * containerWidth,
        animation: true,
        index: nextProps.activeIndex
      })
    } else if (nextProps.stage === 'swipe-moving') {
      if (
        (nextProps.swipeDistance > 0 && this.state.index === 0) ||
        (nextProps.swipeDistance < 0 && this.state.index === itemsNum - 1)
      ) {
        // 左右边界
        return
      }
      this.setState({
        offset: -this.state.index * containerWidth + nextProps.swipeDistance,
        animation: false
      })
    } else if (
      nextProps.stage === 'swipe-end' &&
      this.props.stage === 'swipe-moving'
    ) {
      if (
        (nextProps.swipeDistance > 0 && this.state.index === 0) ||
        (nextProps.swipeDistance < 0 && this.state.index === itemsNum - 1)
      ) {
        // 左右边界
        return
      }
      let newIndex = this.state.index
      let changed = false
      if (
        Math.abs(nextProps.swipeDistance) > containerWidth / itemsNum ||
        nextProps.speed > 0.6
      ) {
        // 滑动成功
        const increment = nextProps.swipeDistance > 0 ? -1 : 1
        newIndex += increment
        changed = true
      }
      this.setState(
        {
          offset: -containerWidth * newIndex,
          animation: true,
          index: newIndex
        },
        () => {
          changed && this.props.onChange && this.props.onChange(newIndex)
        }
      )
    } else if (nextProps.stage === 'swipe-start') {
      const offset = -containerWidth * this.state.index
      if (offset !== this.state.offset) {
        this.setState({
          offset,
          animation: false
        })
      }
    }
  }

  render() {
    const { children, ...otherProps } = this.props
    const { animation, offset, index } = this.state
    return cloneElement(children, {
      animation,
      offset,
      ...otherProps,
      activeIndex: index
    })
  }
}
