import { h, Component } from 'preact'
import { XCenterView } from '@ruiyun/preact-layout-suite'
import AutoList from '@ruiyun/preact-m-auto-list'
import Tabs from '@ruiyun/preact-m-tabs'
import ListItem from '../autolistDemo/listitem'
import { fetchFreeTasks } from '../../services/task'

export default class TabsAndAutoListDemo extends Component {
  constructor(props) {
    super(props)
    this.renderItem = (item, index) => <ListItem content={item} />
    this.format = ret => {
      let res = {
        list: ret,
        pageInfo: {
          totalPage: 1,
          currentPage: 1
        }
      }
      return res
    }
    this.keyExtractor = item => item.id
  }
  render() {
    return (
      <Tabs titles={['待领取', '已领取']} fill style={{height: '100%'}} freezingOnSwiping>
        <AutoList
          format={this.format}
          fetchListData={fetchFreeTasks}
          renderItem={this.renderItem}
          height="100%"
          keyExtractor={this.keyExtractor}
          style={{ backgroundColor: '#f4f4f4' }}
        />
        <XCenterView height={600}>
          <div>jun</div>
        </XCenterView>
      </Tabs>
    )
  }
}
