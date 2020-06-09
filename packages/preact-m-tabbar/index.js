import { h, Component, toChildArray, cloneElement } from 'preact'
import { RowView, SlotColumnView } from '@ruiyun/preact-layout-suite'
import Text from '@ruiyun/preact-text'
import Icon from '@ruiyun/preact-icon'
import Page from '@ruiyun/preact-m-page'
import classNames from './index.css'

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
      padding = [0, 50, 0, 50],
      slot = 5,
      bgColor = '#fff',
      barHeight = 100
    } = this.props
    const childrenArr = toChildArray(children)
    return (
      <Page>
        <Page.Content>
          {childrenArr.map((child, key) => (
            <div
              key={key}
              className={`${key === index ? classNames.show : classNames.hide}`}
            >
              <Item show={key === index}>{child}</Item>
            </div>
          ))}
        </Page.Content>
        <Page.Footer>
          <RowView
            hAlign='between'
            padding={padding}
            bgColor={bgColor}
            height={barHeight}
          >
            {options.map((item, i) => (
              <SlotColumnView
                slot={slot}
                hAlign='center'
                onClick={() => this.onSwitch(i)}
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
        </Page.Footer>
      </Page>
    )
  }
}
