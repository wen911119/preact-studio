// 支持水平和竖直两种布局
import { h } from 'preact'
import {
  SlotRowView,
  RowView,
  SlotColumnView
} from '@ruiyun/preact-layout-suite'
import Text from '@ruiyun/preact-text'
import p2r from 'p-to-r'
import className from './formrow.css'

const FormRow = ({
  label,
  err,
  children,
  labelSize = 30,
  labelColor = '#333',
  errorSize = 20,
  errorColor = '#f8584f',
  arrow = false,
  arrowSize = 18,
  arrowColor = '#b2b2b2',
  padding = [30, 30, 30, 30],
  slot = 30,
  required = false,
  direction = 'h',
  renderRight,
  bgColor = '#fff'
}) => {
  if (direction === 'h') {
    return (
      <SlotRowView padding={padding} bgColor={bgColor} slot={slot}>
        <Text
          size={labelSize}
          color={labelColor}
          className={className.noshrink}
        >
          {required && (
            <Text size={labelSize} color='#f8584f'>
              *
            </Text>
          )}
          {label}
        </Text>
        {err && (
          <Text
            size={errorSize}
            color={errorColor}
            className={className.noshrink}
          >
            {err}
          </Text>
        )}
        <RowView
          className={className.flex1}
          style={{ height: '100%' }}
          hAlign='right'
        >
          {children}
        </RowView>
        {arrow && (
          <i
            className={className.arrow}
            style={{
              width: p2r(arrowSize),
              height: p2r(arrowSize),
              borderColor: arrowColor
            }}
          />
        )}
        {!arrow && renderRight && renderRight()}
      </SlotRowView>
    )
  }
  return (
    <SlotColumnView padding={padding} bgColor={bgColor} slot={slot}>
      <RowView hAlign='between'>
        <SlotRowView slot={slot}>
          <Text
            size={labelSize}
            color={labelColor}
            className={className.noshrink}
          >
            {required && (
              <Text size={labelSize} color='#f8584f'>
                *
              </Text>
            )}
            {label}
          </Text>
          {err && (
            <Text
              size={errorSize}
              color={errorColor}
              className={className.noshrink}
            >
              {err}
            </Text>
          )}
        </SlotRowView>
        {renderRight && renderRight()}
      </RowView>
      {children}
    </SlotColumnView>
  )
}

export default FormRow
