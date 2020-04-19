import { h, Component, createRef } from 'preact'
import { RowView } from '@ruiyun/preact-layout-suite'
import Loading from '@ruiyun/preact-loading'

import classNames from './refreshController.css'

class RefreshHeader extends Component {
  state = {
    distance: 0,
    animation: 'none'
  }

  pull = distance => {
    this.setState({
      distance,
      animation: 'none'
    })
  }

  reset = () => {
    const { refreshHeaderHeight = 50 } = this.props
    const { distance } = this.state
    this.setState({
      distance: 0,
      animation: (distance / refreshHeaderHeight) * 330 + 'ms'
    })
  }

  hold = () => {
    const { refreshHeaderHeight = 50 } = this.props
    this.setState({
      distance: refreshHeaderHeight,
      animation: 'margin-top 330ms'
    })
  }

  active = () => {
    window.navigator.vibrate && window.navigator.vibrate(20)
  }

  render() {
    const { refreshHeaderHeight = 50 } = this.props
    const { distance, animation } = this.state
    const percent = (distance / refreshHeaderHeight) * 100
    return (
      <RowView
        height={refreshHeaderHeight + 'px'}
        hAlign='center'
        style={{
          transition: animation,
          marginTop: `${distance - refreshHeaderHeight}px`
        }}
      >
        {percent === 100 && animation !== 'none' ? (
          <Loading />
        ) : (
          <css-icon
            className={classNames['icon-downward']}
            style={{
              transform: percent >= 100 ? `rotate(180deg)` : `rotate(0deg)`
            }}
          />
        )}
      </RowView>
    )
  }
}

export const WithRefreshController = BaseComponent =>
  class ComponentWithRefreshController extends Component {
    refreshHeaderRef = createRef()
    baseComponentRef = createRef()
    stage = 0

    RefreshHeader = this.props.RefreshHeader || RefreshHeader

    scrollTo = (position, anmation) => {
      this.baseComponentRef &&
        this.baseComponentRef.current &&
        this.baseComponentRef.current.scrollTo(position, anmation)
    }

    onPullDown = distance => {
      if (this.stage !== 3) {
        const { refreshDamping = 2.5, refreshHeaderHeight = 50 } = this.props
        if (distance > refreshHeaderHeight * refreshDamping) {
          if (this.stage === 1) {
            this.refreshHeaderRef.current.active()
          }
          this.stage = 2
        } else {
          this.stage = 1
        }
        this.refreshHeaderRef.current.pull(distance / refreshDamping)
      }
    }

    onPullDownEnd = () => {
      if (this.stage === 1 || !this.props.onRefresh) {
        this.refreshHeaderRef.current.reset()
        this.stage = 0
      } else if (this.stage === 2) {
        this.stage = 3
        this.refreshHeaderRef.current.hold()
        this.props.onRefresh(() => {
          this.stage = 0
          this.refreshHeaderRef.current.reset()
          this.props.resetLoadMore && this.props.resetLoadMore()
        })
      }
    }

    render() {
      const { refreshHeaderHeight, ...otherProps } = this.props
      return (
        <div className={classNames.refreshController}>
          <this.RefreshHeader
            ref={this.refreshHeaderRef}
            refreshHeaderHeight={refreshHeaderHeight}
          />
          <BaseComponent
            {...otherProps}
            ref={this.baseComponentRef}
            onPullDown={this.onPullDown}
            onPullDownEnd={this.onPullDownEnd}
          />
        </div>
      )
    }
  }
