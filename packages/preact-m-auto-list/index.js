import { h } from 'preact'
import { ScrollerWithRefreshAndLoadMore } from '@ruiyun/preact-m-scroller'
import ListDataProvider from './listDataProvider'
import FlatList from './list'
import Pagination from './pagination'

const AutoList = props => (
  <Pagination {...props}>
    <ListDataProvider>
      <ScrollerWithRefreshAndLoadMore>
        <FlatList />
      </ScrollerWithRefreshAndLoadMore>
    </ListDataProvider>
  </Pagination>
)

export default AutoList
