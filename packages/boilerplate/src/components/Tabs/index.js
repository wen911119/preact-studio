import { h, Component } from 'preact'
import Swiper from '../Swiper'
import px2rem from 'p-to-r'

const renderTabHeaderItem = ({
  title,
  isActive,
  titleColor,
  titleSize,
  activeTitleColor
}) => {
  return (
    <span
      style={{
        fontSize: px2rem(titleSize),
        color: isActive ? activeTitleColor : titleColor
      }}
    >
      {title}
    </span>
  )
}

const TabIndicator = ({
  index,
  indicatorWith = 100,
  indicatorHeight = 6,
  indicatorColor = '#f8584f'
}) => {
  const transformX = 750 / 4 - indicatorWith / 2 + 375 * index
  return (
    <div style={{ display: 'flex' }}>
      <span
        style={{
          display: 'inline-block',
          width: px2rem(indicatorWith),
          height: px2rem(indicatorHeight),
          marginTop: px2rem(-indicatorHeight),
          backgroundColor: indicatorColor,
          transition: '330ms',
          transform: `translate3d(${px2rem(transformX)}, 0px, 0px)`
        }}
      />
    </div>
  )
}

const TabHeader = ({
  titles,
  current,
  onItemClick,
  renderItem,
  titleColor = '#181818',
  titleSize = 28,
  activeTitleColor = '#f8584f',
  headerHeight = 100
}) => {
  const _renderItem = renderItem || renderTabHeaderItem
  return (
    <div
      style={{
        height: px2rem(headerHeight),
        display: 'flex',
        flexDirection: 'row'
      }}
    >
      {titles.map((t, index) => (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          key={index}
          onClick={() => onItemClick && onItemClick(index)}
        >
          {_renderItem({
            title: t,
            isActive: index === current,
            titleColor,
            titleSize,
            activeTitleColor
          })}
        </div>
      ))}
    </div>
  )
}
export default class Tabs extends Component {
  constructor (props) {
    super(props)
    this.onChange = this.onChange.bind(this)
    this.onTabHeaderClick = this.onTabHeaderClick.bind(this)
    this.state = {
      activeIndex: 0
    }
  }
  onChange (index) {
    this.setState({
      activeIndex: index
    })
  }
  onTabHeaderClick (index) {
    this.setState({
      activeIndex: index
    })
  }
  render () {
    const {
      children,
      titles,
      style = {},
      fill,
      indicatorColor,
      indicatorHeight,
      indicatorWidth,
      titleColor,
      titleSize,
      activeTitleColor,
      renderHeaderItem,
      headerHeight
    } = this.props
    const { activeIndex } = this.state
    let _style = {}
    if (fill) {
      _style = {
        display: 'flex',
        flexDirection: 'column',
        flex: 1
      }
    }
    return (
      <div style={Object.assign(_style, style)}>
        <div
          style={{
            boxShadow: `0 ${px2rem(8)} ${px2rem(8)} 0 rgba(0,0,0,0.10)`,
            zIndex: 1
          }}
        >
          <TabHeader
            titles={titles}
            current={activeIndex}
            onItemClick={this.onTabHeaderClick}
            titleColor={titleColor}
            titleSize={titleSize}
            activeTitleColor={activeTitleColor}
            renderItem={renderHeaderItem}
            headerHeight={headerHeight}
          />
          <TabIndicator
            index={activeIndex}
            indicatorColor={indicatorColor}
            indicatorHeight={indicatorHeight}
            indicatorWidth={indicatorWidth}
          />
        </div>
        <Swiper onChange={this.onChange} activeIndex={activeIndex} fill>
          {children}
        </Swiper>
      </div>
    )
  }
}
