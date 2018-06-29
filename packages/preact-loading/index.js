import { h, Component } from 'preact'
import px2rem from 'p-to-r'

const styleEl = document.createElement('style')
styleEl.innerHTML = `@keyframes _preact_spinner_{0%{opacity:1}100%{opacity:0}}._preact_spinner_{position:relative}._preact_spinner_ div{left:0.44em;top:0;position:absolute;animation:_preact_spinner_ linear .6s infinite;width:0.1em;height:0.3em;border-radius:30%;transform-origin:.05em .5em}._preact_spinner_ div:nth-child(1){transform:rotate(0deg);animation-delay:-0.55s}._preact_spinner_ div:nth-child(2){transform:rotate(30deg);animation-delay:-0.5s}._preact_spinner_ div:nth-child(3){transform:rotate(60deg);animation-delay:-0.45s}._preact_spinner_ div:nth-child(4){transform:rotate(90deg);animation-delay:-0.4s}._preact_spinner_ div:nth-child(5){transform:rotate(120deg);animation-delay:-0.35s}._preact_spinner_ div:nth-child(6){transform:rotate(150deg);animation-delay:-0.3s}._preact_spinner_ div:nth-child(7){transform:rotate(180deg);animation-delay:-0.25s}._preact_spinner_ div:nth-child(8){transform:rotate(210deg);animation-delay:-0.2s}._preact_spinner_ div:nth-child(9){transform:rotate(240deg);animation-delay:-0.15s}._preact_spinner_ div:nth-child(10){transform:rotate(270deg);animation-delay:-0.1s}._preact_spinner_ div:nth-child(11){transform:rotate(300deg);animation-delay:-0.05s}._preact_spinner_ div:nth-child(12){transform:rotate(330deg);animation-delay:0s}`
document.head.appendChild(styleEl)
export default class Loading extends Component {
  shouldComponentUpdate (nextProps, nextState) {
    return false
  }
  render ({ size = 40, color = '#ccc' }) {
    const _size = px2rem(size)
    return (
      <div
        class="_preact_spinner_"
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
