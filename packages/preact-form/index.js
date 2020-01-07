import { h, Component, createContext, cloneElement } from 'preact'
import safeGet from 'dlv'

const FormContext = createContext({
  subscribeValidate: () => {},
  unsubscribeValidate: () => {},
  update: () => {},
  onChange: () => {},
  parentData: {},
  getFormData: () => {}
})
// eslint-disable-next-line
const withFormContext = Component => props => (
  <FormContext.Consumer>
    {context => <Component {...props} {...context} />}
  </FormContext.Consumer>
)

@withFormContext
export class FormField extends Component {

  update = value => {
    const { field, update } = this.props
    update(field, value, [field])
    if (this.state.err) {
      // 用户修改了，如果之前有错误提示的话，需要清空错误提示
      this.setState({ err: '' })
    }
  }

  subscribeValidate = () => {
    const self = this
    const { validate = [], subscribeValidate } = self.props
    if (validate.length > 0) {
      this.subscribeId = subscribeValidate(
        () =>
          new Promise(async (resolve, reject) => {
            const {
              validate,
              label,
              field,
              parentData,
              getFormData
            } = self.props
            let err
            for (let rule of validate) {
              err = await rule(parentData[field], getFormData)
              if (err) {
                break
              }
            }
            if (err) {
              this.setState({ err })
              const errMsg = label + err + ''
              resolve(errMsg)
            }
            else {
              resolve()
            }
          })
      )
    }
  }

  unsubscribeValidate = () => {
    if (this.subscribeId) {
      const { unsubscribeValidate, cleanWhenUnmount = true } = this.props
      unsubscribeValidate(this.subscribeId)
      this.subscribeId = undefined
      // 默认清空该字段的值
      cleanWhenUnmount && this.update()
    }
  }

  getLinkData = () => {
    const { link, getFormData } = this.props
    let linkData = {}
    if (link) {
      const formData = getFormData()
      for (let key in link) {
        if (link.hasOwnProperty(key)) {
          linkData[key] = safeGet(formData, link[key])
        }
      }
    }
    return linkData
  }

  constructor (props){
    super(props)
    this.subscribeId = undefined
    this.state = {
      err: ''
    }
  }

  componentDidMount () {
    this.subscribeValidate()
  }

  shouldComponentUpdate (nextProps, nextState) {
    let shouldUpdate =
      this.props.parentData[this.props.field] !==
        nextProps.parentData[nextProps.field] ||
      this.props.label !== nextProps.label ||
      this.props.field !== nextProps.field ||
      this.state.err !== nextState.err

    if (!shouldUpdate && nextProps.link) {
      for (let key in nextProps.link) {
        if (nextProps.link.hasOwnProperty(key)) {
          if (
            nextProps.link[key] === nextProps.lastUpdate ||
            nextProps.lastUpdate === 'all'
          ) {
            shouldUpdate = true
            break
          }
        }
      }
    }
    return shouldUpdate
  }

  componentWillUnmount (){
    this.unsubscribeValidate()
  }

  render () {
    const { children, label, field, parentData } = this.props
    const linkData = this.getLinkData()
    return cloneElement(children, {
      value: parentData[field],
      label,
      err: this.state.err,
      sync: this.update,
      ...linkData
    })
  }
}

@withFormContext
export class FormFragment extends Component {
  update = (key, value, keypathsArr) => {
    const { namespace, parentData, update } = this.props
    update(
      namespace,
      Object.assign({}, parentData[namespace], {
        [key]: value
      }),
      [namespace].concat(keypathsArr)
    )
  }
  componentWillUnmount () {
    const { cleanWhenUnmount = true, namespace, update } = this.props
    // 默认 被卸载的时候清除字段
    cleanWhenUnmount && setTimeout(() => update(namespace, undefined, namespace), 0)
  }
  render () {
    const {
      children,
      namespace,
      parentData,
      subscribeValidate,
      unsubscribeValidate,
      getFormData,
      lastUpdate
    } = this.props
    return (
      <FormContext.Provider
        value={{
          parentData: parentData[namespace] || {},
          update: this.update,
          subscribeValidate,
          unsubscribeValidate,
          getFormData,
          lastUpdate
        }}
      >
        {children}
      </FormContext.Provider>
    )
  }
}

@withFormContext
export class FormCondition extends Component {
  
  render () {
    const {
      children,
      parentData,
      subscribeValidate,
      unsubscribeValidate,
      getFormData,
      lastUpdate,
      update,
      condition = () => true
    } = this.props
    return condition(getFormData()) ? (
      <FormContext.Provider
        value={{
          parentData,
          update,
          subscribeValidate,
          unsubscribeValidate,
          getFormData,
          lastUpdate
        }}
      >
        {children}
      </FormContext.Provider>
    ): undefined
  }
}


export default class Form extends Component {
  static Fragment = FormFragment
  static Field = FormField
  static Condition = FormCondition
  init = initFormData => {
    this.setState({
      formData: initFormData || {},
      lastUpdate: 'all'
    })
  }
  validate = (successCallback, failCallback) => {
    Promise.all(this.validateListeners.map(func => func()))
      .then(results => {
        if (results.some(result => result)) {
          // 有校验失败的
          failCallback && failCallback(results.filter(result => result))
        }
        else {
          successCallback && successCallback(this.state.formData)
        }
      })
      .catch(error => {
        // 校验代码执行出错
        console.log(error)
      })
  }
  getFormData = () => this.state.formData
  subscribeValidate = callback => {
    this.validateListeners.push(callback)
    return callback
  }
  unsubscribeValidate = callbackRef => {
    const index = this.validateListeners.findIndex(item => item === callbackRef)
    this.validateListeners.splice(index, 1)
  }
  update = (key, value, keypathsArr) => {
    let newFormData = { ...this.state.formData }
    newFormData[key] = value
    this.setState({
      formData: newFormData,
      lastUpdate: keypathsArr.join('.')
    })
  }
  constructor (props) {
    super(props)
    this.changeListeners = []
    this.validateListeners = []
    this.state = {
      formData: {},
      lastUpdate: ''
    }
  }

  render () {
    const { children } = this.props
    return (
      <FormContext.Provider
        value={{
          parentData: this.state.formData,
          lastUpdate: this.state.lastUpdate,
          update: this.update,
          subscribeValidate: this.subscribeValidate,
          unsubscribeValidate: this.unsubscribeValidate,
          getFormData: this.getFormData
        }}
      >
        {children}
      </FormContext.Provider>
    )
  }
}
