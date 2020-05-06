import { h, Component, createRef } from 'preact'
import Loading from '@ruiyun/preact-loading'
import { XCenterView, SlotColumnView } from '@ruiyun/preact-layout-suite'
import Text from '@ruiyun/preact-text'
import {
  ScrollerWithLoadMore,
  ScrollerWithRefreshAndLoadMore
} from '@ruiyun/preact-m-scroller'

import classNames from './index.css'

const throttle = (fn, delay, atleast) => {
  let timer = null
  let previous = null

  return function() {
    const now = +new Date()

    if (!previous) previous = now

    if (now - previous > atleast) {
      fn()
      // 重置上一次开始时间为本次结束时间
      previous = now
    } else {
      clearTimeout(timer)
      timer = setTimeout(function() {
        fn()
      }, delay)
    }
  }
}

const isEqual = (obj1, obj2) => {
  // 这里不用lodash.isequal
  // 换成JSON.stringify对比，减小体积
  // 因为这里obj1, obj2通常都是很小的object
  return JSON.stringify(obj1) === JSON.stringify(obj2)
}

const DefaultEmptyView = () => (
  <XCenterView height='70%' bgColor='#fff'>
    <SlotColumnView slot={30} hAlign='center'>
      <svg
        viewBox='0 0 1024 1024'
        xmlns='http://www.w3.org/2000/svg'
        width='40'
        height='40'
      >
        <path
          d='M855.6 427.2H168.5c-12.7 0-24.4 6.9-30.6 18L4.4 684.7C1.5 689.9 0 695.8 0 701.8v287.1c0 19.4 15.7 35.1 35.1 35.1H989c19.4 0 35.1-15.7 35.1-35.1V701.8c0-6-1.5-11.8-4.4-17.1L886.2 445.2c-6.2-11.1-17.9-18-30.6-18zM673.4 695.6c-16.5 0-30.8 11.5-34.3 27.7-12.7 58.5-64.8 102.3-127.2 102.3s-114.5-43.8-127.2-102.3c-3.5-16.1-17.8-27.7-34.3-27.7H119c-26.4 0-43.3-28-31.1-51.4l81.7-155.8c6.1-11.6 18-18.8 31.1-18.8h622.4c13 0 25 7.2 31.1 18.8l81.7 155.8c12.2 23.4-4.7 51.4-31.1 51.4H673.4zm146.5-486.1c-1-1.8-2.1-3.7-3.2-5.5-9.8-16.6-31.1-22.2-47.8-12.6L648.5 261c-17 9.8-22.7 31.6-12.6 48.4.9 1.4 1.7 2.9 2.5 4.4 9.5 17 31.2 22.8 48 13L807 257.3c16.7-9.7 22.4-31 12.9-47.8zm-444.5 51.6L255 191.6c-16.7-9.6-38-4-47.8 12.6-1.1 1.8-2.1 3.6-3.2 5.5-9.5 16.8-3.8 38.1 12.9 47.8L337.3 327c16.9 9.7 38.6 4 48-13.1.8-1.5 1.7-2.9 2.5-4.4 10.2-16.8 4.5-38.6-12.4-48.4zM512 239.3h2.5c19.5.3 35.5-15.5 35.5-35.1v-139c0-19.3-15.6-34.9-34.8-35.1h-6.4C489.6 30.3 474 46 474 65.2v139c0 19.5 15.9 35.4 35.5 35.1h2.5z'
          fill='#eaeaea'
        />
      </svg>
      <Text size={26} color='#ccc'>
        暂无数据
      </Text>
    </SlotColumnView>
  </XCenterView>
)
const DefaultLoadingView = () => (
  <XCenterView height='70%' bgColor='#fff'>
    <Loading />
  </XCenterView>
)
const DefaultErrorView = retry => {
  return (
    <XCenterView height='70%' bgColor='#fff'>
      <SlotColumnView slot={50} hAlign='center' onClick={retry}>
        <css-icon className={classNames['icon-refresh']} />
        <Text size={26} color='#ccc'>
          加载出错，点击重试
        </Text>
      </SlotColumnView>
    </XCenterView>
  )
}

