<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="userName">
      <Input v-model="form.userName" placeholder="请输入用户名">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input type="password" v-model="form.password" placeholder="请输入密码">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem>
      <Button @click="handleSubmit" type="primary" long>登录</Button>
    </FormItem>
  </Form>
</template>

<script lang="ts">
import { Component, Prop, Vue, Provide } from 'vue-property-decorator'
import 'iview/dist/styles/iview.css'
import { Form, Icon, MenuItem, Input } from 'iview'

export interface LoginData{
  userName:string
  password:string
  checkcode?:string
}

@Component({
  name:"LoginForm"
  })
export default class LoginForm extends Vue {
  form = {
    userName: 'super_admin',
    password: ''
  }

  get rules () {
    return {
      userName: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
      password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
    }
  }

  handleSubmit () {
    let form = this.$refs['loginForm'] as Form
    let that=this
    form.validate(valid => {
      if (valid) {
        let lgdata:LoginData={
          userName: that.form.userName,
          password: that.form.password
        }
        that.$emit('on-success-valid', lgdata)
      }
    })
  }
}
</script>
