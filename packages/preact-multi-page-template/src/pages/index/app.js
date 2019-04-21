import { h, Component } from 'preact'
import WithNav from '@ruiyun/preact-m-nav'
import './app.css'

@WithNav
export default class Index extends Component {
  state = {
    name: 'wenjun1991'
  }
  goto = () => {
    this.props.$nav.push('list')
  }
  render () {
    return (
      <div>
        Index
        <div className='test'>{this.state.name}</div>
        <div onClick={this.goto}>go to list</div>
      </div>
    )
  }
}
