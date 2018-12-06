import { h, Component } from 'preact'
import style from './style'
import { Link } from 'preact-router/match'
import Image from '@ruiyun/preact-image'
export default class Home extends Component {
  state = {
    images: []
  }
  onChoose = async e => {
    const files = Array.from(e.target.files)

    const base64Urls = await Promise.all(
      files.map(async file => {
        const p = new Promise(resolve => {
          const fileReader = new FileReader()
          fileReader.onload = e2 => {
            resolve(e2.target.result)
          }
          fileReader.readAsDataURL(file)
        })
        const base64Url = await p
        return base64Url
      })
    )
    this.setState({
      images: base64Urls
    })
  }
  render() {
    return (
      <div class={style.home}>
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
        <div>
          {this.state.images.map((image, i) => <Image mode='fit' width={200} height={200} key={i} src={image} />)}
          <label for="uploader">
            <i style={{ fontSize: '40px' }}>+</i>
          </label>
          <input
            id="uploader"
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={this.onChoose}
          />
        </div>
      </div>
    )
  }
}
