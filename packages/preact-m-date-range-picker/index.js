import { h, Component, Fragment, cloneElement } from 'preact'
import { useCallback, useState } from 'preact/hooks'
import { TextButton } from '@ruiyun/preact-button'
import px2rem from 'p-to-r'
import { WithModal } from '@ruiyun/preact-modal'

import {
  XCenterView,
  ColumnView,
  RowView,
  SlotRowView
} from '@ruiyun/preact-layout-suite'
import Text from '@ruiyun/preact-text'

import classNames from './index.css'

const dateParser = dateStr => {
  const arr = dateStr.split('/')
  return {
    year: parseInt(arr[0], 10),
    month: parseInt(arr[1], 10),
    day: parseInt(arr[2], 10)
  }
}

const dateFormator = dateObj => {
  const month = dateObj.month > 9 ? dateObj.month : '0' + dateObj.month
  const day = dateObj.day > 9 ? dateObj.day : '0' + dateObj.day
  return `${dateObj.year}/${month}/${day}`
}

// 计算出某年某月有多少天
const getDays = (year, month) => {
  const days = []
  const date = new Date(year, month, 1, 0, 0, 0)
  const yesterDay = new Date(date - 1000)
  const maxDay = yesterDay.getDate()
  for (let d = 1; d <= maxDay; d++) {
    days.push(d)
  }
  return days
}

const withWeekOffset = (days, year, month) => {
  const offset = new Date(`${year}/${month}/1`).getDay()
  const offsetEmptyArray = [...new Array(offset)]
  const arr = offsetEmptyArray.concat(days)
  while (arr.length < 36) {
    arr.push('')
  }
  return arr
}

const DaysPannel = ({
  year,
  month,
  min,
  max,
  start,
  end,
  onChange,
  onError,
  single
}) => {
  const days = withWeekOffset(getDays(year, month), year, month)
  let minLimit = 0
  let maxLimit = 999
  let minObj = min

  if (single) {
    if (minObj.year === year && minObj.month === month) {
      minLimit = minObj.day
    }
    if (max.year === year && max.month === month) {
      maxLimit = max.day
    }
  } else {
    if (start && !end) {
      minObj = start
    }
    if (minObj.year === year && minObj.month === month) {
      minLimit = minObj.day
    }
    if (minObj.year > year || (minObj.year === year && minObj.month > month)) {
      minLimit = 999
    }
    if (max.year === year && max.month === month) {
      maxLimit = max.day
    }
  }
  const onSelectedHandler = useCallback(
    ([error, d]) => {
      if (error) {
        onError(error)
      } else {
        d && onChange(d)
      }
    },
    [onError, onChange]
  )
  return (
    <Fragment>
      <RowView className={classNames.days}>
        {days.map((d, index) => {
          const error =
            d > maxLimit
              ? `不能晚于${year}年${month}月${maxLimit}日`
              : d < minLimit
              ? `不能早于${year}年${month}月${minLimit}日`
              : undefined
          let status = 'normal'
          if (error) {
            status = 'disable'
          } else if (
            start &&
            start.year === year &&
            start.month === month &&
            start.day === d
          ) {
            status = 'start'
          } else if (
            end &&
            end.year === year &&
            end.month === month &&
            end.day === d
          ) {
            status = 'end'
          } else if (start && end && d) {
            const startDateTs = new Date(dateFormator(start)).getTime()
            const endDateTs = new Date(dateFormator(end)).getTime()
            const currentTs = new Date(
              dateFormator({
                year,
                month,
                day: d
              })
            ).getTime()
            if (currentTs > startDateTs && currentTs < endDateTs) {
              status = 'between'
            }
          }
          return (
            <XCenterView
              key={d + index}
              width={98}
              height={80}
              className={classNames[status]}
              // eslint-disable-next-line
              onClick={() => onSelectedHandler([error, d])}
            >
              <Text size={28} color='#333'>
                {d}
              </Text>
            </XCenterView>
          )
        })}
      </RowView>
    </Fragment>
  )
}

const Week = ({ weekSize = 26, weekColor = '#00000061' }) => (
  <RowView hAlign='around' width={690}>
    {['日', '一', '二', '三', '四', '五', '六'].map(item => (
      <Text key={item} size={weekSize} color={weekColor}>
        {item}
      </Text>
    ))}
  </RowView>
)

