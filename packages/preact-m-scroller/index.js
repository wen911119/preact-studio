import { h, Component } from 'preact'
import TouchResponder from './touchResponder'
import ScrollListener from './scrollListener'
import Scrollable from './scrollable'
import RefreshControl from './refreshControl'
import LoadMore from './loadMore'

export class Scroller extends Component {
  scrollTo = (p, animation) => {
    this.scroller.scrollTo(p, animation)
  }
  render () {
    const { children, ...otherProps } = this.props
    return (
      <ScrollListener {...otherProps} ref={s => (this.scroller = s)}>
        <TouchResponder>
          <Scrollable>{children}</Scrollable>
        </TouchResponder>
      </ScrollListener>
    )
  }
}

export class ScrollerWithRefresh extends Component {
  scrollTo = (p, animation) => {
    this.scroller.scrollTo(p, animation)
  }
  render () {
    const { children, ...otherProps } = this.props
    return (
      <ScrollListener {...otherProps} ref={s => (this.scroller = s)}>
        <TouchResponder>
          <RefreshControl>
            <Scrollable>{children}</Scrollable>
          </RefreshControl>
        </TouchResponder>
      </ScrollListener>
    )
  }
}

export class ScrollerWithLoadMore extends Component {
  scrollTo = (p, animation) => {
    this.scroller.scrollTo(p, animation)
  }
  render () {
    const { children, ...otherProps } = this.props
    return (
      <ScrollListener {...otherProps} ref={s => (this.scroller = s)}>
        <TouchResponder>
          <LoadMore>
            <Scrollable>{children}</Scrollable>
          </LoadMore>
        </TouchResponder>
      </ScrollListener>
    )
  }
}

export class ScrollerWithRefreshAndLoadMore extends Component {
  scrollTo = (p, animation) => {
    this.scroller.scrollTo(p, animation)
  }
  render () {
    const { children, ...otherProps } = this.props
    return (
      <ScrollListener {...otherProps} ref={s => (this.scroller = s)}>
        <TouchResponder>
          <LoadMore>
            <RefreshControl>
              <Scrollable>{children}</Scrollable>
            </RefreshControl>
          </LoadMore>
        </TouchResponder>
      </ScrollListener>
    )
  }
}

export default Scroller
