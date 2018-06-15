import { h, Component } from 'preact'
import Dialog from 'preact-dialog'
import style from './style'
import Text from 'preact-text'
import Line from 'preact-line'
import { TouchableInline } from 'preact-touchable'
import {
  RowView,
  SlotRowView,
  SlotColumnView,
  XCenterView
} from 'preact-layoutview'

export default class Home extends Component {
  state = {
    open: false
  }
  render ({}, { open }) {
    return (
      <div class={style.home}>
        <h1>Home</h1>
        <p>This is the Home component.</p>
        <RowView height={100} bgColor="#ccc">
          <Text color="#f8584f">wenjun</Text>
          <Text color="#f8584f">22222</Text>
        </RowView>
        <SlotRowView height={100} slot={30}>
          <Text color="#f8584f">wenjun</Text>
          <Text color="#f8584f">22222</Text>
        </SlotRowView>
        <SlotColumnView slot={<Line />}>
          <Text color="#f8584f">11111</Text>
          <Text color="#f8584f">22222</Text>
          <Text color="#f8584f">33333</Text>
          <Text color="#f8584f">44444</Text>
          <Text color="#f8584f">55555</Text>
        </SlotColumnView>
        <TouchableInline onPress={() => this.setState({ open: true })}>
          <Text>打开modal</Text>
        </TouchableInline>
        <Dialog open={open} title="无法访问照片" content="你未开启“允许网易云音乐访问照片”选项" onConfirm={() => this.setState({ open: false })} />
      </div>
    )
  }
}
