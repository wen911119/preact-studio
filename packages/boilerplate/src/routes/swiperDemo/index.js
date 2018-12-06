import { h, Component } from 'preact'
import { XCenterView } from '@ruiyun/preact-layout-suite'
import Text from '@ruiyun/preact-text'
import Swiper from '@ruiyun/preact-m-swiper'

const SwiperItem = () => {
  console.log('SwiperItem===>render')
  return (
    <XCenterView height={600}>
      <Text>hello</Text>
    </XCenterView>
  )
}

export default class ScrollerDemo extends Component {
  constructor (props) {
    super(props)
    this.doSwipe = this.doSwipe.bind(this)
    this.onSwipe = this.onSwipe.bind(this)
    this.state = {
      current: 0
    }
  }
  onSwipe (index) {
    console.log('swiped===>', index)
    this.setState({current: index})
  }
  doSwipe () {
    this.setState({current: 0})
  }
  render() {
    return (
      <Swiper onChange={this.onSwipe} activeIndex={this.state.current}>
        <SwiperItem />
        <XCenterView height={600}>
          <div onClick={this.doSwipe}>jun</div>
        </XCenterView>
      </Swiper>
    )
  }
}
