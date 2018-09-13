import { h, Component } from 'preact'
import {
  SlotColumnView,
  RowView,
  ColumnView
} from '@ruiyun/preact-layout-suite'
import Text from '@ruiyun/preact-text'

const Line = ({ color = '#e8e8e8' }) => (
  <div
    style={{
      borderBottomColor: color,
      borderBottomStyle: 'solid',
      borderBottomWidth: '1px'
    }}
  />
)

class ListItem extends Component {
  shouldComponentUpdate(nextProps) {
    if (nextProps.content !== this.props.content) {
      return true
    }
    return false
  }
  render({ content: { restaurantName, publishDate, address, city, reward } }) {
    return (
      <div>
        <ColumnView
          padding={[0, 30, 0, 30]}
          bgColor="#fff"
          style={{ marginTop: '10px' }}
        >
          <SlotColumnView slot={12} padding={[30, 0, 30, 0]}>
            <RowView>
              <Text color="#181818" size={36}>
                {restaurantName}
              </Text>
            </RowView>
            <RowView>
              <Text color="#999" size={26}>
                发布日期：
              </Text>
              <Text color="#181818" size={26}>
                {publishDate}
              </Text>
            </RowView>
            <RowView>
              <Text color="#999" size={26}>
                城市：
              </Text>
              <Text color="#181818" size={26}>
                {city}
              </Text>
            </RowView>
            <RowView>
              <Text color="#999" size={26}>
                餐厅地址：
              </Text>
              <Text color="#181818" size={26}>
                {address}
              </Text>
            </RowView>
          </SlotColumnView>
          <Line />
          <RowView hAlign="space-between" height={110}>
            <RowView>
              <Text color="#888" size={26}>
                任务奖励：
              </Text>
              <Text color="#ee7700" size={28}>
                {reward}元
              </Text>
            </RowView>
          </RowView>
        </ColumnView>
      </div>
    )
  }
}

export default ListItem
