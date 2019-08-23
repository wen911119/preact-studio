import { h, Component, cloneElement } from 'preact'
import { WithModal } from '@ruiyun/preact-modal'
import { TextButton } from '@ruiyun/preact-button'
import Search from '@ruiyun/preact-m-search'

const SEARCH_HEIGHT = window.innerHeight + 'px'

// eslint-disable-next-line
const renderModalContent = ({ searchbar, autolist, slot }) => () => (
  <div
    style={{ width: '100vw', height: SEARCH_HEIGHT, backgroundColor: '#fff' }}
  >
    <Search searchbar={searchbar} autolist={autolist} slot={slot} />
  </div>
)

@WithModal
export class SearchPicker extends Component {
  show = ({ searchbar = {}, autolist = {}, slot } = {}) => {
    const { fetchListData, renderItem, keyExtractor, format } = autolist
    if (fetchListData && renderItem && keyExtractor && format) {
      const mergedSearchBarConfig = Object.assign(
        {
          renderRight: () => (
            <TextButton
              textSize={24}
              textColor="#ccc"
              onClick={this.props.$modal.hide}
            >
              取消
            </TextButton>
          ),
          placeholder: '请输入关键字搜索'
        },
        searchbar
      )
      const content = renderModalContent({
        searchbar: mergedSearchBarConfig,
        autolist,
        slot
      })
      this.props.$modal.show({
        content,
        position: 'bottom',
        allowContentTouchMove: true
      })
    }
    else {
      console.warn(
        'autolist的配置fetchListData, renderItem, keyExtractor, format缺一不可'
      )
    }
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
