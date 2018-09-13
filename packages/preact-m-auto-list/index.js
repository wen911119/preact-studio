import { h, Component } from 'preact'
import { ScrollerWithRefreshAndLoadMore } from '@ruiyun/preact-m-scroller'
import ListDataProvider from './listDataProvider'
import FlatList from './list'
import Pagination from './pagination'

export default class AutoList extends Component {
  render () {
    return (
      <Pagination {...this.props}>
        <ListDataProvider>
          <ScrollerWithRefreshAndLoadMore>
            <FlatList />
          </ScrollerWithRefreshAndLoadMore>
        </ListDataProvider>
      </Pagination>
    )
  }
}
