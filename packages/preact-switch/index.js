import { h } from 'preact'
import switchStyle from './index.css'
import p2r from 'p-to-r'

const onChangeHandler = originHandler => event =>
  originHandler && originHandler(event.target.checked)

const Switch = ({
  size = 100,
  color = '#07c160',
  className = '',
  style,
  onChange,
  value,
  ...otherProps
}) => (
  <input
    {...otherProps}
    onChange={onChangeHandler(onChange)}
    className={`${switchStyle.switch} ${className}`}
    type="checkbox"
    checked={!!value}
    style={Object.assign(
      { fontSize: p2r(size), backgroundColor: color, caretColor: color },
      style
    )}
  />
)

export default Switch
