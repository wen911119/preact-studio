import { h, Component } from 'preact'
import { ColumnView } from '@ruiyun/preact-layout-suite'
import SearchBar from '@ruiyun/preact-m-search-bar'
import AutoList from '@ruiyun/preact-m-auto-list'

export default class Search extends Component {
  state = {
    extraParams: {
      keyword: ''
    }
  }

  onSearch = keyword => {
    this.setState({
      extraParams: Object.assign({}, this.state.extraParams, {
        keyword
      })
    })
  }

  update = extraParams => {
    this.setState({
      extraParams: Object.assign({}, this.state.extraParams, extraParams)
    })
  }

  render() {
    const {
      searchbar,
      autolist: { params, ...others },
      height = '100%',
      slot
    } = this.props
    const mergedParams = Object.assign({}, params, this.state.extraParams)
    // 局部滚动
    return (
      <ColumnView height={height}>
        <SearchBar {...searchbar} onTextInput={this.onSearch} />
        {slot && slot(this.update)}
        <AutoList {...others} params={mergedParams} />
      </ColumnView>
    )
  }
}
