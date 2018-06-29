import { h } from 'preact'
import { XCenterView, SlotRowView } from 'preact-layoutview'
import px2rem from 'p-to-r'
import Loading from 'preact-loading'
import Text from 'preact-text'

const size = px2rem(40)
const PullDownComponent = ({ stage }) => (
  <XCenterView height={100}>
    {stage === 3 ? (
      <SlotRowView slot={12}>
        <Loading size={40} />
        <Text color="#ccc" size={30}>
          正在刷新...
        </Text>
      </SlotRowView>
    ) : stage === 4 ? (
      <Text color="#ccc" size={28}>
        刷新完成
      </Text>
    ) : (
      <SlotRowView slot={12}>
        <i
          class="iconfont icon-jiantou1"
          style={{
            color: '#ccc',
            fontSize: size,
            display: 'inline-block',
            transition: 'transform 0.33s',
            transform: `rotate(${stage === 1 ? 0 : 180}deg)`
          }}
        />
        <Text color="#ccc" size={30}>
          {stage === 1 ? '下拉刷新' : '松开刷新'}
        </Text>
      </SlotRowView>
    )}
  </XCenterView>
)
export default PullDownComponent
