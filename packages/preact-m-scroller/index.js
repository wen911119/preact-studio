import { h } from 'preact'
import TouchResponder from './touchResponder'
import ScrollListener from './scrollListener'
import Scrollable from './scrollable'
import RefreshControl from './refreshControl'
import LoadMore from './loadMore'

// todo bugfix
// 局部滚动模式下内容高度不足以滚动时候，因为position不会为bottom，所以上拉动作js没有介入阻止冒泡
// 导致滚动穿透
// todo

export const Scroller = ({ children, ...otherProps }) => (
  <ScrollListener {...otherProps}>
    <TouchResponder>
      <Scrollable>{children}</Scrollable>
    </TouchResponder>
  </ScrollListener>
)

export const ScrollerWithRefresh = ({ children, ...otherProps }) => (
  <ScrollListener {...otherProps}>
    <TouchResponder>
      <RefreshControl>
        <Scrollable>{children}</Scrollable>
      </RefreshControl>
    </TouchResponder>
  </ScrollListener>
)

export const ScrollerWithLoadMore = ({ children, ...otherProps }) => (
  <ScrollListener {...otherProps}>
    <TouchResponder>
      <LoadMore>
        <Scrollable>{children}</Scrollable>
      </LoadMore>
    </TouchResponder>
  </ScrollListener>
)


export const ScrollerWithRefreshAndLoadMore = ({ children, ...otherProps }) => (
  <ScrollListener {...otherProps}>
    <TouchResponder>
      <LoadMore>
        <RefreshControl>
          <Scrollable>{children}</Scrollable>
        </RefreshControl>
      </LoadMore>
    </TouchResponder>
  </ScrollListener>
)

export default Scroller
