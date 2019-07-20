import { h, Component } from 'preact'
import style from './app.css'

export default class ScrollerDemo extends Component {
  state = {
    name: 'wenjun'
  }
  render () {
    return (
      <div>
        ScrollerDemo
        <div className={style.test}>{this.state.name}</div>
      </div>
    )
  }
}
