// 支持水平和竖直两种布局
import { h } from 'preact'
import { SlotRowView, RowView } from '@ruiyun/preact-layout-suite'
import Text from '@ruiyun/preact-text'

const FormRow = ({
  label,
  err,
  children,
  labelSize = 30,
  labelColor = '#333',
  errorSize = 20,
  errorColor = '#f8584f',
  arrow = false,
  arrowSize = 30,
  arrowColor = '#ccc',
  padding = [10, 30, 10, 30],
  slot = 30,
  required = false,
  height = 100
}) => (
  <SlotRowView padding={padding} height={height} bgColor="#fff" slot={slot}>
    <Text size={labelSize} color={labelColor} style={{ flexShrink: 0 }}>
      {required && (
        <Text size={labelSize} color="#f8584f">
          *
        </Text>
      )}
      {label}
    </Text>
    {err && (
      <Text size={errorSize} color={errorColor} style={{ flexShrink: 0 }}>
        {err}
      </Text>
    )}
    <RowView style={{ flex: 1, height: '100%' }} hAlign="right">
      {children}
    </RowView>
    {arrow && (
      <Text size={arrowSize} color={arrowColor} style={{ flexShrink: 0 }}>
        &gt;
      </Text>
    )}
  </SlotRowView>
)

export default FormRow