const Cursor = ({ year, month, onChange, min, max }) => {
  const [target, updateTarget] = useState('month')
  const onSubtract = useCallback(() => {
    const minMonthsNum = min.year * 12 + min.month
    let nextMonthsNum = year * 12 + month
    if (target === 'month') {
      nextMonthsNum -= 1
    } else if (target === 'year') {
      nextMonthsNum -= 12
    }
    if (nextMonthsNum >= minMonthsNum) {
      const month = nextMonthsNum % 12 || 12
      const year = Math.floor(nextMonthsNum / 12)
      onChange({
        year: month === 12 ? year - 1 : year,
        month
      })
    }
  }, [month, year, min, onChange, target])
  const onAdd = useCallback(() => {
    const maxMonthsNum = max.year * 12 + max.month
    let nextMonthsNum = year * 12 + month
    if (target === 'month') {
      nextMonthsNum += 1
    } else if (target === 'year') {
      nextMonthsNum += 12
    }
    if (nextMonthsNum <= maxMonthsNum) {
      const month = nextMonthsNum % 12 || 12
      const year = Math.floor(nextMonthsNum / 12)
      onChange({
        year: month === 12 ? year - 1 : year,
        month
      })
    }
  }, [month, year, max, onChange, target])
  const isNoMore =
    target === 'year'
      ? year === max.year || year * 12 + month + 12 > max.year * 12 + max.month
      : year === max.year && month === max.month
  const isNoLess =
    target === 'year'
      ? year === min.year || year * 12 + month - 12 < min.year * 12 + min.month
      : year === min.year && month === min.month
  return (
    <RowView hAlign='around' width='100%' height={100}>
      <XCenterView
        height={70}
        width={70}
        onClick={onSubtract}
        className={classNames.arrowWrap}
      >
        <i
          className={`${classNames.arrow} ${classNames.arrowLeft}`}
          style={{ borderColor: isNoLess ? '#ccc' : '#007DFF' }}
        />
      </XCenterView>
      <SlotRowView slot={15} width={250} hAlign='center'>
        <Text
          size={target === 'year' ? 36 : 30}
          color={target === 'year' ? '#007DFF' : '#919191'}
          // eslint-disable-next-line
          onClick={() => updateTarget('year')}
        >
          {`${year}年`}
        </Text>
        <Text
          size={target === 'month' ? 36 : 30}
          color={target === 'month' ? '#007DFF' : '#919191'}
          // eslint-disable-next-line
          onClick={() => updateTarget('month')}
        >
          {`${month}月`}
        </Text>
      </SlotRowView>
      <XCenterView
        height={70}
        width={70}
        onClick={onAdd}
        className={classNames.arrowWrap}
      >
        <i
          className={`${classNames.arrow} ${classNames.arrowRight}`}
          style={{ borderColor: isNoMore ? '#ccc' : '#007DFF' }}
        />
      </XCenterView>
    </RowView>
  )
}

const Title = ({ titleSize = 30, children, onConfirm, onCancel }) => (
  <RowView
    height={80}
    hAlign='between'
    padding={[0, 30, 0, 30]}
    style={{ boxShadow: `0 ${px2rem(6)} ${px2rem(6)} 0 rgba(0,0,0,0.10)` }}
  >
    <TextButton textColor='#919191' textSize={28} onClick={onCancel}>
      取消
    </TextButton>
    <Text color='#333' size={titleSize}>
      {children}
    </Text>
    <TextButton textColor='#007DFF' textSize={28} onClick={onConfirm}>
      确定
    </TextButton>
  </RowView>
)

export class DateRangePickerContent extends Component {
  onCurSorChange = newCursor => {
    this.setState({
      cursor: newCursor
    })
  }

  onDaySelect = d => {
    const { start, end, cursor } = this.state
    const { single } = this.props
    if (single) {
      const value = Object.assign(
        {
          day: d
        },
        cursor
      )
      this.setState({
        start: value,
        end: undefined,
        tip: dateFormator(value),
        error: ''
      })
      return
    }
    if (start && end) {
      // 重新选择start
      this.setState({
        start: Object.assign(
          {
            day: d
          },
          cursor
        ),
        end: undefined,
        tip: '请选择结束日期',
        error: ''
      })
    } else if (start) {
      const newEnd = Object.assign(
        {
          day: d
        },
        cursor
      )
      this.setState({
        error: '',
        end: newEnd,
        tip: `${dateFormator(start)} - ${dateFormator(newEnd)}`
      })
    } else {
      this.setState({
        start: Object.assign(
          {
            day: d
          },
          cursor
        ),
        tip: '请选择结束日期',
        error: ''
      })
    }
  }

  onError = error => {
    this.setState({
      error
    })
  }

  onConfirm = () => {
    const { start, end } = this.state
    const { cb, close, single } = this.props
    if (single && start) {
      cb(dateFormator(start))
      close()
      return
    }
    if (start && end && cb) {
      cb(dateFormator(start), dateFormator(end))
      close()
    }
  }

  constructor(props) {
    super(props)
    let cursor = props.cursor
    if (!cursor && props.start) {
      cursor = dateParser(props.start)
      delete cursor.day
    }
    if (!cursor) {
      const now = new Date()
      cursor = {
        year: now.getFullYear(),
        month: now.getMonth() + 1
      }
    }
    this.state = {
      start: props.start && dateParser(props.start),
      end: props.end && dateParser(props.end),
      min: dateParser(props.min || '1970/01/01'),
      max: dateParser(props.max || '2099/01/01'),
      tip: '请选择开始日期',
      cursor,
      error: ''
    }
  }

  render() {
    const { min, max, start, end, cursor, tip } = this.state
    return (
      <ColumnView bgColor='#fff'>
        <Title onCancel={this.props.close} onConfirm={this.onConfirm}>
          {tip}
        </Title>
        <ColumnView padding={[0, 30, 30, 30]}>
          <Cursor
            year={cursor.year}
            month={cursor.month}
            min={min}
            max={max}
            onChange={this.onCurSorChange}
            onError={this.onError}
          />
          <Week />
          <DaysPannel
            year={cursor.year}
            month={cursor.month}
            min={min}
            max={max}
            start={start}
            end={end}
            single={this.props.single}
            onChange={this.onDaySelect}
            onError={this.onError}
          />
        </ColumnView>
      </ColumnView>
    )
  }
}

@WithModal
export class DateRangePicker extends Component {
  show = ({ start, end, cb, min, max, single }) => {
    this.props.$modal.show({
      content: () => (
        <DateRangePickerContent
          start={start}
          end={end}
          cb={cb}
          min={min}
          max={max}
          single={single}
          close={this.props.$modal.hide}
        />
      ),
      position: 'bottom'
    })
  }

  render({ children }) {
    return cloneElement(children, {
      $dateRangePicker: {
        show: this.show,
        hide: this.props.$modal.hide
      }
    })
  }
}

export const WithDateRangePicker = BaseComponent => {
  class ComponentWithDateRangePicker extends Component {
    render() {
      return (
        <DateRangePicker>
          <BaseComponent {...this.props} />
        </DateRangePicker>
      )
    }
  }
  return ComponentWithDateRangePicker
}
