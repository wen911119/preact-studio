import { h, Component } from 'preact'
import Modal from 'preact-modal'
import style from './style'
import Text from 'preact-text'
import Line from 'preact-line'
import Touchable from 'preact-touchable'
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
        <Touchable onPress={() => this.setState({ open: true })} onLongPress={() => this.setState({ open: true })}>
          <Text>打开modal</Text>
        </Touchable>
        <Modal open={open} onMaskClick={() => this.setState({ open: false })}>
          <XCenterView
            className="dialog"
            height={300}
            width={500}
            bgColor="#fff"
            style={{ borderRadius: '0.1rem' }}
          >
            <Text color="#f8584f">modal</Text>
          </XCenterView>
        </Modal>
      </div>
    )
  }
}
