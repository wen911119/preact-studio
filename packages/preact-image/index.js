import { h, Component } from 'preact'
import { XCenterView } from '@ruiyun/preact-layout-suite'
// 有三种模式
// 默认 strict模式,图片大小和所设宽高一致，图片可能有拉伸缩
// fit模式, 用图片宽高的较大者来适配所设宽高，这种模式下图片不会变形并且显示完全，只是可能有较多缩放，看不清楚。
// fill模式, 用图片宽高的较小者来适配所设宽高，然后居中显示。这种模式不会缩放但是显示区域较小。

export default class Image extends Component {
  state = {
    imageStyleWidth: '100%',
    imageStyleHeight: '100%'
  }
  imgOnLoad = e => {
    if (
      (this.props.mode === 'fit' || this.props.mode === 'fill') &&
      !this.adjusted
    ) {
      this.adjustImageStyle(e.target)
    }
  }
  adjustImageStyle = target => {
    const { clientWidth, clientHeight, naturalWidth, naturalHeight } = target
    if (naturalWidth && naturalHeight) {
      let newStyleObj = {}
      if (clientHeight / clientWidth >= naturalHeight / naturalWidth) {
        newStyleObj.imageStyleHeight = 'auto'
      }
      else {
        newStyleObj.imageStyleWidth = 'auto'
      }
      this.setState(newStyleObj, () => {
        this.adjusted = true
      })
    }
  }
  componentDidMount () {
    // 有时候加载同一张图不会多次触发onload
    // 所以在componentDidMount里就可以调整图片了
    this.adjustImageStyle(this.image)
  }
  render ({ width, height, style, src }, { imageStyleWidth, imageStyleHeight }) {
    const imgStyle = {
      width: imageStyleWidth,
      height: imageStyleHeight
    }
    return (
      <XCenterView
        width={width}
        height={height}
        style={Object.assign({ overflow: 'hidden' }, style)}
      >
        <img
          ref={s => (this.image = s)}
          style={imgStyle}
          src={src}
          onLoad={this.imgOnLoad}
        />
      </XCenterView>
    )
  }
}
