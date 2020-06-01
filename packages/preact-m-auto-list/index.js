import { h, Component } from 'preact'
import {
  ScrollerWithLoadMore,
  ScrollerWithRefreshAndLoadMore
} from '@ruiyun/preact-m-scroller'
import { getScrollEventTarget } from '@ruiyun/preact-m-scroller/utils'

import {
  DefaultErrorView,
  DefaultLoadingView,
  DefaultEmptyView
} from './default'
import List from './list'

const isEqual = (obj1, obj2) => {
  // 这里不用lodash.isequal
  // 换成JSON.stringify对比，减小体积
  // 因为这里obj1, obj2通常都是很小的object
  return JSON.stringify(obj1) === JSON.stringify(obj2)
}

export default class AutoList extends Component {
  scrollerId = `scroller_${Math.random()}`
  scrollerRef = null

  state = {
    isError: false,
    isLoading: false,
    isNoMore: false,
    currentPage: 0,
    data: []
  }

  scrollTo = (position, animation) => {
    try {
      this.scrollerRef.scrollTo({
        top: position,
        behavior: animation ? 'smooth' : ''
      })
    } catch (err) {
      console.log(err)
      this.scrollerRef.scrollTop = position
    }
  }

  fectchData = async ({ pageNum, type, done }) => {
    const { fetchListData, format, params, pageSize, onError } = this.props
    const queryParams = Object.assign({ pageSize, pageNum }, params)
    try {
      if (type === 'INIT') {
        this.setState({
          isLoading: true,
          data: []
        })
      }
      const { list, nomore } = format(await fetchListData(queryParams))
      let newData = list
      if (type === 'LOAD_MORE') {
        newData = Array.from(this.state.data).concat(newData)
      }
      this.setState(
        {
          isLoading: false,
          isError: false,
          currentPage: pageNum,
          data: newData,
          isNoMore: nomore
        },
        () => {
          if (type === 'REFRESH' || type === 'LOAD_MORE') {
            done({ success: true, nomore })
          }
        }
      )
    } catch (error) {
      onError(error, type)
      if (type === 'INIT') {
        this.setState({
          isError: true,
          isLoading: false
        })
      } else {
        done({ success: false, nomore: false })
      }
    }
  }

  onRefresh = done => {
    // 有时接口太快看不到loading的过程，所以加点延时
    setTimeout(() => {
      this.fectchData({ pageNum: 1, type: 'REFRESH', done })
    }, 300)
  }

  onRetry = () => {
    this.fectchData({ pageNum: 1, type: 'INIT' })
  }

  onLoadMore = done => {
    const { isNoMore, currentPage } = this.state
    if (isNoMore) {
      return done({ success: true, nomore: true })
    }
    return this.fectchData({
      pageNum: currentPage + 1,
      type: 'LOAD_MORE',
      done
    })
  }

  componentDidMount() {
    this.fectchData({ pageNum: 1, type: 'INIT' })
    this.scrollerRef = getScrollEventTarget(this.scrollerId)
  }

  componentDidUpdate(prevProps) {
    // params改变了需要重新刷新
    if (!isEqual(prevProps.params, this.props.params)) {
      this.fectchData({ pageNum: 1, type: 'INIT' })
    }
  }

  render() {
    const { isError, isLoading, data } = this.state
    const {
      refreshable,
      ErrorView,
      LoadingView,
      EmptyView,
      errorViewHeight,
      loadingViewHeight,
      emptyViewHeight,
      height,
      keyExtractor,
      renderItem,
      itemClickHandler,
      recycleThreshold,
      extraData
    } = this.props
    if (isError) {
      return <ErrorView onRetry={this.onRetry} height={errorViewHeight} />
    }
    if (isLoading) {
      return <LoadingView height={loadingViewHeight} />
    }
    if (refreshable) {
      return (
        <ScrollerWithRefreshAndLoadMore
          height={height}
          onLoadMore={this.onLoadMore}
          onRefresh={this.onRefresh}
          id={this.scrollerId}
        >
          <List
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            itemClickHandler={itemClickHandler}
            data={data}
            EmptyView={EmptyView}
            emptyViewHeight={emptyViewHeight}
            recycleThreshold={recycleThreshold}
            extraData={extraData}
          />
        </ScrollerWithRefreshAndLoadMore>
      )
    }
    return (
      <ScrollerWithLoadMore
        height={height}
        onLoadMore={this.onLoadMore}
        id={this.scrollerId}
      >
        <List
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          itemClickHandler={itemClickHandler}
          data={data}
          EmptyView={EmptyView}
          emptyViewHeight={emptyViewHeight}
          recycleThreshold={recycleThreshold}
          extraData={extraData}
        />
      </ScrollerWithLoadMore>
    )
  }
}

AutoList.defaultProps = {
  ErrorView: DefaultErrorView,
  EmptyView: DefaultEmptyView,
  LoadingView: DefaultLoadingView,
  onError: (error, type) => {
    console.log({ error, type })
  }
}
