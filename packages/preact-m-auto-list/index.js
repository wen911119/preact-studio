import { h, Component } from 'preact'
import {
  ScrollerWithLoadMore,
  ScrollerWithRefreshAndLoadMore
} from '@ruiyun/preact-m-scroller'

import classNames from './index.css'

const throttle = function(fn, delay, atleast) {
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

const DefaultEmptyView = () => <div>empty</div>
const DefaultLoadingView = () => <div>loading...</div>

class ListItem extends Component {
  shouldComponentUpdate() {
    return false
  }

  render() {
    const { renderItem, data, itemId } = this.props
    return <div data-list-item-id={itemId}>{renderItem(data)}</div>
  }
}

class ListFragment extends Component {
  state = {
    hide: false
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.hide !== this.state.hide
  }

  componentDidMount() {
    const { scroller, recycleThreshold = 1000 } = this.props
    this.fragmentHeight = this.f.clientHeight
    scroller.addEventListener(
      'scroll',
      throttle(
        () => {
          const myPosition = this.f.getBoundingClientRect()
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
    )
  }

  render() {
    const { data, fragmentId, keyExtractor, renderItem } = this.props
    const { hide } = this.state

    return (
      <div
        data-list-fragment-id={fragmentId}
        ref={f => (this.f = f)}
        style={{ height: this.fragmentHeight }}
        className={hide ? classNames.fragmentHide : classNames.fragmentShow}
      >
        {data.map((d, index) => (
          <ListItem
            data={d}
            key={keyExtractor(d)}
            itemId={index}
            renderItem={renderItem}
          />
        ))}
      </div>
    )
  }
}

class List extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.data !== this.props.data
  }

  render() {
    const {
      data,
      renderEmptyView,
      renderLoadingView,
      keyExtractor,
      itemClickHandler,
      renderItem,
      scroller,
      recycleThreshold
    } = this.props
    if (!data) {
      return renderLoadingView()
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
              key={index}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              scroller={scroller}
              recycleThreshold={recycleThreshold}
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
    nomore: false,
    loading: true
  }

  renderEmptyView = this.props.EmptyView || DefaultEmptyView
  renderLoadingView = this.props.LoadingView || DefaultLoadingView

  fecthListData = async () => {
    const { fetchListData, format, params } = this.props
    const { pageNum, pageSize } = this.state
    let newList = Array.from(this.state.data || [])
    const {
      list,
      pageInfo: { totalPage, currentPage }
    } = format(
      await fetchListData(Object.assign({}, params, { pageNum, pageSize }))
    )
    if (pageNum === 1) {
      newList = [list]
    } else {
      newList.push(list)
    }
    this.setState({
      data: newList,
      loading: false,
      nomore: totalPage <= currentPage
    })
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

  onLoadMore = () => {
    this.setState(
      {
        pageNum: this.state.pageNum + 1,
        loading: true
      },
      this.fecthListData
    )
  }

  onRefresh = done => {
    this.setState(
      {
        pageNum: 1,
        data: done && this.state.data,
        loading: true
      },
      () => this.fecthListData().then(() => done && done())
    )
  }

  componentDidMount() {
    this.fecthListData()
    this.scrollTo = this.s.scrollTo
  }

  componentDidUpdate(prevProps) {
    // params改变了需要重新刷新
    if (!isEqual(prevProps.params, this.props.params)) {
      this.onRefresh()
    }
  }
}

export default class AutoList extends Base {
  render() {
    const {
      keyExtractor,
      renderItem,
      FooterView,
      HeaderView,
      height,
      recycleThreshold
    } = this.props
    const { data, nomore, loading } = this.state
    return (
      <ScrollerWithLoadMore
        onLoadMore={this.onLoadMore}
        onRefresh={this.onRefresh}
        nomore={nomore}
        loading={loading}
        height={height}
        ref={s => (this.s = s)}
      >
        {HeaderView && <HeaderView />}
        <List
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          itemClickHandler={this.clickHandler}
          data={data}
          renderEmptyView={this.renderEmptyView}
          renderLoadingView={this.renderLoadingView}
          scroller={this.s && this.s.base.children[0]}
          recycleThreshold={recycleThreshold}
        />

        {FooterView && <FooterView />}
      </ScrollerWithLoadMore>
    )
  }
}

// 彻底分为了tree-shaking
export class AutoListWithRefresh extends Base {
  render() {
    const {
      keyExtractor,
      renderItem,
      FooterView,
      HeaderView,
      recycleThreshold
    } = this.props
    const { data, nomore, loading } = this.state
    return (
      <ScrollerWithRefreshAndLoadMore
        onLoadMore={this.onLoadMore}
        onRefresh={this.onRefresh}
        nomore={nomore}
        loading={loading}
        ref={s => (this.s = s)}
      >
        {HeaderView && <HeaderView />}
        <List
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          itemClickHandler={this.clickHandler}
          data={data}
          renderEmptyView={this.renderEmptyView}
          renderLoadingView={this.renderLoadingView}
          scroller={this.s && this.s.base.children[0]}
          recycleThreshold={recycleThreshold}
        />

        {FooterView && <FooterView />}
      </ScrollerWithRefreshAndLoadMore>
    )
  }
}
