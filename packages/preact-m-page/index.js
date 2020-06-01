import { h, Component } from 'preact'
import { ColumnView } from '@ruiyun/preact-layout-suite'
import { ScrollerWithPreventBounce } from '@ruiyun/preact-m-scroller'
import classNames from './index.css'

const preventTouchMove = event => event.preventDefault()

export default class Page extends Component {
  static Header = ({ children, shadow = true, touchmove }) => (
    <div
      className={shadow && classNames.shadowBottom}
      onTouchMove={touchmove || preventTouchMove}
    >
      {children}
    </div>
  )

  static Footer = ({ children, shadow = true, touchmove }) => {
    const classArr = [classNames.safeBottom]
    if (shadow) {
      classArr.push(classNames.shadowTop)
    }
    return (
      <div
        className={classArr.join(' ')}
        onTouchMove={touchmove || preventTouchMove}
      >
        {children}
      </div>
    )
  }

  static Content = ({ children, degree }) => (
    <ScrollerWithPreventBounce height='flex1' degree={degree}>
      {children}
    </ScrollerWithPreventBounce>
  )

  render() {
    return <ColumnView height='100%'>{this.props.children}</ColumnView>
  }
}
