import { h } from 'preact'
import Loading from 'preact-loading'
import { XCenterView, SlotRowView } from 'preact-layoutview'
import Text from 'preact-text'

const PullUpComponent = ({ nomore }) => (
  <XCenterView height={100}>
    {nomore ? (
      <Text size={28} color="#ccc">
        没有更多了～
      </Text>
    ) : (
      <SlotRowView slot={12}>
        <Loading />
        <Text size={28} color="#ccc">
          加载中...
        </Text>
      </SlotRowView>
    )}
  </XCenterView>
)

export default PullUpComponent