import { h, Component, cloneElement } from 'preact'

// copy from https://github.com/ElemeFE/mint-ui/blob/master/packages/infinite-scroll/src/directive.js
const getScrollEventTarget = element => {
  let currentNode = element
  while (
    currentNode &&
    currentNode.tagName !== 'HTML' &&
    currentNode.tagName !== 'BODY' &&
    currentNode.nodeType === 1
  ) {
    let overflowY = document.defaultView.getComputedStyle(currentNode).overflowY
    if (overflowY === 'scroll' || overflowY === 'auto') {
      return currentNode
    }
    currentNode = currentNode.parentNode
  }
  return window
}

export default class ScrollListener extends Component {
  updatePosition () {
    const { containerHeight, contentHeight, scrollTop } = this.getHeight(
      this.scrollEventTarget
    )
    if (scrollTop === 0) {
      this.state.position !== 'top' &&
        this.setState({ position: 'top', contentHeight, containerHeight })
    }
    else if (containerHeight + scrollTop === contentHeight) {
      this.state.position !== 'bottom' &&
        this.setState({ position: 'bottom', contentHeight, containerHeight })
    }
    else if (containerHeight * 1.15 + scrollTop > contentHeight) {
      // 快接近底部了
      // 为了解决ios Safari 上滚动隐藏标题和底部菜单栏后取到的containerHeight高度小于实际值的问题
      // 比如iPhone 7P 上,取到的containerHeight高度总是622，但是滚动隐藏标题和底部菜单栏后实际值大概有695
      // 所以导致position一直到不了bottom,也就触发不了onLoadMore
      // 这个问题在设置了height，变为局部滚动时是不存在的
      // 但是为了统一解决，加入了will-bottom的状态
      // 以后onLoadMore触发条件改为will-bottom
      this.state.position !== 'will-bottom' &&
        this.setState({
          position: 'will-bottom',
          contentHeight,
          containerHeight
        })
    }
    else if (this.state.position !== 'middle') {
      this.setState({ position: 'middle', contentHeight, containerHeight })
    }
  }

  scrollTo (position) {
    this.scrollEventTarget.scrollTop = position
  }

  getHeight (scrollEventTarget) {
    // 读取容器高度containerHeight，滚动内容高度contentHeight，已经卷去的高度scrollTop
    let scrollingElement = scrollEventTarget
    if (scrollEventTarget === window) {
      scrollingElement = document.scrollingElement
    }
    return {
      containerHeight: scrollingElement.offsetHeight,
      contentHeight: scrollingElement.scrollHeight,
      scrollTop: scrollingElement.scrollTop
    }
  }

  constructor (props) {
    super(props)
    this.updatePosition = this.updatePosition.bind(this)
    this.getHeight = this.getHeight.bind(this)
    this.scrollTo = this.scrollTo.bind(this)
    this.state = {
      position: 'top',
      contentHeight: 0,
      containerHeight: 0
    }
  }

  componentDidMount () {
    this.scrollEventTarget = getScrollEventTarget(this.scrollWrap)
    // 需不需要debounce？
    this.scrollEventTarget.addEventListener('scroll', this.updatePosition)
  }

  render (
    { children, height, style = {}, ...otherProps },
    { position, contentHeight, containerHeight }
  ) {
    let defaultStyle
    if (height) {
      defaultStyle = {
        height,
        overflowY: 'auto',
        paddingRight: '30px', // 为了去掉滚动条
        marginLeft: '-30px', // 为了去掉滚动条
        transform: 'translateX(30px)' // 为了去掉滚动条
      }
    }
    else {
      defaultStyle = {
        overflow: 'hidden' // 为了隐藏下拉刷新组件
      }
    }

    return (
      <div
        style={Object.assign(defaultStyle, style)}
        ref={s => (this.scrollWrap = s)}
      >
        {cloneElement(children, {
          position,
          contentHeight,
          containerHeight,
          recomputeLayout: this.updatePosition,
          ...otherProps
        })}
      </div>
    )
  }
}
