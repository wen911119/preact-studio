import { h, Component } from 'preact'

class ListItem extends Component {
  shouldComponentUpdate(nextProps) {
    return (
      nextProps.extraData[nextProps.itemKey] !==
      this.props.extraData[nextProps.itemKey]
    )
  }

  render() {
    const { renderItem, data, extraData, itemKey } = this.props
    return (
      <div data-list-item-id={itemKey}>
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
      let itemId
      while (current && !current.dataset.listItemId) {
        current = current.parentElement
      }
      if (current) {
        itemId = current.dataset.listItemId
      }
      if (itemId) {
        itemClickHandler(data[itemId], event.target)
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
      extraData
    } = this.props
    if (data.length === 0) {
      return <EmptyView height={emptyViewHeight} />
    } else {
      return (
        <div onClick={this.onItemClick}>
          {data.map(item => (
            <ListItem
              data={item}
              key={keyExtractor(item)}
              itemKey={keyExtractor(item)}
              renderItem={renderItem}
              extraData={extraData}
            />
          ))}
        </div>
      )
    }
  }
}
