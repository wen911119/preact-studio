import { h, Component } from 'preact'
import { WithImagePreview } from '@ruiyun/preact-m-image-preview'
import { TouchableInline } from '@ruiyun/preact-m-touchable'
import Image from '@ruiyun/preact-image'
import { RowView } from '@ruiyun/preact-layout-suite'
import p2r from 'p-to-r'
import Text from '@ruiyun/preact-text'
import Loading from '@ruiyun/preact-loading'

const labelStyle = {
  border: '1px solid #ccc',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: p2r(80),
  display: 'flex',
  marginTop: p2r(15),
  marginBottom: p2r(15),
  float: 'left',
  marginRight: p2r(30)
}

const imageWrapStyle = {
  position: 'relative',
  marginTop: p2r(15),
  marginBottom: p2r(15),
  float: 'left',
  marginRight: p2r(30)
}

const deleteIconStyle = {
  position: 'absolute',
  display: 'inline-block',
  height: p2r(50),
  width: p2r(50),
  top: `-${p2r(25)}`,
  right: `-${p2r(25)}`,
  textAlign: 'center',
  lineHeight: p2r(50),
  fontSize: p2r(28),
  fontStyle: 'normal',
  color: '#fff',
  backgroundColor: '#ccc',
  borderRadius: '50%',
  zIndex: 1
}

@WithImagePreview
export default class OSSImageUploader extends Component {
  state = {
    images: this.props.urls || [],
    max: this.props.max || 999,
    loaders: [],
    uploaderId: `uploader${Math.random()}`,
    mode: this.props.mode || 'edit',
    size: this.props.size || 210
  }
  _upload = () => {
    // hack方式暴露给组件外调用
    const files = this.state.images
      .filter(image => !!image.url)
      .map(image => image.origin)
    return new Promise(async resolve => {
      if (this.props.$upload && files.length > 0) {
        const urls = await this.props.$upload(
          files,
          file => '/temp/' + file.name.replace('.', `-${Date.now()}.`)
        )
        this.setState(
          {
            images: this.state.images.filter(image => !image.url).concat(urls)
          },
          () => {
            resolve(this.state.images)
          }
        )
      }
      else {
        resolve(this.state.images)
      }
    })
  }
  onPreview = index => {
    this.props.$preview(
      this.state.images.map(image => image.url || image),
      index
    )
  }
  onChoose = async e => {
    const limit = this.state.max - this.state.images.length
    const files = Array.from(e.target.files).slice(0, limit)
    if (this.props.onChange) {
      // 自动上传
      this.setState({
        loaders: files
      })
      if (this.props.$upload) {
        const urls = await this.props.$upload(
          files,
          file => '/temp/' + file.name.replace('.', `-${Date.now()}.`)
        )
        this.setState(
          {
            images: this.state.images.concat(urls),
            loaders: []
          },
          () => this.props.onChange(this.state.images)
        )
      }
    }
    else {
      // 只预览，后面手动上传
      const fileObjs = await Promise.all(
        files.map(async file => {
          const p = new Promise(resolve => {
            const fileReader = new FileReader()
            fileReader.onload = e2 => {
              resolve(e2.target.result)
            }
            fileReader.readAsDataURL(file)
          })
          const base64Url = await p
          return {
            url: base64Url,
            origin: file
          }
        })
      )
      this.setState({
        images: this.state.images.concat(fileObjs)
      })
    }
  }
  onDelete = index => {
    const newImagesArr = Array.from(this.state.images)
    newImagesArr.splice(index, 1)
    this.setState({
      images: newImagesArr
    })
  }
  componentDidMount() {
    // 多层hoc嵌套之后取不到实例方法，只能这样hack
    this.props.hookUploadMethod && this.props.hookUploadMethod(this._upload)
  }
  render(
    { title = '上传照片' },
    { images, max, loaders, uploaderId, mode, size }
  ) {
    const lenght = images.length + loaders.length
    const itemStyle = Object.assign(labelStyle, {
      width: p2r(size),
      height: p2r(size)
    })
    return (
      <div>
        <RowView height={80} hAlign="space-between">
          <Text>{title}</Text>
          {max !== 999 && mode === 'edit' && (
            <Text color="#ccc">{`${lenght}/${max}`}</Text>
          )}
        </RowView>
        <div
          className="image-uploader-content-container"
          style={{ marginRight: `-${p2r(30)}` }}
        >
          {images.map((image, i) => (
            <div style={imageWrapStyle} key={image.url || image}>
              {mode === 'edit' && (
                <i
                  style={deleteIconStyle}
                  onClick={this.onDelete.bind(this, i)}
                >
                  X
                </i>
              )}
              <TouchableInline onPress={this.onPreview.bind(this, i)}>
                <Image
                  mode="fill"
                  width={size}
                  height={size}
                  key={i}
                  src={image.url || image}
                />
              </TouchableInline>
            </div>
          ))}
          {loaders.map((_, i) => (
            <div key={i} style={itemStyle}>
              <Loading size={60} />
            </div>
          ))}
          {lenght < max && loaders.length === 0 && mode === 'edit' && (
            <label for={uploaderId} style={itemStyle}>
              +
              <input
                id={uploaderId}
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={this.onChoose}
              />
            </label>
          )}
        </div>
      </div>
    )
  }
}
