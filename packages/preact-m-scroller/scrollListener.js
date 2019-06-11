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
  updatePosition (containerHeight, contentHeight, scrollTop) {
    if (scrollTop === 0) {
      this.state.position !== 'top' &&
        this.setState({ position: 'top', contentHeight, containerHeight })
    }
    else if (containerHeight + scrollTop === contentHeight) {
      this.state.position !== 'bottom' &&
        this.setState({ position: 'bottom', contentHeight, containerHeight })
    }
    else if (this.state.position !== 'middle') {
      this.setState({ position: 'middle', contentHeight, containerHeight })
    }
  }
  recomputeLayout () {
    const { scrollHeight, scrollTop, clientHeight } = this.scrollEventTarget
    this.updatePosition(clientHeight, scrollHeight, scrollTop)
  }
  scrollTo (position) {
    this.scrollEventTarget.scrollTop = position
  }
  constructor (props) {
    super(props)
    this.updatePosition = this.updatePosition.bind(this)
    this.recomputeLayout = this.recomputeLayout.bind(this)
    this.scrollTo = this.scrollTo.bind(this)
    this.state = {
      position: 'top',
      contentHeight: 0,
      containerHeight: 0
    }
  }
  componentDidMount () {
    this.scrollEventTarget = getScrollEventTarget(this.scrollWrap)
    this.scrollEventTarget.addEventListener('scroll', e => {
      // offsetHeight是滚动容器高度
      // scrollHeight是滚动内容的总高度
      // scrollTop 是已经滚动上去的高度
      // scrollEventTarget是window时，在e.target.scrollingElement上取值
      const { offsetHeight, scrollHeight, scrollTop } =
        e.target.scrollingElement || e.target
      this.props.onScroll &&
        this.props.onScroll({ offsetHeight, scrollHeight, scrollTop })
      this.updatePosition(offsetHeight, scrollHeight, scrollTop)
    })
  }

  render (
    { children, height, style = {}, ...otherProps },
    { position, contentHeight, containerHeight }
  ) {
    let _style = {
      overflow: 'hidden'
    }
    let _wrapStyle = {}
    if (height) {
      _wrapStyle = {
        overflow: 'hidden'
      }
      _style = {
        height,
        overflowY: 'auto',
        paddingRight: '30px',
        marginLeft: '-30px',
        transform: 'translateX(30px)'
      }
    }
    return (
      <div style={_wrapStyle}>
        <div
          style={Object.assign(_style, style)}
          ref={s => (this.scrollWrap = s)}
        >
          {cloneElement(children, {
            position,
            contentHeight,
            containerHeight,
            recomputeLayout: this.recomputeLayout,
            ...otherProps
          })}
        </div>
      </div>
    )
  }
}
