import { h, Component } from 'preact'
import Image from '@ruiyun/preact-image'
import WithImagePreview from '@ruiyun/preact-m-image-preview'
import {
  SlotColumnView,
  XCenterView,
  SlotRowView
} from '@ruiyun/preact-layout-suite'
import Loading from '@ruiyun/preact-loading'
import lodashchunk from 'lodash.chunk'

import className from './index.css'

@WithImagePreview
export default class ImageUploader extends Component {
  onPreview = index => {
    this.props.$preview(this.state.images, index)
  }
  onDelete = index => {
    this.setState(
      {
        images: this.state.images.filter((url, i) => index !== i)
      },
      () => {
        this.props.onChange && this.props.onChange(this.state.images)
      }
    )
  }
  onChoose = async event => {
    const { max = 999, $upload, onChange } = this.props
    const { images } = this.state
    const limit = max - images.length
    const files = Array.from(event.target.files).slice(0, limit)
    if (onChange) {
      // 自动上传
      if ($upload) {
        this.setState({
          loaders: files.map(() => 'loader')
        })
        // 需要父组件提供$upload属性
        const urls = await $upload(files)
        this.setState(
          {
            images: this.state.images.concat(urls),
            loaders: []
          },
          () => this.props.onChange(this.state.images)
        )
      }
      else {
        console.warn('缺少$upload属性方法')
      }
    }
  }
  constructor (props) {
    super(props)
    this.state = {
      images: props.urls || [],
      loaders: [],
      uploaderId: `uploader${Math.random()}`
    }
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.urls !== this.props.urls) {
      this.setState({
        images: nextProps.urls
      })
    }
  }
  render () {
    const {
      mode = 'edit',
      size = [210, 210],
      max = 999,
      columnSlot = 30,
      rowSlot = 30,
      rowItems = 3,
      placeholder
    } = this.props
    const { images, loaders, uploaderId } = this.state
    const length = images.length
    let items = images.concat(loaders)
    if (length < max && loaders.length === 0 && mode === 'edit') {
      items.push('add')
    }
    const itemsChunk = lodashchunk(items, rowItems)
    return (
      <SlotColumnView slot={columnSlot}>
        {itemsChunk.map((chunk, i) => (
          <SlotRowView slot={rowSlot}>
            {chunk.map((item, j) => {
              if (item === 'loader') {
                return (
                  <XCenterView
                    height={size[1]}
                    width={size[0]}
                    className={className.loading}
                  >
                    <Loading size={60} />
                  </XCenterView>
                )
              }
              else if (item === 'add') {
                return (
                  <XCenterView
                    className={className.add}
                    height={size[1]}
                    width={size[0]}
                  >
                    <label
                      htmlFor={uploaderId}
                    >
                      {placeholder ? placeholder() : '+'}
                      <input
                        id={uploaderId}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={this.onChoose}
                      />
                    </label>
                  </XCenterView>
                )
              }
              return (
                <div className={className.imageWrap}>
                  {mode === 'edit' && (
                    <i
                      className={className.deleteIcon}
                      // eslint-disable-next-line
                      onClick={this.onDelete.bind(this, rowItems * i + j)}
                    >
                      &#xFBE;
                    </i>
                  )}
                  <Image
                    // eslint-disable-next-line
                    onClick={this.onPreview.bind(this, rowItems * i + j)}
                    mode="fill"
                    width={size[0]}
                    height={size[1]}
                    src={item}
                  />
                </div>
              )
            })}
          </SlotRowView>
        ))}
      </SlotColumnView>
    )
  }
}
