import { h, Component } from 'preact'
import {
  ScrollerWithLoadMore,
  ScrollerWithRefreshAndLoadMore
} from '@ruiyun/preact-m-scroller'

import {
  DefaultErrorView,
  DefaultLoadingView,
  DefaultEmptyView
} from './default'
import List from './list'

export default class AutoList extends Component {
  state = {
    isError: false,
    isLoading: false,
    isNoMore: false,
    currentPage: 0,
    data: []
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
    this.fectchData({ pageNum: 1, type: 'REFRESH', done })
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
      <ScrollerWithLoadMore height={height} onLoadMore={this.onLoadMore}>
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
