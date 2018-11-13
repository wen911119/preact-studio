import { h, Component } from 'preact'
import { WithToast } from '@ruiyun/preact-m-toast'
import { WithLoading } from '@ruiyun/preact-m-loading'

@WithLoading
@WithToast
export default class TabsDemo extends Component {
  constructor(props) {
    super(props)
    this.openToast = this.openToast.bind(this)
    this.openLoading = this.openLoading.bind(this)
  }
  openToast() {
    this.props.$toast('请填写姓名')
    setTimeout(() => {
      this.props.$toast('请填写姓名3')
    }, 1000)
  }
  openLoading() {
    this.props.$loading.show()
    setTimeout(()=>{
      this.props.$loading.hide()
    }, 400)
    
    setTimeout(()=>{
      console.log(123)
      this.props.$loading.show()
    }, 4000)

    setTimeout(()=>{
      console.log('2 close')
      this.props.$loading.hide()
    }, 6000)
    // this.props.$loading.show('正在加载中3...')
    // setTimeout(()=>{
    //   this.props.$loading.hide()
    // }, 500)
  }

  render() {
    return (
      <div>
        <div onClick={this.openToast}>打开toast</div>
        <div onClick={this.openLoading}>打开loading</div>
      </div>
    )
  }
}
