import { h, Component } from 'preact'

export default class FlatList extends Component {
  shouldComponentUpdate (nextProps, nextState) {
    if (
      nextProps.data !== this.props.data ||
      nextProps.extraData !== this.props.extraData
    ) {
      return true
    }
    return false
  }
  render ({ keyExtractor, renderItem, extraData }) {
    // console.log('FlatList====>render')
    return (
      <div>
        {this.props.data.map((item, index) => (
          <div key={keyExtractor ? keyExtractor(item) : index}>
            {renderItem(item, index, extraData)}
          </div>
        ))}
      </div>
    )
  }
}
