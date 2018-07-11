import { h, Component } from 'preact'
// copy from https://github.com/ElemeFE/mint-ui/blob/master/packages/infinite-scroll/src/directive.js
const getScrollEventTarget = element => {
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

let DefaultLoadMore = ({ nomore }) => (
  <div
    style={{
      fontSize: '14px',
      lineHeight: '50px',
      textAlign: 'center',
      color: '#ccc'
    }}
  >
    {nomore ? '没有更多了~' : '正在加载中...'}
  </div>
)
export const SetDefaultLoadMoreComponent = c => {
  DefaultLoadMore = c
}

let DefaultPullDownRefresh = ({ stage }) => (
  <div style={{ fontSize: '14px', lineHeight: '50px', textAlign: 'center' }}>
    {stage === 1
      ? '下拉刷新'
      : stage === 2
        ? '释放刷新'
        : stage === 3
          ? '正在刷新...'
          : '刷新完成'}
  </div>
)
export const SetDefaultPullDownRefreshComponent = c => {
  DefaultPullDownRefresh = c
}

export default class ScrollListener extends Component {
  onTop () {
    // 下拉刷新处于待命状态
    this.props.refresh && (this.pullDownRefreshEnable = true)
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
          // const _d = (distance / this.percentBaseHeight) * 200
          const _d = distance / 2
          requestAnimationFrame(() => {
            this.setState(
              {
                pullDownDistance: _d,
                pullDownStage: _d > 50 ? 2 : 1
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
    if (this.isRefreshing) {
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
          this.props.refresh(resolve)
        })
        p.then(nomore => {
          this.setState(
            { pullDownDistance: 0, nomore: !!nomore, pullDownStage: 4 },
            () => {
              this.isRefreshing = false
            }
          )
        })
        requestAnimationFrame(() => {
          this.setState({ pullDownStage: 3, pullDownDistance: 50 })
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
  constructor (props) {
    super(props)
    this.onTop = this.onTop.bind(this)
    this.onTouchMove = this.onTouchMove.bind(this)
    this.onTouchStart = this.onTouchStart.bind(this)
    this.onTouchEnd = this.onTouchEnd.bind(this)
    this.pullDownRefreshEnable = false // 是否启用下拉刷新手势的监听
    this.touchStartPointY = 0 // 滑动手势起始点的y坐标，用于计算滑动距离和方向
    this.enableTouchendListener = false // 是否启用Touchmove的监听,只有触发了下拉刷新之后 才启用监听
    this.isRefreshing = false // 是否正在下拉刷新中
    this.lastMoved = true // 上一帧动画是否已经完成
    this.onLoading = false // 是否正在加载更多中
    this.state = {
      pullDownDistance: 0,
      pullDownStage: 1,
      nomore: false
    }
    this.PullDownRefresh = props.refreshComponent || DefaultPullDownRefresh
    this.LoadMore = props.loadmoreComponent || DefaultLoadMore
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
      if (scrollTop === 0) {
        this.onTop()
        return
      }
      if (
        this.props.loadmore &&
        !this.onLoading &&
        !this.state.nomore &&
        offsetHeight + scrollTop >=
          scrollHeight - (this.props.loadmoreOffset || 100) // loadmoreOffset默认100，在window上滚动时不建议小于这个值
      ) {
        this.onLoading = true
        const p = new Promise(resolve => {
          this.props.loadmore(resolve)
        })
        p.then(nomore => {
          this.onLoading = false
          nomore && this.setState({ nomore: true })
        })
      }
    })
  }
  render ({ children, height }, { pullDownDistance, pullDownStage, nomore }) {
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
          <this.PullDownRefresh stage={pullDownStage} />
          {children}
          <this.LoadMore nomore={nomore} />
        </div>
      </div>
    )
  }
}
