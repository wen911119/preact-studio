import { h, Component, createRef } from 'preact'
import { getScrollEventTarget, throttle } from '@ruiyun/preact-m-scroller/utils'
import { DefaultEmptyView, DefaultLoadingView } from './default'
import classNames from './index.css'

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

export default class List extends Component {
  shouldComponentUpdate(nextProps) {
    return (
      nextProps.data !== this.props.data ||
      nextProps.extraData !== this.props.extraData ||
      nextProps.error !== this.props.error
    )
  }

  computeVisiable = () => {}

  computeVisiableThrottle = throttle(this.computeVisiable, 300, 300)

  componentDidMount() {
    this.scroller = getScrollEventTarget(this.list)
    this.scroller.addEventListener('scroll', this.computeVisiableThrottle, {
      passive: true
    })
  }

  componentWillUnmount() {
    this.scroller.removeEventListener('scroll', this.computeVisiableThrottle, {
      passive: true
    })
  }

  render() {
    const {
      data,
      EmptyView,
      LoadingView,
      keyExtractor,
      itemClickHandler,
      renderItem,
      recycleThreshold,
      extraData
    } = this.props
    if (!data) {
      return <LoadingView />
    } else if (!data[0].length) {
      return <EmptyView />
    } else {
      return (
        <div onClick={itemClickHandler} ref={s => (this.list = s)}>
          {data.map((d, index) => (
            // eslint-disable-next-line
            <ListFragment
              data={d}
              fragmentId={index}
              key={d.map(keyExtractor).join('-')}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              extraData={extraData}
            />
          ))}
        </div>
      )
    }
  }
}

List.defaultProps = {
  LoadingView: DefaultLoadingView,
  EmptyView: DefaultEmptyView
}
