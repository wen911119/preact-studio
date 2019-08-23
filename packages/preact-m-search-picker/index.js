import { h, Component, cloneElement } from 'preact'
import { WithModal } from '@ruiyun/preact-modal'
import Search from '@ruiyun/preact-m-search'

// eslint-disable-next-line
const renderModalContent = config => () => <Search {...config} />
const SEARCH_HEIGHT = window.innerHeight + 'px'

@WithModal
export class SearchPicker extends Component {
  show = config => {
    const c = renderModalContent(Object.assign({
      height: SEARCH_HEIGHT
    }, config))
    this.props.$modal.show({
      content: c,
      position: 'bottom',
      allowContentTouchMove: true
    })
  }
  render ({ children }) {
    return cloneElement(children, {
      $searchPicker: {
        show: this.show,
        hide: this.props.$modal.hide
      }
    })
  }
}

export const WithSearchPicker = BaseComponent => {
  class ComponentWithSearchPicker extends Component {
    render () {
      return (
        <SearchPicker>
          <BaseComponent {...this.props} />
        </SearchPicker>
      )
    }
  }
  return ComponentWithSearchPicker
}
