import { h, Component } from 'preact'
import './app.css'

export default class Index extends Component {
  state = {
    name: 'wenjun'
  }
  render () {
    return (
      <div>
        Index
        <div className='test'>{this.state.name}</div>
      </div>
    )
  }
}
