import { h, Component } from 'preact'

// copy from https://github.com/ElemeFE/mint-ui/blob/master/packages/infinite-scroll/src/directive.js
const getScrollEventTarget = function (element) {
  let currentNode = element
  // bugfix, see http://w3help.org/zh-cn/causes/SD9013 and http://stackoverflow.com/questions/17016740/onscroll-function-is-not-working-for-chrome
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

const normalElementScrollListener = (onTop, onBottom) => e => {
  // offsetHeight是滚动容器高度
  // scrollHeight是滚动内容的总高度
  // scrollTop 是已经滚动上去的高度
  if (scrollTop === 0) {
    onTop()
  }
  const { offsetHeight, scrollHeight, scrollTop } = e.target
  if (offsetHeight + scrollTop === scrollHeight) {
    onBottom()
  }
}

const windowScrollListener = (onTop, onBottom) => {
  let maxScrollTop = 0
  let lastScrollTop = 0
  let timer = null
  return e => {
    // offsetHeight是滚动容器高度
    // scrollHeight是滚动内容的总高度
    // scrollTop 是已经滚动上去的高度
    const { offsetHeight, scrollHeight, scrollTop } = e.target.scrollingElement
    if (scrollTop === 0) {
      onTop()
    }
    if (scrollTop > lastScrollTop) {
      // 正在向下滚
      clearTimeout(timer)
      maxScrollTop = scrollTop
      if (offsetHeight + maxScrollTop > scrollHeight - 100) {
        // 已经进入敏感区域
        timer = setTimeout(onBottom, 200)
      }
    }
    lastScrollTop = scrollTop
  }
}

export default class ScrollListener extends Component {
  constructor (props) {
    super(props)
    this.onTop = this.onTop.bind(this)
    this.onTouchMove = this.onTouchMove.bind(this)
    this.onTouchStart = this.onTouchStart.bind(this)
    this.onTouchEnd = this.onTouchEnd.bind(this)
    this.pullDownRefreshEnable = false
    this.touchStartPointY = 0
    this.enableTouchendListener = false // 是否启用Touchmove的监听,只有触发了下拉刷新之后 才启用监听
    this.isRefreshing = false // 是否正在下拉刷新中
    this.lastMoved = true
    this.percentBaseHeight = 0 // 计算下拉百分比的基数
    this.state = {
      pullDownDistance: 0,
      pullDownText: '下拉刷新'
    }
  }
  componentDidMount () {
    this.scrollEventTarget = getScrollEventTarget(this.scrollWrap)
    let scrollListener
    if (this.scrollEventTarget === window) {
      // window滚动需要特殊处理
      scrollListener = windowScrollListener(this.onTop, this.props.onBottom)
      this.percentBaseHeight = this.scrollEventTarget.innerHeight
    }
    else {
      // 其它的局部滚动
      scrollListener = normalElementScrollListener(
        this.onTop,
        this.props.onBottom
      )
      this.percentBaseHeight = Math.min(
        this.scrollEventTarget.clientHeight,
        window.innerHeight
      )
    }
    this.scrollEventTarget.addEventListener('scroll', scrollListener)
  }
  onTop () {
    // 下拉刷新处于待命状态
    this.props.onRefresh && (this.pullDownRefreshEnable = true)
  }
  onTouchMove (e) {
    if (this.isRefreshing) {
      // 正在下拉刷行中，冻结操作
      e.preventDefault()
      return
    }
    if (this.pullDownRefreshEnable) {
      const distance = e.targetTouches[0].screenY - this.touchStartPointY
      if (distance > 0) {
        // 下拉
        this.enableTouchendListener = true
        e.preventDefault()
        if (this.lastMoved) {
          this.lastMoved = false
          const _d = (distance / this.percentBaseHeight) * 200
          requestAnimationFrame(() => {
            this.setState(
              {
                pullDownDistance: _d,
                pullDownText: _d > 50 ? '释放刷新' : '下拉刷新'
              },
              () => {
                this.lastMoved = true
              }
            )
          })
        }
      }
      else {
        // 上划
        this.pullDownRefreshEnable = false
      }
    }
  }
  onTouchStart (e) {
    if(this.isRefreshing){
      e.preventDefault()
      return 
    }
    this.pullDownRefreshEnable &&
      (this.touchStartPointY = e.targetTouches[0].screenY)
  }
  onTouchEnd (e) {
    if (this.enableTouchendListener) {
      this.enableTouchendListener = false
      this.isRefreshing = true
      if (this.state.pullDownDistance > 50) {
        const p = new Promise(resolve => {
          this.props.onRefresh(resolve)
        })
        p.then(() => {
          this.setState({ pullDownDistance: 0 }, () => {
            this.isRefreshing = false
          })
        })
        requestAnimationFrame(() => {
          this.setState({ pullDownText: '正在刷新...', pullDownDistance: 50 })
        })
      }
      else {
        // 不到触发距离
        requestAnimationFrame(() => {
          this.setState({ pullDownDistance: 0 }, () => {
            this.isRefreshing = false
          })
        })
      }
    }
  }
  render ({ children, height }, { pullDownDistance, pullDownText }) {
    let _style = {
      overflow: 'hidden'
    }
    if (height) {
      _style = {
        height,
        overflow: 'auto'
      }
    }
    return (
      <div
        ref={s => (this.scrollWrap = s)}
        style={_style}
        onTouchMove={this.onTouchMove}
        onTouchStart={this.onTouchStart}
        onTouchEnd={this.onTouchEnd}
      >
        <div
          style={{
            marginTop: '-50px',
            transform: `translate3d(0px, ${pullDownDistance}px, 0px)`,
            transition: this.isRefreshing ? '330ms' : 'none'
          }}
        >
          <div
            style={{
              height: '50px',
              fontSize: '16px',
              backgroundColor: '#ccc',
              lineHeight: '50px',
              textAlign: 'center'
            }}
          >
            {pullDownText}
          </div>
          {children}
        </div>
      </div>
    )
  }
}
