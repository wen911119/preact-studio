import { h, Component } from 'preact'

class ListItem extends Component {
  shouldComponentUpdate(nextProps) {
    return (
      nextProps.extraData[nextProps.itemKey] !==
      this.props.extraData[nextProps.itemKey]
    )
  }

  render() {
    const { renderItem, data, extraData, index, itemKey } = this.props
    return (
      <div data-list-item-index={index}>
        {renderItem(data, extraData[itemKey])}
      </div>
    )
  }
}

export default class List extends Component {
  shouldComponentUpdate(nextProps) {
    return (
      nextProps.data !== this.props.data ||
      nextProps.extraData !== this.props.extraData
    )
  }

  onItemClick = event => {
    const { itemClickHandler, data } = this.props
    if (itemClickHandler) {
      let current = event.target
      let itemIndex
      while (current && !current.dataset.listItemIndex) {
        current = current.parentElement
      }
      if (current) {
        itemIndex = current.dataset.listItemIndex
      }
      if (itemIndex) {
        itemClickHandler(data[itemIndex], event.target)
      }
    }
  }

  render() {
    const {
      data,
      EmptyView,
      keyExtractor,
      renderItem,
      emptyViewHeight,
      extraData = {}
    } = this.props
    if (data.length === 0) {
      return <EmptyView height={emptyViewHeight} />
    } else {
      return (
        <div onClick={this.onItemClick}>
          {data.map((item, index) => (
            <ListItem
              data={item}
              key={keyExtractor(item)}
              itemKey={keyExtractor(item)}
              index={index}
              renderItem={renderItem}
              extraData={extraData}
            />
          ))}
        </div>
      )
    }
  }
}
