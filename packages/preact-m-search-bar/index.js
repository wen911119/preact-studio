import { h } from 'preact'
import { SlotRowView } from '@ruiyun/preact-layout-suite'
import SearchInput from '@ruiyun/preact-m-search-input'

const SearchBar = ({
  height = 90,
  bgColor = '#fff',
  padding = [15, 30, 15, 30],
  renderLeft,
  renderRight,
  renderInputLeft,
  renderInputRight,
  slot = 20,
  inputPadding = [0, 30, 0, 30],
  inputSlot = 14,
  inputBgColor = '#F8F9FD',
  bdr = '0.4rem',
  ...otherProps
}) => (
  <SlotRowView height={height} padding={padding} bgColor={bgColor} slot={slot}>
    {renderLeft && renderLeft()}
    <SlotRowView
      padding={inputPadding}
      slot={inputSlot}
      height='100%'
      bgColor={inputBgColor}
      style={{
        borderRadius: bdr,
        '-webkit-box-flex': 1,
        '-webkit-flex': 1,
        flex: 1
      }}
    >
      {renderInputLeft && renderInputLeft()}
      <SearchInput {...otherProps} />
      {renderInputRight && renderInputRight()}
    </SlotRowView>
    {renderRight && renderRight()}
  </SlotRowView>
)

export default SearchBar
