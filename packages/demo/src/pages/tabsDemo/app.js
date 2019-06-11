import { h, Component } from 'preact'
import { XCenterView } from '@ruiyun/preact-layout-suite'
import Text from '@ruiyun/preact-text'
import Tabs from '@ruiyun/preact-m-tabs'

const SwiperItem = () => (
  <XCenterView height={600}>
    <Text>hello</Text>
  </XCenterView>
)

export default class TabsDemo extends Component {
  render () {
    return (
      <Tabs titles={['tab1', 'tab2']}>
        <SwiperItem />
        <XCenterView height={600}>
          <div>jun</div>
        </XCenterView>
      </Tabs>
    )
  }
}
