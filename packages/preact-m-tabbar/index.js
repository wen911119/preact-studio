import { h, Component, toChildArray, cloneElement } from 'preact'
import {
  ColumnView,
  RowView,
  SlotColumnView
} from '@ruiyun/preact-layout-suite'
import Text from '@ruiyun/preact-text'
import Icon from '@ruiyun/preact-icon'
import className from './index.css'

class Item extends Component {
  shouldComponentUpdate(nextProps) {
    if (this.show) {
      // 对于已经render出来的item
      // 择机调用它们的tabOnShow和tabOnHide钩子
      const { onTabShow, onTabHide } = this.itemRef || {}
      let handler
      if (nextProps.show) {
        handler = onTabShow
      } else if (this.props.show) {
        handler = onTabHide
      }
      if (handler) {
        setTimeout(handler, 0)
      }
    }
    // 切换已经出现的tab不需要重新rerender子元素
    // 只有首次加载才需要render
    return nextProps.show && !this.show
  }

  render() {
    const { children, show } = this.props
    if (show) {
      this.show = show
    }
    return this.show
      ? cloneElement(children, {
          ref: s => {
            this.itemRef = s
          }
        })
      : undefined
  }
}

export default class Tabbar extends Component {
  state = {
    index: 0
  }

  onSwitch = index => {
    this.setState({
      index
    })
  }

  render() {
    const { index } = this.state
    const {
      children,
      config: { options, color, activeColor, textSize, iconSize },
      padding = [10, 50, 0, 50],
      slot = 5,
      bgColor = '#fff'
    } = this.props
    const childrenArr = toChildArray(children)
    return (
      <ColumnView height='100%'>
        {childrenArr.map((child, key) => (
          <div
            key={key}
            className={`${className.item} ${
              key === index ? className.show : className.hide
            }`}
          >
            <Item show={key === index}>{child}</Item>
          </div>
        ))}
        <RowView
          hAlign='between'
          padding={padding}
          className={className.noShrink}
          style={{ boxShadow: '0px -5px 5px -5px rgba(0,0,0,.1)' }}
          bgColor={bgColor}
        >
          {options.map((item, i) => (
            <SlotColumnView
              slot={slot}
              hAlign='center'
              // eslint-disable-next-line
              onClick={this.onSwitch.bind(this, i)}
              key={item.text}
            >
              <Icon
                name={item.icon}
                size={iconSize}
                color={index === i ? activeColor : color}
              />
              <Text size={textSize} color={index === i ? activeColor : color}>
                {item.text}
              </Text>
            </SlotColumnView>
          ))}
        </RowView>
      </ColumnView>
    )
  }
}
