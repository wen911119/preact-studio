import { h, Component } from 'preact'
import Dialog from 'preact-dialog'
import style from './style'
import Text from 'preact-text'
import Line from 'preact-line'
import { TouchableInline } from 'preact-touchable'
import Scroller from 'preact-scroller'
import {
  RowView,
  SlotRowView,
  SlotColumnView,
  XCenterView
} from 'preact-layoutview'

const getScrollEventTarget = function (element) {
  let currentNode = element
  // bugfix, see http://w3help.org/zh-cn/causes/SD9013 and http://stackoverflow.com/questions/17016740/onscroll-function-is-not-working-for-chrome
  while (
    currentNode &&
    currentNode.tagName !== 'HTML' &&
    currentNode.tagName !== 'BODY' &&
    currentNode.nodeType === 1
  ) {
    let overflowY = getComputedStyle(currentNode).overflowY
    if (overflowY === 'scroll' || overflowY === 'auto') {
      return currentNode
    }
    currentNode = currentNode.parentNode
  }
  return window
}

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
  constructor (props) {
    super(props)
    this.loadMore = this.loadMore.bind(this)
    this.refresh = this.refresh.bind(this)
  }
  state = {
    open: false,
    list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  }
  loadMore (done) {
    console.log('load-more')
    let _list = []
    for (let l = this.state.list.length, i = l + 1; i < l + 11; i++) {
      _list.push(i)
    }
    let _list2 = this.state.list.concat(_list)
    setTimeout(()=>{
      this.setState({ list: _list2 }, () => {
        done(_list2.length>60)
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
  render ({}, { open, list }) {
    return (
      <div class={style.home}>
        <RowView height={100} bgColor="#ccc">
          <Text color="#f8584f">wenjun</Text>
          <Text color="#f8584f">22222</Text>
        </RowView>
        <SlotRowView height={100} slot={30}>
          <Text color="#f8584f">wenjun</Text>
          <Text color="#f8584f">22222</Text>
        </SlotRowView>
        <TouchableInline onPress={() => this.setState({ open: true })}>
          <Text>打开modal</Text>
        </TouchableInline>
        <Scroller loadmore={this.loadMore} refresh={this.refresh}>
          <List list={list} />
        </Scroller>
        {/* <RowView height={100} bgColor="#ccc">
          <Text color="#f8584f">wenjun</Text>
          <Text color="#f8584f">22222</Text>
        </RowView>
        <SlotRowView height={100} slot={30}>
          <Text color="#f8584f">wenjun</Text>
          <Text color="#f8584f">22222</Text>
        </SlotRowView>
        <RowView height={100} bgColor="#ccc">
          <Text color="#f8584f">wenjun</Text>
          <Text color="#f8584f">22222</Text>
        </RowView>
        <SlotRowView height={100} slot={30}>
          <Text color="#f8584f">wenjun</Text>
          <Text color="#f8584f">22222</Text>
        </SlotRowView>
        <RowView height={100} bgColor="#ccc">
          <Text color="#f8584f">wenjun</Text>
          <Text color="#f8584f">22222</Text>
        </RowView>
        <SlotRowView height={100} slot={30}>
          <Text color="#f8584f">wenjun</Text>
          <Text color="#f8584f">22222</Text>
        </SlotRowView>
        <RowView height={100} bgColor="#ccc">
          <Text color="#f8584f">wenjun</Text>
          <Text color="#f8584f">22222</Text>
        </RowView>
        <SlotRowView height={100} slot={30}>
          <Text color="#f8584f">wenjun</Text>
          <Text color="#f8584f">22222</Text>
        </SlotRowView> */}
        <Dialog
          open={open}
          title="无法访问照片"
          content="你未开启“允许网易云音乐访问照片”选项"
          onConfirm={() => this.setState({ open: false })}
        />
      </div>
    )
  }
}