class ListItem extends Component {
  shouldComponentUpdate(nextProps) {
    return (
      nextProps.extraData[nextProps.itemKey] !==
      this.props.extraData[nextProps.itemKey]
    )
  }

  render() {
    const { renderItem, data, itemId, extraData, itemKey } = this.props
    return (
      <div data-list-item-id={itemId}>
        {renderItem(data, extraData[itemKey])}
      </div>
    )
  }
}

class ListFragment extends Component {
  state = {
    hide: false
  }

  listFragmentRef = createRef()

  fragmentHeight = 'auto'

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextState.hide !== this.state.hide ||
      nextProps.extraData !== this.props.extraData
    )
  }

  computeVisiable = throttle(
    () => {
      const myPosition = this.listFragmentRef.current.getBoundingClientRect()
      const { recycleThreshold = 1000 } = this.props
      if (
        myPosition.bottom < -recycleThreshold ||
        myPosition.top > recycleThreshold
      ) {
        this.setState({
          hide: true
        })
      } else {
        this.setState({
          hide: false
        })
      }
    },
    10,
    100
  )

  componentDidMount() {
    this.fragmentHeight = this.listFragmentRef.current.clientHeight
    this.props.scroller.addEventListener('scroll', this.computeVisiable)
  }

  componentWillUnmount() {
    this.props.scroller.removeEventListener('scroll', this.computeVisiable)
  }

  render() {
    const {
      data,
      fragmentId,
      keyExtractor,
      renderItem,
      extraData = {}
    } = this.props
    const { hide } = this.state
    return (
      <div
        data-list-fragment-id={fragmentId}
        ref={this.listFragmentRef}
        style={{ height: this.fragmentHeight }}
        className={hide ? classNames.fragmentHide : classNames.fragmentShow}
      >
        {data.map((d, index) => (
          <ListItem
            data={d}
            key={keyExtractor(d)}
            itemId={index}
            itemKey={keyExtractor(d)}
            renderItem={renderItem}
            extraData={extraData}
          />
        ))}
      </div>
    )
  }
}

class List extends Component {
  shouldComponentUpdate(nextProps) {
    return (
      nextProps.data !== this.props.data ||
      nextProps.extraData !== this.props.extraData ||
      nextProps.error !== this.props.error
    )
  }

  render() {
    const {
      data,
      renderEmptyView,
      renderLoadingView,
      renderErrorView,
      keyExtractor,
      itemClickHandler,
      renderItem,
      scroller,
      recycleThreshold,
      extraData,
      error,
      retry
    } = this.props
    if (!data) {
      return error ? renderErrorView(retry) : renderLoadingView()
    } else if (!data[0].length) {
      return renderEmptyView()
    } else {
      return (
        <div onClick={itemClickHandler}>
          {data.map((d, index) => (
            // eslint-disable-next-line
            <ListFragment
              data={d}
              fragmentId={index}
              key={d.map(keyExtractor).join('-')}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              scroller={scroller}
              recycleThreshold={recycleThreshold}
              extraData={extraData}
            />
          ))}
        </div>
      )
    }
  }
}

class Base extends Component {
  state = {
    data: null,
    pageSize: this.props.pageSize || 10,
    pageNum: 1,
    error: false
  }

  renderEmptyView = this.props.EmptyView || DefaultEmptyView
  renderLoadingView = this.props.LoadingView || DefaultLoadingView
  renderErrorView = this.props.ErrorView || DefaultErrorView

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
      FooterView,
      HeaderView,
      height,
      recycleThreshold,
      extraData
    } = this.props
    const { data, error } = this.state
    return (
      <ScrollerWithLoadMore
        onLoadMore={this.onLoadMore}
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
          error={error}
          retry={this.fetchFirstPageData}
          scroller={
            this.scrollerRef &&
            this.scrollerRef.current &&
            this.scrollerRef.current.base
          }
          recycleThreshold={recycleThreshold}
          extraData={extraData}
        />

        {FooterView && <FooterView />}
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
