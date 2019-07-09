import { h, Component } from 'preact'
import style from './app.css'

export default class TreepickerDemo extends Component {
  state = {
    name: 'wenjun'
  }
  render () {
    return (
      <div>
        TreepickerDemo
        <div className={style.test}>{this.state.name}</div>
      </div>
    )
  }
}
