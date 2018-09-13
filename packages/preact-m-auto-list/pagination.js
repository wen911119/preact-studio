import { h, Component, cloneElement } from 'preact'

export default class Pagination extends Component {
  _onRefresh () {
    this.setState({
      paginationInfo: Object.assign({ ts: Date.now() }, this.initPaginationInfo)
    })
  }
  _onLoadMore () {
    const currentPageNum = this._alias.parrent
      ? this.state.paginationInfo[this._alias.parrent][this._alias.pageNum]
      : this.state.paginationInfo[this._alias.pageNum]
    const newBase = {
      [this._alias.pageSize]: this.pageSize,
      [this._alias.pageNum]: currentPageNum + 1
    }
    const newPaginationInfo = this._alias.parrent
      ? { [this._alias.parrent]: newBase }
      : newBase
    this.setState({ paginationInfo: newPaginationInfo })
  }
  constructor (props) {
    super(props)
    this._onRefresh = this._onRefresh.bind(this)
    this._onLoadMore = this._onLoadMore.bind(this)
    this.pageSize = props.pageSize || 10
    const alias = props.alias || {}
    this._alias = Object.assign(
      { pageNum: 'pageNum', pageSize: 'pageSize' },
      alias
    )
    const base = {
      [this._alias.pageSize]: this.pageSize,
      [this._alias.pageNum]: 1
    }
    this.initPaginationInfo = this._alias.parrent
      ? { [this._alias.parrent]: base }
      : base
    this.state = {
      paginationInfo: this.initPaginationInfo
    }
  }
  render () {
    const { children, ...otherProps } = this.props
    return cloneElement(children[0], {
      ...otherProps,
      _onRefresh: this._onRefresh,
      _onLoadMore: this._onLoadMore,
      paginationInfo: this.state.paginationInfo
    })
  }
}
