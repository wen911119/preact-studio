import { h, Component } from 'preact'
import { XCenterView } from '@ruiyun/preact-layout-suite'
// 有三种模式
// 默认 strict模式,图片大小和所设宽高一致，图片可能有拉伸缩
// fit模式, 用图片宽高的较大者来适配所设宽高，这种模式下图片不会变形并且显示完全，只是可能有较多缩放，看不清楚。
// fill模式, 用图片宽高的较小者来适配所设宽高，然后居中显示。这种模式不会缩放但是显示区域较小。

export default class Image extends Component {
  state = {
    naturalWidth: null,
    naturalHeight: null
  }
  imgOnLoad = e => {
    if (this.props.mode === 'fit' || this.props.mode === 'fill') {
      this.setState({
        naturalWidth: e.target.naturalWidth,
        naturalHeight: e.target.naturalHeight
      })
    }
  }
  render({ src, width, height, mode, style }, { naturalWidth, naturalHeight }) {
    let imgStyle = {
      width: '100%',
      height: '100%'
    }
    if (naturalWidth && naturalHeight) {
      if (mode === 'fit') {
        if (naturalWidth > naturalHeight) {
          delete imgStyle.height
        }
        else {
          delete imgStyle.width
        }
      }
      else if (mode === 'fill') {
        if (naturalWidth > naturalHeight) {
          delete imgStyle.width
        }
        else {
          delete imgStyle.height
        }
      }
    }
    return (
      <XCenterView
        width={width}
        height={height}
        style={Object.assign({ overflow: 'hidden' }, style)}
      >
        <img style={imgStyle} src={src} onLoad={this.imgOnLoad} />
      </XCenterView>
    )
  }
}
