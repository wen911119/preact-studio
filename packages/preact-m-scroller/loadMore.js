import { h, Component, createRef } from 'preact'
import { XCenterView } from '@ruiyun/preact-layout-suite'
import Text from '@ruiyun/preact-text'

export class LoadMoreFooterDefault extends Component {
  state = {
    stage: 'loading'
  }

  stageMap = {
    loading: '加载中...',
    nomore: '没有更多了~',
    error: '加载出错，点击重试'
  }

  hide = () => {
    this.setState({
      stage: null
    })
  }

  loading = () => {
    this.setState({
      stage: 'loading'
    })
  }

  nomore = () => {
    this.setState({
      stage: 'nomore'
    })
  }

  error = () => {
    this.setState({
      stage: 'error'
    })
  }

  render() {
    const { stage } = this.state
    const { onReTry } = this.props
    return (
      stage && (
        <XCenterView
          height={80}
          onClick={stage === 'error' ? onReTry : undefined}
        >
          <Text color='#ccc' size={26}>
            {this.stageMap[this.state.stage]}
          </Text>
        </XCenterView>
      )
    )
  }
}

export const WithLoadMore = BaseComponent =>
  class ComponentWithLoadMore extends Component {
    loadMoreRef = createRef()
    baseComponentRef = createRef()
    loading = false
    nomore = false
    error = false

    scrollTo = (position, anmation) => {
      this.baseComponentRef &&
        this.baseComponentRef.current &&
        this.baseComponentRef.current.scrollTo(position, anmation)
    }

    onLoadMore = isReTry => {
      if (
        !this.loading &&
        !this.nomore &&
        !this.error &&
        this.props.onLoadMore
      ) {
        this.loadMoreRef.current.loading()
        this.loading = true
        this.props.onLoadMore(({ nomore, success }) => {
          this.loading = false
          if (success) {
            if (nomore) {
              this.nomore = true
              this.loadMoreRef.current.nomore()
            }
          } else {
            this.error = true
            this.loadMoreRef.current.error()
          }
        }, isReTry)
      }
    }

    onReTry = () => {
      this.error = false
      this.onLoadMore(true)
    }

    renderFooterSlot = () => {
      const LoadMoreFooter = this.props.LoadMoreFooter || LoadMoreFooterDefault
      return <LoadMoreFooter ref={this.loadMoreRef} onReTry={this.onReTry} />
    }

    resetLoadMore = () => {
      this.nomore = false
      this.error = false
      this.loadMoreRef.current.loading()
    }

    onScrollerPositionChange = position => {
      if (position === 0) {
        // scroller内容剧烈改变的时候也应该清除错误
        this.error = false
        this.loadMoreRef.current.hide()
      } else {
        if (this.error) {
          this.loadMoreRef.current.error()
        } else if (this.nomore) {
          this.loadMoreRef.current.nomore()
        } else {
          this.loadMoreRef.current.loading()
        }
      }
    }

    render() {
      return (
        <BaseComponent
          {...this.props}
          ref={this.baseComponentRef}
          resetLoadMore={this.resetLoadMore}
          onScrollerPositionChange={this.onScrollerPositionChange}
          footerSlot={this.renderFooterSlot}
          onWillBottom={this.onLoadMore}
        />
      )
    }
  }
