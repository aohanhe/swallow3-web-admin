<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <Avatar :src="avator"/>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script lang="ts">
import { Prop, Vue, Component, Watch } from 'vue-property-decorator'
import './user.less'
import { mapActions } from 'vuex'
import { dispatchHandleLogOut } from '@/store/dispatcher'

@Component({
  name: 'User'
  })
export default class User extends Vue {
    @Prop({ default: '' })
    userAvator?:string

    get avator () {
      // 如果用户没有给出头像就使用默认的
      if (!this.userAvator) {
        return require('@/assets/images/swallow2.png')
      }
      return this.userAvator
    }

    handleClick (name:string) {
      switch (name) {
        case 'logout':
          dispatchHandleLogOut().then(() => {
            this.$router.push({
              name: 'login'
            })
          })
          break
      }
    }
}
</script>
