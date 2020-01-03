import { h, Component } from 'preact'
import { ScrollerWithRefreshAndLoadMore } from '@ruiyun/preact-m-scroller'
import ListDataProvider from './listDataProvider'
import FlatList from './list'
import Pagination from './pagination'

export default class AutoList extends Component {
  scrollTo = (p, animation) => {
    this.scroller.scrollTo(p, animation)
  }
  render () {
    return (
      <Pagination {...this.props}>
        <ListDataProvider>
          <ScrollerWithRefreshAndLoadMore ref={s => (this.scroller = s)}>
            <FlatList />
          </ScrollerWithRefreshAndLoadMore>
        </ListDataProvider>
      </Pagination>
    )
  }
}
