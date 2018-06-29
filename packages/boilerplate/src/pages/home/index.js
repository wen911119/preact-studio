import { h, Component } from 'preact'
import Scroller from 'preact-scroller'
import { RowView } from 'preact-layoutview'
import Text from 'preact-text'
class ListItem extends Component {
  shouldComponentUpdate (nextProps, nextState) {
    return false
  }
  render ({ item }) {
    return (
      <RowView height={200}>
        <Text color="#f8584f">{item}</Text>
      </RowView>
    )
  }
}

class List extends Component {
  shouldComponentUpdate (nextProps, nextState) {
    return this.props.list !== nextProps.list
  }
  render ({ list }) {
    return <div>{list.map(item => <ListItem item={item} />)}</div>
  }
}

export default class Home extends Component {
  loadMore (done) {
    console.log('load-more')
    let _list = []
    for (let l = this.state.list.length, i = l + 1; i < l + 11; i++) {
      _list.push(i)
    }
    let _list2 = this.state.list.concat(_list)
    setTimeout(() => {
      this.setState({ list: _list2 }, () => {
        done(_list2.length > 60)
      })
    }, 2000)
  }
  refresh (done) {
    console.log('refresh')
    setTimeout(() => {
      this.setState({ list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] })
      done()
    }, 2000)
  }
  constructor (props) {
    super(props)
    this.loadMore = this.loadMore.bind(this)
    this.refresh = this.refresh.bind(this)
    this.state = {
      list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    }
  }
  render ({}, {list}) {
    return (
      <Scroller loadmore={this.loadMore} refresh={this.refresh}>
        <List list={list} />
      </Scroller>
    )
  }
}
