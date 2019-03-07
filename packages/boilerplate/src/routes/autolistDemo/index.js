import { h, Component } from 'preact'
import AutoList from '@ruiyun/preact-m-auto-list'
import ListItem from './listitem'
import { fetchFreeTasks } from '../../services/task'

export default class AutoListDemo extends Component {
  itemClickHandler (item) {
    console.log(item, 7777)
  }
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
    this.itemClickHandler = this.itemClickHandler.bind(this)
  }
  render() {
    return (
      <AutoList
        format={this.format}
        fetchListData={fetchFreeTasks}
        renderItem={this.renderItem}
        height="100%"
        keyExtractor={this.keyExtractor}
        style={{ backgroundColor: '#f4f4f4' }}
        itemClickHandler={this.itemClickHandler}
      />
    )
  }
}
