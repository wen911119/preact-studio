import { h, Component, cloneElement } from 'preact'
import className from './scroller.css'
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
      this.setState({ position: 'top', contentHeight, containerHeight })
    }
    // 顺序不能调整
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
      // todo bugfix 填充下一页数据时也会触发scroll事件，导致再次触发will-bottom，又加载了一页。
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

  scrollTo (position = 0, animation = true) {
    this.scrollEventTarget.scrollTo({
      top: position,
      left: 0,
      behavior: animation ? 'smooth' : 'instant'
    })
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
    this.observer = new MutationObserver(this.updatePosition)
    this.observer.observe(this.scrollWrap, { childList: true, subtree: true })
    // 需不需要debounce？
    this.scrollEventTarget.addEventListener('scroll', this.updatePosition)
  }

  componentWillUnmount () {
    this.observer && this.observer.disconnect()
  }
  render (
    { children, height, style = {}, id, ...otherProps },
    { position, contentHeight, containerHeight }
  ) {
    let defaultStyle
    if (height) {
      defaultStyle = {
        overflowY: 'auto'
      }
      if (height === 'flex1') {
        defaultStyle = Object.assign(defaultStyle, {
          '-webkit-box-flex': 1,
          '-webkit-flex': 1,
          flex: 1
        })
      }
      else {
        defaultStyle.height = height
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
        className={className.scroller}
        id={id}
      >
        {cloneElement(children, {
          position,
          contentHeight,
          containerHeight,
          ...otherProps
        })}
      </div>
    )
  }
}
