import { h, Component, cloneElement } from 'preact'

export default class SwipeManager extends Component {
  constructor (props) {
    super(props)
    this.containerWidth = document.body.clientWidth
    this.state = {
      swipeDistance: props.swipeDistance,
      animation: false,
      freeze: false,
      index: props.activeIndex || 0
    }
  }
  componentWillReceiveProps (nextProps) {
    const containerWidth = this.containerWidth
    const itemsNum = nextProps.itemsNum || 2
    if (nextProps.activeIndex !== this.props.activeIndex) {
      this.setState({
        swipeDistance: -nextProps.activeIndex * containerWidth,
        animation: true,
        freeze: false,
        index: nextProps.activeIndex
      })
    }
    else if (nextProps.stage === 'swipe-moving') {
      if (
        (nextProps.swipeDistance > 0 && this.state.index === 0) ||
        (nextProps.swipeDistance < 0 && this.state.index === itemsNum - 1)
      ) {
        // 左边界
        return
      }
      this.setState({
        swipeDistance:
          -this.state.index * containerWidth + nextProps.swipeDistance,
        animation: false,
        freeze: true
      })
    }
    else if (nextProps.stage === 'swipe-end') {
      if (
        (nextProps.swipeDistance > 0 && this.state.index === 0) ||
        (nextProps.swipeDistance < 0 && this.state.index === itemsNum - 1)
      ) {
        // 右边界
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
          swipeDistance: -containerWidth * newIndex,
          animation: true,
          freeze: false,
          index: newIndex
        },
        () => {
          changed && this.props.onChange && this.props.onChange(newIndex)
        }
      )
    }
    else if (nextProps.stage === 'swipe-start') {
      const swipeDistance = -containerWidth * this.state.index
      if (swipeDistance !== this.state.swipeDistance) {
        this.setState({
          swipeDistance: -containerWidth * this.state.index,
          animation: false
        })
      }
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
