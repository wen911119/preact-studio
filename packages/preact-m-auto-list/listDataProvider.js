import { h, Component, cloneElement } from 'preact'
import isEqual from 'lodash.isequal'

export default class ListDataProvider extends Component {
  onRefresh (done) {
    this.props._onRefresh && this.props._onRefresh()
    this.onRefreshDone = done
  }
  onLoadMore (done) {
    // 如果第一次加载或者刷新时就没有更多了，就直接触发done(true)
    // 不用再发请求
    if (this.nomore) {
      done(this.nomore)
    }
    else {
      this.props._onLoadMore && this.props._onLoadMore(done)
      this.onLoadMoreDone = done
    }
  }
  async _fecthListData (p) {
    const { fetchListData, format } = this.props
    let newList = this.state.data
    const {
      list,
      pageInfo: { totalPage, currentPage }
    } = format(await fetchListData(p))
    this.nomore = totalPage <= currentPage
    if (currentPage === 1 || currentPage === 0) {
      newList = list
      this.onRefreshDone && this.onRefreshDone(this.nomore)
    }
    else {
      newList = newList.concat(list)
      this.onLoadMoreDone && this.onLoadMoreDone(this.nomore)
    }
    this.setState({ data: newList, loading: false })
  }

  constructor (props) {
    super(props)
    this.onRefresh = this.onRefresh.bind(this)
    this.onLoadMore = this.onLoadMore.bind(this)
    this.nomore = false
    this.state = {
      data: [],
      loading: true // 可以同时代替afterFirstRequest
    }
  }
  componentDidMount () {
    // mounted之后立即加载
    const { params, paginationInfo } = this.props
    this._fecthListData(Object.assign({}, params, paginationInfo))
  }
  componentWillReceiveProps (nextProps) {
    const { params, paginationInfo, _onRefresh } = this.props
    if (!isEqual(nextProps.params, params)) {
      // params改变了需要重新刷新
      this.setState({
        loading: true
      }, _onRefresh)
    }
    else if (!isEqual(nextProps.paginationInfo, paginationInfo)) {
      // 下一页
      this._fecthListData(
        Object.assign({}, nextProps.params, nextProps.paginationInfo)
      )
    }
  }
  render () {
    const { children, ...otherProps } = this.props
    return cloneElement(children, {
      ...otherProps,
      data: this.state.data,
      onRefresh: this.onRefresh,
      onLoadMore: this.onLoadMore,
      loading: this.state.loading
    })
  }
}
