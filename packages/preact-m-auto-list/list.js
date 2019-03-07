import { h, Component } from 'preact'

export default class FlatList extends Component {
  clickHandler (event) {
    let current = event.target
    while (current && !current.dataset.listItemIndex) {
      current = current.parentElement
    }
    const index = current && current.dataset && current.dataset.listItemIndex
    if (index) {
      this.props.itemClickHandler(this.props.data[index])
    }
  }
  constructor (props) {
    super(props)
    this.clickHandler = this.clickHandler.bind(this)
  }
  shouldComponentUpdate (nextProps, nextState) {
    return (
      nextProps.data !== this.props.data ||
      nextProps.extraData !== this.props.extraData
    )
  }
  render ({ data, keyExtractor, renderItem, extraData, itemClickHandler }) {
    return (
      <div onClick={itemClickHandler && this.clickHandler}>
        {data.map((item, index) => (
          <div
            key={keyExtractor ? keyExtractor(item) : index}
            data-list-item-index={index}
          >
            {renderItem(item, index, extraData)}
          </div>
        ))}
      </div>
    )
  }
}
