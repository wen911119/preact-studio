import { h, Component } from 'preact'
import WithNav from '@ruiyun/preact-m-nav'
import './app.css'

@WithNav
export default class List extends Component {
  state = {
    name: 'wenjun'
  }
  back = () => {
    this.props.$nav.pop()
  }
  render () {
    return (
      <div>
        List
        <div className='test'>{this.state.name}</div>
        <div onClick={this.back}>back</div>
      </div>
    )
  }
}
