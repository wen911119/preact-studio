import { h, Component, cloneElement } from 'preact'

const DefaultRefreshHeader = ({ stage, percent }) => {
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
        marginTop: '-50px',
        height: '50px',
        lineHeight: '50px',
        backgroundColor: '#eaeaea',
        textAlign: 'center',
        fontSize: '14px'
      }}
    >
      {text}
      {percent.toFixed(2)}%
    </div>
  )
}

export default class RefreshControl extends Component {
  constructor (props) {
    super(props)
    this.pullDownThreshold = props.pullDownThreshold
      ? props.pullDownThreshold * 2
      : 100
    if (props.refreshHeader) {
      this.renderHeader = ({ stage, percent }) => () => (
        <props.refreshHeader stage={stage} percent={percent} />
      )
    }
    else {
      // 用户没提供refreshHeader
      this.renderHeader = ({ stage, percent }) => () => (
        <DefaultRefreshHeader stage={stage} percent={percent} />
      )
    }
    this.state = {
      pullDownDistance: 0,
      stage: 1
    }
  }
  componentWillReceiveProps (nextProps) {
    const { distance, action } = nextProps
    if (action === 'pulldown') {
      this.setState({
        pullDownDistance: distance,
        stage: distance > this.pullDownThreshold ? 2 : 1
      })
    }
    else if (action === 'none' && this.props.action === 'pulldown') {
      // 放手了
      if (this.props.distance > this.pullDownThreshold) {
        // 达到触发条件
        this.setState(
          { pullDownDistance: this.pullDownThreshold, stage: 3 },
          () => {
            if (this.props.onRefresh) {
              const p = new Promise(resolve => {
                this.props.onRefresh(resolve)
              })
              p.then(() => {
                this.setState({ pullDownDistance: 0, stage: 4 }, () => {
                  // 重新计算布局。下拉刷新应该不用更新布局
                  // this.props.recomputeLayout && this.props.recomputeLayout();
                  // 重新设置loadmore
                  this.props.resetLoadMore && this.props.resetLoadMore()
                })
              })
            }
            else {
              // 用户没有提供onRefresh方法
              this.setState({ pullDownDistance: 0, stage: 4 }, () => {
                console.warn('需要提供onRefresh方法')
              })
            }
          }
        )
      }
      else {
        // 没到达触发条件
        this.setState({ pullDownDistance: 0 })
      }
    }
  }
  render (
    { children, action, distance, position, ...otherProps },
    { stage, pullDownDistance }
  ) {
    return cloneElement(children[0], {
      ...otherProps,
      distance: distance < 0 ? distance : pullDownDistance,
      action,
      header: this.renderHeader({
        stage,
        percent: (pullDownDistance / this.pullDownThreshold) * 100
      })
    })
  }
}
