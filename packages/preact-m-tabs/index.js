import { h, Component } from 'preact'
import Swiper from '@ruiyun/preact-m-swiper'
import px2rem from 'p-to-r'
import className from './index.css'

const renderTabHeaderItem = ({
  title,
  isActive,
  titleColor,
  titleSize,
  activeTitleColor
}) => (
  <span
    style={{
      fontSize: px2rem(titleSize),
      color: isActive ? activeTitleColor : titleColor
    }}
  >
    {title}
  </span>
)

const TabIndicator = ({
  index,
  indicatorWith = 100,
  indicatorHeight = 6,
  indicatorColor = '#f8584f'
}) => {
  const transformX = 750 / 4 - indicatorWith / 2 + 375 * index
  return (
    <div className={className.tabindicator}>
      <span
        style={{
          width: px2rem(indicatorWith),
          height: px2rem(indicatorHeight),
          marginTop: px2rem(-indicatorHeight),
          backgroundColor: indicatorColor,
          transform: `translate3d(${px2rem(transformX)}, 0px, 0px)`,
          '-webkit-transform': `translate3d(${px2rem(transformX)}, 0px, 0px)`
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
          // eslint-disable-next-line
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
  onChange (index) {
    this.setState(
      {
        activeIndex: index
      },
      () => {
        if (this.props.onChange) {
          this.props.onChange(index)
        }
      }
    )
  }
  constructor (props) {
    super(props)
    this.onChange = this.onChange.bind(this)
    this.state = {
      activeIndex: 0
    }
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
      headerHeight,
      freezingOnSwiping
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
            onItemClick={this.onChange}
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
        <Swiper
          onChange={this.onChange}
          activeIndex={activeIndex}
          fill
          freezingOnSwiping={freezingOnSwiping}
        >
          {children}
        </Swiper>
      </div>
    )
  }
}
