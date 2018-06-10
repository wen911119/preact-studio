import { h } from 'preact'
import style from './style'
import Text from 'preact-text'
import {
  RowView,
  SlotRowView,
  SlotColumnView,
  XCenterView
} from 'preact-layoutview'

const Home = () => (
  <div class={style.home}>
    <h1>Home</h1>
    <p>This is the Home component.</p>
    <RowView height={100} bgColor="#ccc">
      <Text color="#f8584f">wenjun</Text>
      <Text color="#f8584f">22222</Text>
    </RowView>
    <SlotRowView height={100} gap={30}>
      <Text color="#f8584f">wenjun</Text>
      <Text color="#f8584f">22222</Text>
    </SlotRowView>
    <SlotColumnView gap={30}>
      <Text color="#f8584f">wenjun</Text>
      <Text color="#f8584f">22222</Text>
    </SlotColumnView>
    <XCenterView height={100}>
      <Text color="#f8584f">wenjun</Text>
    </XCenterView>
  </div>
)

export default Home
