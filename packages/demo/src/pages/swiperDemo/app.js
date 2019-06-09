import { h, Component } from 'preact'
import { XCenterView } from '@ruiyun/preact-layout-suite'
import Swiper from '@ruiyun/preact-m-swiper'
import Image from '@ruiyun/preact-image'
import Button from '@ruiyun/preact-button'

export default class ScrollerDemo extends Component {
  state = {
    current: 0
  }
  onSwipe = index => {
    console.log('swiped===>', index)
    this.setState({ current: index })
  }
  doSwipe = () => {
    this.setState({ current: 0 })
  }
  render () {
    return (
      <Swiper onChange={this.onSwipe} activeIndex={this.state.current}>
        <Image
          height={414}
          src='https://img.banggo.com/sources/cms/banggo2017/APP/LB65-1.jpg'
        />
        <Image
          height={414}
          src='https://img.banggo.com/sources/cms/banggo2017/APP/LB65-5.jpg'
        />
        <Image
          height={414}
          src='https://img.banggo.com/sources/cms/banggo2017/APP/LB65-3.jpg'
        />
        <XCenterView height={414}>
          <Button
            color='#f8584f'
            onClick={this.doSwipe}
            height={80}
            width={240}
          >
            回到第一张
          </Button>
        </XCenterView>
      </Swiper>
    )
  }
}
