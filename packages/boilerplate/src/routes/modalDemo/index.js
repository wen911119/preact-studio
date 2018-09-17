import { h, Component } from 'preact'
import { XCenterView } from '@ruiyun/preact-layout-suite'
import Text from '@ruiyun/preact-text'
import Modal from '@ruiyun/preact-modal'

export default class TabsDemo extends Component {
  constructor(props) {
    super(props)
    this.openModal = this.openModal.bind(this)
    this.onMaskClick = this.onMaskClick.bind(this)
    this.state = {
      open: false
    }
  }
  openModal() {
    this.setState({ open: true })
  }
  onMaskClick () {
    this.setState({ open: false })
  }
  render() {
    return (
      <div>
        <div onClick={this.openModal}>打开modal</div>
        <Modal open={this.state.open} onMaskClick={this.onMaskClick}>
          <XCenterView height={300} bgColor='#fff' width={600}>
            <Text>modal</Text>
          </XCenterView>
        </Modal>
      </div>
    )
  }
}
