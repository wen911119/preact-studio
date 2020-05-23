import { h, Component, createRef } from 'preact'
import {
  ScrollerWithLoadMore,
  ScrollerWithRefreshAndLoadMore
} from '@ruiyun/preact-m-scroller'

import { DefaultErrorView, DefaultLoadingView } from './default'
import List from './list'

const isEqual = (obj1, obj2) => {
  // 这里不用lodash.isequal
  // 换成JSON.stringify对比，减小体积
  // 因为这里obj1, obj2通常都是很小的object
  return JSON.stringify(obj1) === JSON.stringify(obj2)
}

class Base extends Component {
  state = {
    data: null,
    pageSize: this.props.pageSize || 10,
    pageNum: 1,
    error: false
  }

  fecthListData = async (pageNum = 1, isRefresh) => {
    const { fetchListData, format, params } = this.props
    const { pageSize, error } = this.state
    let newList = Array.from(this.state.data || [])
    const result = {
      success: true
    }
    if (error) {
      this.setState({ error: false })
    }
    try {
      const {
        list,
        pageInfo: { totalPage, currentPage }
      } = format(
        await fetchListData(
          Object.assign({}, params, { pageNum, pageSize }),
          isRefresh
        )
      )
      if (pageNum === 1) {
        newList = [list]
      } else {
        newList.push(list)
      }
      this.nomore = result.nomore = totalPage <= currentPage
      this.setState({
        data: newList,
        pageNum,
        error: false
      })
    } catch (error) {
      console.log(error)
      result.success = false
    }
    return result
  }

  clickHandler = event => {
    let current = event.target
    let itemId, fragmentId
    while (current && !current.dataset.listItemId) {
      current = current.parentElement
    }
    if (current) {
      itemId = current.dataset.listItemId
      while (current && !current.dataset.listFragmentId) {
        current = current.parentElement
      }
      if (current) {
        fragmentId = current.dataset.listFragmentId
      }
    }
    if (itemId && fragmentId) {
      this.props.itemClickHandler(
        this.state.data[fragmentId][itemId],
        event.target
      )
    }
  }

  onLoadMore = doneCallBack => {
    if (this.nomore) {
      doneCallBack({ nomore: true, success: true })
    } else {
      this.fecthListData(this.state.pageNum + 1).then(doneCallBack)
    }
  }

  onRefresh = done => {
    // 有时接口太快看不到loading的过程，所以加点延时
    setTimeout(() => {
      this.fecthListData(1, true).then(done)
    }, 300)
  }

  fetchFirstPageData = () => {
    this.fecthListData(1).then(({ success }) => {
      if (!success) {
        this.setState({
          error: true
        })
      }
    })
  }

  componentDidMount() {
    this.fetchFirstPageData()
    this.scrollTo = this.scrollerRef.current.scrollTo
  }

  componentDidUpdate(prevProps) {
    // params改变了需要重新刷新
    if (!isEqual(prevProps.params, this.props.params)) {
      // eslint-disable-next-line
      this.setState(
        {
          data: null
        },
        this.fetchFirstPageData
      )
    }
  }
}

export default class AutoList extends Base {
  scrollerRef = createRef()

  render() {
    const {
      keyExtractor,
      renderItem,
      height,
      recycleThreshold,
      extraData,
      LoadingView = DefaultLoadingView,
      ErrorView = DefaultErrorView,
      EmptyView
    } = this.props
    const { data, error } = this.state
    if (error) {
      return <ErrorView retry={this.fetchFirstPageData} />
    }
    if (!data) {
      return <LoadingView />
    }
    return (
      <ScrollerWithLoadMore
        onLoadMore={this.onLoadMore}
        height={height}
        ref={this.scrollerRef}
      >
        <List
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          itemClickHandler={this.clickHandler}
          data={data}
          EmptyView={EmptyView}
          recycleThreshold={recycleThreshold}
          extraData={extraData}
        />
      </ScrollerWithLoadMore>
    )
  }
}

// 彻底分为了tree-shaking
export class AutoListWithRefresh extends Base {
  scrollerRef = createRef()

  render() {
    const {
      keyExtractor,
      renderItem,
      FooterView,
      HeaderView,
      recycleThreshold,
      extraData,
      height
    } = this.props
    const { data, error } = this.state
    return (
      <ScrollerWithRefreshAndLoadMore
        onLoadMore={this.onLoadMore}
        onRefresh={this.onRefresh}
        height={height}
        ref={this.scrollerRef}
      >
        {HeaderView && <HeaderView />}
        <List
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          itemClickHandler={this.clickHandler}
          data={data}
          renderEmptyView={this.renderEmptyView}
          renderLoadingView={this.renderLoadingView}
          renderErrorView={this.renderErrorView}
          retry={this.fetchFirstPageData}
          error={error}
          scroller={
            this.scrollerRef &&
            this.scrollerRef.current &&
            this.scrollerRef.current.base
          }
          recycleThreshold={recycleThreshold}
          extraData={extraData}
        />

        {FooterView && <FooterView />}
      </ScrollerWithRefreshAndLoadMore>
    )
  }
}
