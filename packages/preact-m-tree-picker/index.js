import { h, Component, cloneElement } from 'preact'
import { WithModal } from '@ruiyun/preact-modal'
import { RowView } from '@ruiyun/preact-layout-suite'
import Text from '@ruiyun/preact-text'
import Scroller from '@ruiyun/preact-m-scroller'
import Tabs from '@ruiyun/preact-m-tabs'
import Line from '@ruiyun/preact-line'
import p2r from 'p-to-r'
import className from './index.css'

class PickerContent extends Component {
  onCancel = () => {
    this.props.cb && this.props.cb()
  }
  onSelect = async item => {
    const children = await this.props.getChildren(item)
    if (children && children.length) {
      const { tabItems, value, activeIndex } = this.state
      if (tabItems.length - 1 === activeIndex) {
        this.setState({
          tabItems: tabItems.concat([children]),
          value: value.concat(item),
          activeIndex: activeIndex + 1
        })
      }
      else {
        this.setState({
          tabItems: tabItems.slice(0, activeIndex + 1).concat([children]),
          value: value.slice(0, activeIndex).concat(item),
          activeIndex: activeIndex + 1
        })
      }
    }
    else {
      this.props.cb && this.props.cb(this.state.value.concat([item]))
    }
  }
  onTabChange = index => {
    this.setState({
      activeIndex: index
    })
  }
  constructor (props) {
    super(props)
    this.state = {
      tabItems: [],
      value: props.value || [],
      activeIndex: props.value ? props.value.length - 1 : 0
    }
  }
  async componentWillMount () {
    const { value, getChildren } = this.props
    let tabItems
    if (value) {
      tabItems = await Promise.all(
        value.map(async (item, index) => {
          const children = await getChildren(value[index - 1])
          return children
        })
      )
    }
    else {
      const children = await getChildren()
      tabItems = [children]
    }
    this.setState({
      tabItems,
      value: value || []
    })
  }
  render () {
    const {
      title,
      getLabel,
      config: {
        titleSize,
        titleColor,
        cancelSize,
        cancelColor,
        itemSize,
        itemColor,
        itemHeight,
        selectedColor,
        headerHeight,
        indicatorHeight,
        indicatorWidth,
        indicatorColor,
        arrowSize,
        arrowColor
      }
    } = this.props
    const { tabItems, value, activeIndex } = this.state
    let titles = value.map(getLabel)
    if (value.length < tabItems.length) {
      titles.push('请选择')
    }
    return (
      <div
        style={{
          backgroundColor: '#fff',
          width: '100vw',
          borderRadius: '0.4rem 0.4rem 0 0'
        }}
      >
        <RowView hAlign="between" height={80} padding={[0, 30, 0, 30]}>
          <Text size={titleSize} color={titleColor}>
            {title}
          </Text>

          <Text size={cancelSize} color={cancelColor} onClick={this.onCancel}>
            &#4030;
          </Text>
        </RowView>
        <Tabs
          activeIndex={activeIndex}
          titles={titles}
          headerHeight={headerHeight}
          onChange={this.onTabChange}
          indicatorHeight={indicatorHeight}
          indicatorWidth={indicatorWidth}
          indicatorColor={indicatorColor}
          shadow={false}
        >
          {tabItems.map(tabItem => (
            <Scroller height={p2r(440)}>
              <Line />
              {tabItem.map(child => {
                const label = getLabel(child)
                const isSelected = value.map(getLabel).indexOf(label) > -1
                return (
                  <div key={label}>
                    <RowView
                      height={itemHeight}
                      padding={[0, 30, 0, 30]}
                      hAlign="between"
                      className={className.shadow}
                      // eslint-disable-next-line
                      onClick={this.onSelect.bind(this, child)}
                    >
                      <Text
                        color={isSelected ? selectedColor : itemColor}
                        size={itemSize}
                      >
                        {label}
                      </Text>
                      <i
                        className={className.arrow}
                        style={{
                          width: p2r(arrowSize),
                          height: p2r(arrowSize),
                          borderColor: arrowColor
                        }}
                      />
                    </RowView>
                    <Line />
                  </div>
                )
              })}
            </Scroller>
          ))}
        </Tabs>
      </div>
    )
  }
}

// eslint-disable-next-line
const renderModalContent = props => () => <PickerContent {...props} />

@WithModal
export class TreePicker extends Component {
  treepicker ({ title = '请选择', getChildren, getLabel, config, value }) {
    const styleConfig = Object.assign(
      {
        titleSize: 36,
        titleColor: '#999',
        cancelSize: 53,
        cancelColor: '#ccc',
        confirmSize: 28,
        confirmColor: '#0078FE',
        itemSize: 28,
        itemColor: '#919191',
        itemHeight: 80,
        selectedColor: '#f85f4f',
        headerHeight: 80,
        indicatorColor: '#f8584f',
        indicatorHeight: 3,
        indicatorWidth: 60,
        arrowSize: 20,
        arrowColor: '#b2b2b2'
      },
      config
    )
    return new Promise((resolve, reject) => {
      const cb = value => {
        this.props.$modal.hide()
        if (value) {
          resolve(value)
        }
      }
      const c = renderModalContent({
        title,
        getChildren,
        cb,
        config: styleConfig,
        getLabel,
        value
      })
      this.props.$modal.show({
        content: c,
        position: 'bottom',
        allowContentTouchMove: true
      })
    })
  }
  constructor (props) {
    super(props)
    this.treepicker = this.treepicker.bind(this)
  }
  render ({ children }) {
    return cloneElement(children, {
      $treepicker: this.treepicker
    })
  }
}

export const WithTreePicker = BaseComponent => {
  class ComponentWithPicker extends Component {
    render () {
      return (
        <TreePicker>
          <BaseComponent {...this.props} />
        </TreePicker>
      )
    }
  }
  return ComponentWithPicker
}
