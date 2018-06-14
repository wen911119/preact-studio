import { h } from 'preact'

const Line = ({ color = '#eaeaea' }) => (
  <hr style={{ border: 0, backgroundColor: color, height: '1px', margin: 0 }} />
)

export default Line
