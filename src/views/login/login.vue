<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip">输入任意用户名和密码即可</p>
        </div>
      </Card>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import LoginForm, { LoginData } from '@/components/login/login-form.vue'
import { dispatchHandleLogin, dispatchGetUserInfo } from '@/store/dispatcher'
import { UserLoginResponse, UserInfoResponse } from '@/api/user'

@Component({
  name:'login',
  components:{LoginForm}
  }
)
export default class Login extends Vue {
  handleSubmit (lgdata:LoginData) {
    dispatchHandleLogin(lgdata)
      .then(resp => {
        dispatchGetUserInfo().then(() => {
          this.$Message.info('登入成功')
          this.$router.push('/home') // 登入成功后跳到首页
        }).catch(() => {
          this.$Message.error('登入失败，请检查帐号与密码')
        })
      })
  }
}

</script>

<style lang="less">
  @import './login.less';
</style>
