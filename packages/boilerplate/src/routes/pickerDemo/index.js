import { h, Component } from 'preact'
import { WithPicker } from '../../components/Picker'

@WithPicker
export default class PickerDemo extends Component {
  constructor(props) {
    super(props)
    this.openPicker = this.openPicker.bind(this)
  }
  openPicker() {
    this.props.$picker(['中国', '美国', '英国', '俄罗斯', '法国', '德国', '加拿大', '墨西哥', '日本', '韩国', '委内瑞拉', '以色列']).then(index => {
      console.log(index)
    })
  }

  render() {
    return (
      <div>
        <div onClick={this.openPicker}>打开Picker</div>
      </div>
    )
  }
}
