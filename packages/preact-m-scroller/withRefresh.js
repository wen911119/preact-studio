import { h, Component } from 'preact'
import { DefaultRefreshHeader } from './default'

const WithRefresh = ChildComponent =>
  class ComponentWithRefreshController extends Component {
    state = {
      stage: 1,
      distance: 0
    }

    scrollTo = position => {
      this.child.scrollTo(position)
    }

    onPullDown = distance => {
      if (this.state.stage !== 3) {
        const { refreshDamping = 2.5, refreshHeaderHeight = 50 } = this.props
        this.setState({
          distance: distance / refreshDamping,
          stage: distance > refreshHeaderHeight * refreshDamping ? 2 : 1
        })
      }
    }

    onPullDownEnd = distance => {
      const { refreshHeaderHeight = 50, refreshDamping = 2.5 } = this.props
      const achieved = distance > refreshHeaderHeight * refreshDamping
      this.setState({
        distance: achieved ? refreshHeaderHeight : 0,
        stage: achieved ? 3 : 4
      })
      if (achieved) {
        this.props.onRefresh(() => {
          this.setState({
            distance: 0,
            stage: 4
          })
        })
      }
    }

    render() {
      const {
        children,
        RefreshHeader = DefaultRefreshHeader,
        refreshHeaderHeight = 50,
        ...otherProps
      } = this.props
      const { stage, distance } = this.state
      return (
        <ChildComponent
          {...otherProps}
          ref={s => (this.child = s)}
          onPullDown={this.onPullDown}
          onPullDownEnd={this.onPullDownEnd}
        >
          <RefreshHeader
            stage={stage}
            distance={distance}
            refreshHeaderHeight={refreshHeaderHeight}
          />
          {children}
        </ChildComponent>
      )
    }
  }

export default WithRefresh
