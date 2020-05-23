import { h, Component } from 'preact'
import { DefaultLoadMoreFooter } from './default'

const WithLoadMore = ChildComponent =>
  class ComponentWithLoadMore extends Component {
    loading = false
    nomore = false
    error = false

    state = {
      stage: 'hide'
    }

    scrollTo = position => {
      this.child.scrollTo(position)
    }

    onLoadMore = isRetry => {
      if (
        !this.loading &&
        !this.nomore &&
        (!this.error || isRetry) &&
        this.props.onLoadMore
      ) {
        this.loading = true
        this.nomore = false
        this.error = false
        this.updateStage()
        this.props.onLoadMore(({ nomore, success }) => {
          this.loading = false
          if (success) {
            if (nomore) {
              this.nomore = true
            }
          } else {
            this.error = true
          }
          this.updateStage()
        }, isRetry)
      }
    }

    onRetry = () => {
      this.onLoadMore(true)
    }

    resetLoadMore = () => {
      this.nomore = false
      this.error = false
    }

    updateStage = position => {
      let newStage
      if (position === 0) {
        newStage = 'hide'
      } else {
        newStage = 'show'
        if (this.error) {
          newStage = 'error'
        }
        if (this.nomore) {
          newStage = 'nomore'
        }
        if (this.loading) {
          newStage = 'loading'
        }
      }
      newStage !== this.state.stage &&
        this.setState({
          stage: newStage
        })
    }

    onScrollerPositionChange = position => {
      this.updateStage(position)
    }

    render() {
      const {
        children,
        LoadMoreFooter = DefaultLoadMoreFooter,
        ...otherProps
      } = this.props
      return (
        <ChildComponent
          {...otherProps}
          ref={s => (this.child = s)}
          resetLoadMore={this.resetLoadMore}
          onScrollerPositionChange={this.onScrollerPositionChange}
          onWillBottom={this.onLoadMore}
          onBottom={this.onLoadMore}
        >
          {children}
          <LoadMoreFooter stage={this.state.stage} onRetry={this.onRetry} />
        </ChildComponent>
      )
    }
  }

export default WithLoadMore
