import { h, Component, createContext, cloneElement } from 'preact'

// const merge = require('lodash.mergewith')
// const cloneDeep = require('lodash.clonedeep')
const FormContext = createContext({
  subscribeSubmit: () => {},
  subscribeChange: () => {},
  update: () => {},
  onChange: () => {},
  parentData: {}
})

const withFormContext = Component => props => (
  <FormContext.Consumer>
    {context => <Component {...props} {...context} />}
  </FormContext.Consumer>
)

@withFormContext
export class FormField extends Component {
  state = {
    err: ''
  }
  update = value => {
    const { field, update } = this.props
    update(field, value)
    if (this.state.err) {
      // 用户修改了，如果之前有错误提示的话，需要清空错误提示
      this.setState({ err: '' })
    }
  }
  componentDidMount () {
    const {
      validate,
      subscribeSubmit,
      label,
      field,
      parentData,
      getFormData
    } = this.props
    if (validate.length > 0) {
      subscribeSubmit(
        () =>
          new Promise((resolve, reject) => {
            let err
            for (let rule of validate) {
              err = rule(parentData[field], getFormData)
              if (err) {
                break
              }
            }
            if (err) {
              this.setState({ err })
              const errMsg = label + err + ''
              resolve(errMsg)
            } else {
              resolve()
            }
          })
      )
    }
  }

  render () {
    const { children, label, field, parentData } = this.props
    return cloneElement(children, {
      formField: {
        value: parentData[field],
        label,
        err: this.state.err,
        sync: this.update
      }
    })
  }
}
@withFormContext
export class FormComputed extends Component {
  render () {
    return this.props.children(this.props.parentData)
  }
}

@withFormContext
export class FormFragment extends Component {
  update = (key, value) => {
    const { namespace, parentData, update } = this.props
    update(
      namespace,
      Object.assign({}, parentData[namespace], {
        [key]: value
      })
    )
  }
  render () {
    const {
      children,
      namespace,
      parentData,
      subscribeSubmit,
      getFormData
    } = this.props
    return (
      <FormContext.Provider
        value={{
          parentData: parentData[namespace] || {},
          update: this.update,
          subscribeSubmit,
          getFormData
        }}
      >
        {children}
      </FormContext.Provider>
    )
  }
}

export class Form extends Component {
  static Fragment = FormFragment
  static Field = FormField
  static Computed = FormComputed
  init = initFormData => {
    this.setState({
      formData: initFormData || {}
    })
  }
  submit = callback => {
    Promise.all(this.submitListeners.map(func => func()))
      .then(results => {
        if (results.some(result => result)) {
          // 有校验失败的
          this.props.onValidateFailed(results.filter(result => result))
        } else {
          callback && callback(this.state.formData)
        }
      })
      .catch(() => {
        // 校验代码执行出错
      })
  }
  getFormData = () => this.state.formData
  subscribeChange = callback => {
    this.changeListeners.push(callback)
  }
  subscribeSubmit = callback => {
    this.submitListeners.push(callback)
  }
  update = (key, value) => {
    // let newFormData = cloneDeep(this.state.formData)
    // merge(newFormData, { [key]: value }, (objValue, srcValue) => {
    //   if (objValue && objValue.length !== undefined) {
    //     return srcValue
    //   }
    // })
    // this.setState(Object.assign({}, this.state, { formData: newFormData }))
    // this.changeListeners.forEach(listener => listener(newFormData))
    let newFormData = { ...this.state.formData }
    newFormData[key] = value
    this.setState({ formData: newFormData })
  }
  constructor (props) {
    super(props)
    this.changeListeners = []
    this.submitListeners = []
    this.state = {
      formData: {}
    }
  }
  shouldComponentUpdate () {
    return false
  }

  render () {
    const { children } = this.props
    return (
      <FormContext.Provider
        value={{
          parentData: this.state.formData,
          update: this.update,
          subscribeSubmit: this.subscribeSubmit,
          subscribeChange: this.subscribeChange,
          getFormData: this.getFormData
        }}
      >
        {children}
      </FormContext.Provider>
    )
  }
}
