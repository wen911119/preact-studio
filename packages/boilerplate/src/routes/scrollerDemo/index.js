import { h, Component } from 'preact'
import { XCenterView, SlotRowView, ColumnView } from '@ruiyun/preact-layout-suite'
import Text from '@ruiyun/preact-text'
import { ScrollerWithRefreshAndLoadMore } from '@ruiyun/preact-m-scroller'
import Line from '@ruiyun/preact-line'

class Content extends Component {
  shouldComponentUpdate() {
    return false
  }
  render() {
    return (
      <ColumnView>
        <XCenterView height={600}>
          <Text>hello</Text>
        </XCenterView>
        <Line indent={[30, 30]} />
        <SlotRowView height={200} slot={30}>
          <Text>文</Text>
          <Line v indent={[30, 30]} />
          <Text>君</Text>
        </SlotRowView>
        <Line indent={[30, 0]} color="#ccc" />
        <XCenterView height={600}>
          <Text>jun</Text>
        </XCenterView>
      </ColumnView>
    )
  }
}

export default class ScrollerDemo extends Component {
  render() {
    return (
      <ScrollerWithRefreshAndLoadMore height="100%">
        <Content />
      </ScrollerWithRefreshAndLoadMore>
    )
  }
}
