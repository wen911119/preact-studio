import { h, Component } from 'preact'
import { XCenterView } from '@ruiyun/preact-layout-suite'
import Button from '@ruiyun/preact-button'
import Form from '@ruiyun/preact-form'
import Line from '@ruiyun/preact-line'
import {
  FormTextInput,
  FormActionSheetInput,
  FormNumberInput
} from '@ruiyun/preact-m-form-component'

import { required, range } from '../../components/Validate'
import SalaryInput from './components/salaryInput'

const phoneCheck = async phoneNum => {
  const p = new Promise(resolve => {
    setTimeout(resolve, 3000)
  })
  await p
  return '手机号不存在'
}

export default class FormDemo extends Component {
  state = {
    name: 'wenjun'
  }
  onReset = () => {
    this.form.init()
  }
  onSubmit = () => {
    this.form.validate(
      formData => {
        console.log('formData', formData)
      },
      errors => {
        console.log('error', errors)
      }
    )
  }
  render () {
    return (
      <div>
        <Form ref={form => (this.form = form)}>
          <Form.Field label='姓名' field='name' validate={[required]}>
            <FormTextInput required maxLength={3} placeholder='请输入姓名' />
          </Form.Field>
          <Line />
          <Form.Field label='年龄' field='age' validate={[range(0, 150)]}>
            <FormNumberInput limit={3} placeholder='请输入年龄' />
          </Form.Field>
          <Line />
          <Form.Field
            label='手机号'
            field='phone'
            validate={[required, phoneCheck]}
          >
            <FormNumberInput required limit={11} placeholder='请输入手机号' />
          </Form.Field>
          <Line />
          <Form.Fragment namespace='apply'>
            <Form.Field label='申请的职位' field='role'>
              <FormActionSheetInput
                placeholder='请输入你期望的职位'
                options={['开发工程师', '测试工程师', '运营专员', '产品经理']}
              />
            </Form.Field>
            <Line />
            <Form.Field
              label='期望的薪资'
              field='salary'
              validate={[range(0, 30)]}
              link={{ role: 'apply.role' }}
            >
              <SalaryInput placeholder='请输入期望的薪资' />
            </Form.Field>
            <Line />
          </Form.Fragment>
          <XCenterView height={200}>
            <Button
              onClick={this.onReset}
              style={{ boxShadow: '0px 8px 8px 0px rgba(0,0,0,0.1)' }}
              color='#e42506'
              padding={[10, 30, 10, 30]}
            >
              重置
            </Button>
            <Button
              onClick={this.onSubmit}
              style={{ boxShadow: '0px 8px 8px 0px rgba(0,0,0,0.1)' }}
              color='#5581fa'
              padding={[10, 30, 10, 30]}
            >
              提交
            </Button>
          </XCenterView>
        </Form>
      </div>
    )
  }
}
