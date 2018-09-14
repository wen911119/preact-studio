import { h, Component, cloneElement } from 'preact'

export default class SwipeManager extends Component {
  componentWillReceiveProps (nextProps) {
    const containerWidth = this.containerWidth
    const itemsNum = nextProps.itemsNum || 2
    if (nextProps.stage === 'swipe-moving') {
      if (
        (nextProps.swipeDistance > 0 && this.state.index === 0) ||
        (nextProps.swipeDistance < 0 && this.state.index === itemsNum - 1)
      ) {
        // 左边界
        return
      }
      this.setState({
        swipeDistance: -this.state.index * containerWidth + nextProps.swipeDistance,
        animation: false,
        freeze: true
      })
    } else if (nextProps.stage === 'swipe-end') {
      if (
        (nextProps.swipeDistance > 0 && this.state.index === 0) ||
        (nextProps.swipeDistance < 0 && this.state.index === itemsNum - 1)
      ) {
        // 右边界
        return
      }
      let newIndex = this.state.index
      if (
        Math.abs(nextProps.swipeDistance) > containerWidth / itemsNum ||
        nextProps.speed > 0.6
      ) {
        // 滑动成功
        const increment = nextProps.swipeDistance > 0 ? -1 : 1
        newIndex += increment
      }
      this.setState({
        swipeDistance: -containerWidth * newIndex,
        animation: true,
        freeze: false,
        index: newIndex
      })
    } else if (nextProps.stage === 'swipe-start') {
      this.setState({
        swipeDistance: -containerWidth * this.state.index,
        animation: false,
        freeze: true
      })
    }
  }
  constructor (props) {
    super(props)
    this.containerWidth = document.body.clientWidth
    this.state = {
      swipeDistance: props.swipeDistance,
      animation: false,
      freeze: false,
      index: 0
    }
  }
  render () {
    const { children, ...otherProps } = this.props
    const { animation, freeze, swipeDistance } = this.state
    return cloneElement(children[0], {
      freeze,
      animation,
      offset: swipeDistance,
      ...otherProps
    })
  }
}