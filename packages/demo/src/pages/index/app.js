import { h, Component } from 'preact'
import WithNav from '@ruiyun/preact-m-nav'
import './app.css'

@WithNav
export default class Index extends Component {
  state = {
    name: 'wenjun1991'
  }
  goto = () => {
    this.props.$nav.push('buttonDemo')
  }

  goto2 = () => {
    this.props.$nav.push('actionsheetDemo')
  }

  goto3 = () => {
    this.props.$nav.push('dialogDemo')
  }
  render () {
    return (
      <div>
        Index
        <div className='test'>{this.state.name}</div>
        <div onClick={this.goto}>go to buttonDemo</div>
        <div onClick={this.goto2}>go to actionsheetDemo</div>
        <div onClick={this.goto3}>go to dialogDemo</div>
      </div>
    )
  }
}
