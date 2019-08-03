import { h, Component } from 'preact'
import px2rem from 'p-to-r'
import className from './index.css'

export default class Loading extends Component {
  shouldComponentUpdate (nextProps, nextState) {
    return false
  }
  render ({ size = 40, color = '#ccc' }) {
    const _size = px2rem(size)
    return (
      <div
        class={className._preact_spinner_}
        style={{ width: _size, height: _size, fontSize: _size }}
      >
        <div style={{ background: color }} />
        <div style={{ background: color }} />
        <div style={{ background: color }} />
        <div style={{ background: color }} />
        <div style={{ background: color }} />
        <div style={{ background: color }} />
        <div style={{ background: color }} />
        <div style={{ background: color }} />
        <div style={{ background: color }} />
        <div style={{ background: color }} />
        <div style={{ background: color }} />
        <div style={{ background: color }} />
      </div>
    )
  }
}
