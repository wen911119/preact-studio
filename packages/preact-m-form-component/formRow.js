// 支持水平和竖直两种布局
import { h } from 'preact'
import {
  SlotRowView,
  RowView,
  SlotColumnView
} from '@ruiyun/preact-layout-suite'
import Text from '@ruiyun/preact-text'
import p2r from 'p-to-r'

const arrowStyle = {
  display: 'inline-block',
  borderWidth: '2px 2px 0 0',
  borderStyle: 'solid',
  transform: 'matrix(0.71, 0.71, -0.71, 0.71, 0, 0)'
}

const FormRow = ({
  label,
  err,
  children,
  labelSize = 30,
  labelColor = '#333',
  errorSize = 20,
  errorColor = '#f8584f',
  arrow = false,
  arrowSize = 20,
  arrowColor = '#b2b2b2',
  padding = [30, 30, 30, 30],
  slot = 30,
  required = false,
  direction = 'h'
}) => {
  if (direction === 'h') {
    return (
      <SlotRowView padding={padding} bgColor="#fff" slot={slot}>
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
          <i
            style={Object.assign(
              {
                flexShrink: 0,
                width: p2r(arrowSize),
                height: p2r(arrowSize),
                borderColor: arrowColor
              },
              arrowStyle
            )}
          />
        )}
      </SlotRowView>
    )
  }
  return (
    <SlotColumnView slot={slot} padding={padding}>
      <SlotRowView slot={slot}>
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
      </SlotRowView>
      {children}
    </SlotColumnView>
  )
}

export default FormRow
