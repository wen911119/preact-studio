import { h, Component } from 'preact'
import { WithDialog } from '@ruiyun/preact-m-dialog'

@WithDialog
export default class TabsDemo extends Component {
  constructor(props) {
    super(props)
    this.openAlert = this.openAlert.bind(this)
    this.openConfirm = this.openConfirm.bind(this)
    this.onBtnClick = this.onBtnClick.bind(this)
  }
  onBtnClick(index) {
    console.log('kkk', index)
  }
  openAlert() {
    this.props.$alert({
      title: '我是标题',
      content:
        '我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容',
      btn: '确定',
      cb: this.onBtnClick
    })
  }
  openConfirm() {
    this.props.$confirm({
      title: '无法访问照片',
      content:
        '你未开启“允许网易云音乐访问照片”选项',
      btns: ['知道了', '去设置'],
      cb: this.onBtnClick
    })
  }

  render() {
    return (
      <div>
        <div onClick={this.openAlert}>打开alert</div>
        <div onClick={this.openConfirm}>打开confirm</div>
      </div>
    )
  }
}
