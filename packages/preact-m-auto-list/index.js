import { h } from 'preact'
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
import useListController from './useListController'

export const AutoList = ({
  height,
  fetchListData,
  format,
  params,
  pageSize = 20,
  LoadingView = DefaultLoadingView,
  ErrorView = DefaultErrorView,
  EmptyView = DefaultEmptyView,
  loadingViewHeight,
  errorViewHeight,
  emptyViewHeight,
  renderItem,
  keyExtractor,
  recycleThreshold,
  extraData,
  itemClickHandler
}) => {
  const [{ data, isLoading, isError }, loadMore, retry] = useListController({
    fetchListData,
    format,
    params,
    pageSize
  })
  if (isError) {
    return <ErrorView onRetry={retry} height={errorViewHeight} />
  }
  if (isLoading) {
    return <LoadingView height={loadingViewHeight} />
  }
  return (
    <ScrollerWithLoadMore height={height} onLoadMore={loadMore}>
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

export const AutoListWithRefresh = ({
  height,
  fetchListData,
  format,
  params,
  pageSize = 20,
  LoadingView = DefaultLoadingView,
  ErrorView = DefaultErrorView,
  EmptyView = DefaultEmptyView,
  loadingViewHeight,
  errorViewHeight,
  emptyViewHeight,
  renderItem,
  keyExtractor,
  recycleThreshold,
  extraData,
  itemClickHandler
}) => {
  const [
    { data, isLoading, isError },
    loadMore,
    retry,
    refresh
  ] = useListController({
    fetchListData,
    format,
    params,
    pageSize
  })
  if (isError) {
    return <ErrorView onRetry={retry} height={errorViewHeight} />
  }
  if (isLoading) {
    return <LoadingView height={loadingViewHeight} />
  }
  return (
    <ScrollerWithRefreshAndLoadMore
      height={height}
      onLoadMore={loadMore}
      onRefresh={refresh}
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
