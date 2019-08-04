import { h, Component } from 'preact'
import Swiper from '@ruiyun/preact-m-swiper'
import px2rem from 'p-to-r'
import Text from '@ruiyun/preact-text'
import { RowView, XCenterView } from '@ruiyun/preact-layout-suite'
import className from './index.css'

let BODY_WIDTH = 750
// eslint-disable-next-line
if (typeof $P_2_R_BASE$ !== 'undefined' && $P_2_R_BASE$ !== 'undefined') {
  // eslint-disable-next-line
  BODY_WIDTH = parseInt($P_2_R_BASE$)
}

const renderTabHeaderItem = ({
  title,
  isActive,
  titleColor,
  titleSize,
  activeTitleColor
}) => (
  <Text color={isActive ? activeTitleColor : titleColor} size={titleSize}>
    {title}
  </Text>
)

const TabIndicator = ({
  index,
  indicatorWith = 100,
  indicatorHeight = 6,
  indicatorColor = '#f8584f',
  childNum = 2
}) => {
  const transformX =
    (BODY_WIDTH / childNum) * index +
    BODY_WIDTH / childNum / 2 -
    indicatorWith / 2
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
    <RowView height={headerHeight}>
      {titles.map((t, index) => (
        <XCenterView
          className={className.flex1}
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
        </XCenterView>
      ))}
    </RowView>
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

    return (
      <div style={style} className={fill && className.filltab}>
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
            childNum={titles.length}
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
