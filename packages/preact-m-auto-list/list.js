import { h, Component } from 'preact'

const DefaultEmptyView = () => <div>empty</div>
const DefaultLoadingView = () => <div>loading...</div>

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
    if (props.EmptyView) {
      this.renderEmptyView = props.EmptyView
    }
    else {
      this.renderEmptyView = DefaultEmptyView
    }
    if (props.LoadingView) {
      this.renderLoadingView = props.LoadingView
    }
    else {
      this.renderLoadingView = DefaultLoadingView
    }
  }
  shouldComponentUpdate (nextProps) {
    return (
      nextProps.data !== this.props.data ||
      nextProps.extraData !== this.props.extraData ||
      nextProps.loading !== this.props.loading
    )
  }
  render ({
    data,
    keyExtractor,
    renderItem,
    extraData,
    itemClickHandler,
    loading,
    FooterView
  }) {
    if (loading === true) {
      return this.renderLoadingView()
    }
    else if (loading === false && data.length === 0) {
      return this.renderEmptyView()
    }
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
        {FooterView && <FooterView />}
      </div>
    )
  }
}
