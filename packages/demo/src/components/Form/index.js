import { h, Component, createContext, cloneElement } from 'preact'

const merge = require('lodash.mergewith')
const cloneDeep = require('lodash.clonedeep')
const FormContext = createContext({
  subscribeSubmit: () => {},
  subscribeChange: () => {},
  update: () => {},
  onChange: () => {},
  getFormData: () => {},
  parentData: {}
})

@withFormContext
export class FormField extends Component {
  state = {
    err: ''
  }
  update = value => {
    const { field, update } = this.props
    update(field, value)
    if (this.state.err) {
      this.setState({ err: '' })
    }
  }
  componentDidMount () {
    const { validate, subscribeSubmit, label, field } = this.props
    if (validate.length > 0) {
      subscribeSubmit(
        () =>
          new Promise((resolve, reject) => {
            let err
            for (let rule of validate) {
              err = rule(this.props.parentData[field], this.props.parentData)
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
    const { children, disable, label, field, parentData } = this.props
    return (
      <div>
        {cloneElement(children, {
          value: parentData && parentData[field],
          label,
          err: this.state.err,
          sync: this.update
        })}
        {disable && (
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              opacity: 0.1,
              backgroundColor: '#000'
            }}
          />
        )}
      </div>
    )
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
    this.props.update(this.props.namespace, { [key]: value })
  }
  render () {
    const { children, namespace, parentData } = this.props
    return (
      <FormContext.Provider
        value={{
          parentData: parentData && parentData[namespace],
          update: this.update,
          subscribeSubmit: this.props.subscribeSubmit
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
  subscribeChange = callback => {
    this.changeListeners.push(callback)
  }
  subscribeSubmit = callback => {
    this.submitListeners.push(callback)
  }
  getFormData = () => this.state.formData
  update = (key, value) => {
    let newFormData = cloneDeep(this.state.formData)
    merge(newFormData, { [key]: value }, (objValue, srcValue) => {
      if (objValue && objValue.length !== undefined) {
        return srcValue
      }
    })
    this.setState(Object.assign({}, this.state, { formData: newFormData }))
    this.changeListeners.forEach(listener => listener(newFormData))
  }
  constructor (props) {
    super(props)
    this.changeListeners = []
    this.submitListeners = []
    this.state = {
      formData: {},
      lastPropsFormData: {}
    }
  }
  static getDerivedStateFromProps (props, state) {
    if (props.formData === state.lastPropsFormData) {
      // 如果传入的formData没变，则不强刷form状态
      return null
    }
    // 强刷form状态,已经做的修改都会被覆盖
    return {
      formData: props.formData,
      lastPropsFormData: props.formData
    }
  }

  render () {
    const { children } = this.props
    return (
      <FormContext.Provider
        value={{
          parentData: this.state.formData,
          getFormData: this.getFormData,
          update: this.update,
          subscribeSubmit: this.subscribeSubmit,
          subscribeChange: this.subscribeChange
        }}
      >
        {children}
      </FormContext.Provider>
    )
  }
}

function withFormContext (Component) {
  return function (props) {
    return (
      <FormContext.Consumer>
        {context => <Component {...props} {...context} />}
      </FormContext.Consumer>
    )
  }
}
