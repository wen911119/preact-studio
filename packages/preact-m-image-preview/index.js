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
    this.props.$modal.show({
      content: renderBottomModalContent(urls, current, this.props.$modal.hide),
      position: 'bottom',
      mask: 1,
      autoClose: false
    })
  }
  render ({ children }) {
    return cloneElement(children[0], {
      $preview: this.preview
    })
  }
}

export const WithImagePreview = BaseComponent => {
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
