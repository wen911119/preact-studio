import { h } from 'preact'

const Line = ({ color = '#eaeaea' }) => (
  <div className="border-t-1" style={{ borderTopStyle: 'solid', borderTopColor: color }} />
)

export default Line
