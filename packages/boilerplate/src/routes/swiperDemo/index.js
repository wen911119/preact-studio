import { h, Component } from 'preact'
import { XCenterView } from '@ruiyun/preact-layout-suite'
import Text from '@ruiyun/preact-text'
import Swiper from '../../components/Swiper'

const SwiperItem = () => {
  console.log('SwiperItem===>render')
  return (
    <XCenterView height={600}>
      <Text>hello</Text>
    </XCenterView>
  )
}

export default class ScrollerDemo extends Component {
  render() {
    return (
      <Swiper>
        <SwiperItem />
        <XCenterView height={600}>
          <Text>jun</Text>
        </XCenterView>
      </Swiper>
    )
  }
}
