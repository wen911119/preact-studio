import { h, Component, cloneElement } from 'preact'
import { WithModal } from '@ruiyun/preact-modal'
import Swiper from '@ruiyun/preact-m-swiper'
import Image from '@ruiyun/preact-image'

// eslint-disable-next-line
const renderBottomModalContent = (urls, currentIndex, clickHandler) => () => (
  <div onClick={clickHandler} style={{ width: '100vw' }}>
    <Swiper activeIndex={currentIndex}>
      {urls.map((url, i) => (
        <Image key={i} mode="fit" src={url} width="100vw" height="100vh" />
      ))}
    </Swiper>
  </div>
)

@WithModal
export class Preview extends Component {
  preview = (urls, current) => {
    if (typeof wx !== 'undefined') {
      // 微信环境内用微信的图片预览api
      // eslint-disable-next-line
      wx.previewImage({
        current: urls[current], // 当前显示图片的http链接
        urls // 需要预览的图片http链接列表
      })
    }
    else if (window.plus) {
      window.plus.nativeUI.previewImage(urls, { current })
    }
    else {
      this.props.$modal.show({
        content: renderBottomModalContent(
          urls,
          current,
          this.props.$modal.hide
        ),
        position: 'bottom',
        mask: 1,
        autoClose: false
      })
    }
  }
  render ({ children }) {
    return cloneElement(children, {
      $preview: this.preview
    })
  }
}

const WithImagePreview = BaseComponent => {
  class ComponentWithImagePreview extends Component {
    render () {
      return (
        <Preview>
          <BaseComponent {...this.props} />
        </Preview>
      )
    }
  }
  return ComponentWithImagePreview
}

export default WithImagePreview