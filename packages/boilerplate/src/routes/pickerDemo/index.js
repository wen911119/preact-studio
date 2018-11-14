import { h, Component } from 'preact'
import { WithPicker } from '../../components/Picker'
import Scroller from '@ruiyun/preact-m-scroller'

@WithPicker
export default class PickerDemo extends Component {
  constructor(props) {
    super(props)
    this.openPicker = this.openPicker.bind(this)
  }
  openPicker() {
    this.props.$picker([1, 2, 3, 4, 5, 6, 7, 8, 9]).then(index => {
      console.log(index)
    })
  }

  render() {
    return (
      <div>
        <div onClick={this.openPicker}>打开picker</div>
        <Scroller height="300px">
          <div style={{ height: '100px' }}>111111111</div>
          <div style={{ height: '100px' }}>222222222</div>
          <div style={{ height: '100px' }}>333333333</div>
          <div style={{ height: '100px' }}>444444444</div>
          <div style={{ height: '100px' }}>555555555</div>
          <div style={{ height: '100px' }}>666666666</div>
          <div style={{ height: '100px' }}>777777777</div>
          <div style={{ height: '100px' }}>888888888</div>
          <div style={{ height: '100px' }}>999999999</div>
        </Scroller>
      </div>
    )
  }
}
