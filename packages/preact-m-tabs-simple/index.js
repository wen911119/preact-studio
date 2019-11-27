import { h } from 'preact'
import { RowView, ColumnView } from '@ruiyun/preact-layout-suite'
import Text from '@ruiyun/preact-text'
import p2r from 'p-to-r'
import classNames from './index.css'

const TabsSimple = ({
  index = 0,
  items,
  height = 100,
  width = '100%',
  color = '#AAAAAA',
  activeColor = '#719AEE',
  size = 28,
  onChange,
  lineWidth = 60,
  lineHeight = 4,
  align = 'around',
  renderItem
}) => (
  <RowView height={height} hAlign={align} width={width}>
    {items.map((item, i) => (
      <ColumnView key={i} hAlign="center" vAlign="between" height="100%">
        <i />
        <RowView
          // eslint-disable-next-line
          onClick={() => onChange(i)}>
          {renderItem ? (
            renderItem(item)
          ) : (
            <Text color={index === i ? activeColor : color} size={size}>
              {item}
            </Text>
          )}
        </RowView>
        <i
          className={classNames.line}
          style={{
            width: index === i ? p2r(lineWidth || '100%') : 0,
            height: p2r(lineHeight),
            backgroundColor: activeColor
          }}
        />
      </ColumnView>
    ))}
  </RowView>
)

export default TabsSimple
