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
    this.setState({ data: newList, afterFirstRequest: true })
  }

  constructor (props) {
    super(props)
    this.onRefresh = this.onRefresh.bind(this)
    this.onLoadMore = this.onLoadMore.bind(this)
    this.previousParmas = props.pramas || {}
    this.previousPaginationInfo = props.paginationInfo
    this.nomore = false
    this.state = {
      data: [],
      afterFirstRequest: false
    }
  }
  componentDidMount () {
    const { _onRefresh, loading } = this.props
    loading && loading.show && loading.show()
    _onRefresh()
  }
  componentDidUpdate () {
    const { params = {}, paginationInfo, _onRefresh, loading } = this.props
    if (!isEqual(this.previousParmas, params)) {
      // 重新刷新
      loading && loading.show && loading.show()
      _onRefresh()
    }
    else if (!isEqual(this.previousPaginationInfo, paginationInfo)) {
      // 更新
      this._fecthListData(Object.assign({}, params, paginationInfo)).then(
        () => {
          loading && loading.hide && loading.hide()
        }
      )
    }
    this.previousParmas = params
    this.previousPaginationInfo = paginationInfo
  }
  render () {
    const { children, ...otherProps } = this.props
    return cloneElement(children, {
      ...otherProps,
      data: this.state.data,
      onRefresh: this.onRefresh,
      onLoadMore: this.onLoadMore,
      afterFirstRequest: this.state.afterFirstRequest
    })
  }
}
