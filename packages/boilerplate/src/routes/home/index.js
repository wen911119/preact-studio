import { h, Component } from 'preact'
import style from './style'
import { Link } from 'preact-router/match'
import ImageUploader from '../../components/ImageUploader'
import p2r from 'p-to-r'
import WithOSS from '../../components/WithOSS'

const ossConfig = {
  region: 'oss-cn-shanghai',
  accessKeyId: 'LTAIpnyXCaVMB88z',
  accessKeySecret: 'y4tw2Qv8oHK91QVBwWyMg8rXkAFTvH',
  bucket: 'hua-chao-shang-mao'
}

const ImageUploaderWithOSS = WithOSS(ossConfig)(ImageUploader)
export default class Home extends Component {
  onImageUploaderChange = urls => {
    console.log(urls, 777)
  }
  submit = async () => {
    const urls = await this.doUpload()
    console.log(urls, 666666)
  }
  hookUploadMethod = method => {
    this.doUpload = method
  }
  render() {
    return (
      <div class={style.home} style={{ padding: `0 ${p2r(30)}` }}>
        <div>
          <Link activeClassName={style.active} href="/scroller">
            scroller
          </Link>
        </div>

        <div>
          <Link activeClassName={style.active} href="/autolist">
            autolist
          </Link>
        </div>
        <div>
          <Link activeClassName={style.active} href="/swiper">
            swiper
          </Link>
        </div>
        <div>
          <Link activeClassName={style.active} href="/tabs">
            tabs
          </Link>
        </div>
        <div>
          <Link activeClassName={style.active} href="/tabsAndAutoList">
            tabsAndAutoList
          </Link>
        </div>
        <div>
          <Link activeClassName={style.active} href="/modal">
            modal
          </Link>
        </div>
        <div>
          <Link activeClassName={style.active} href="/dialog">
            dialog
          </Link>
        </div>
        <div>
          <Link activeClassName={style.active} href="/toast">
            toast
          </Link>
        </div>
        <div>
          <Link activeClassName={style.active} href="/actionsheet">
            actionsheet
          </Link>
        </div>
        <div>
          <Link activeClassName={style.active} href="/picker">
            picker
          </Link>
        </div>
        <ImageUploaderWithOSS
          onChange={this.onImageUploaderChange}
          title="上传发票(自动上传)"
          max={9}
          urls={[
            'https://img.banggo.com/sources/cms/banggo2017/APP/appdsx1206.jpg',
            'https://img.banggo.com/sources/cms/banggo2017/APP/applj81206.jpg'
          ]}
        />
        <div onClick={this.submit} style={{ clear: 'both' }}>
          提交表单
        </div>
        <ImageUploaderWithOSS
          title="选择照片(手动上传)"
          hookUploadMethod={this.hookUploadMethod}
          max={9}
          urls={[
            'https://img.banggo.com/sources/cms/banggo2017/APP/appdsx1206.jpg',
            'https://img.banggo.com/sources/cms/banggo2017/APP/applj81206.jpg'
          ]}
        />
      </div>
    )
  }
}
