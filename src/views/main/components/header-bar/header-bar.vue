<template>
  <div class="header-bar">
    <sider-trigger :collapsed="collapsed" icon="md-menu" @on-change="handleCollpasedChange"></sider-trigger>
    <custom-bread-crumb show-icon style="margin-left: 30px;" :list="breadCrumbList"></custom-bread-crumb>
    <div class="custom-content-con">
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts">
import { Prop, Vue, Component } from 'vue-property-decorator'
import siderTrigger from './sider-trigger'
import customBreadCrumb from './custom-bread-crumb'
import './header-bar.less'

@Component({name: 'HeaderBar',
  components: {
  siderTrigger,
  customBreadCrumb
  }
  })
export default class HeaderBar extends Vue {
  @Prop({ default: false })
  collapsed?: boolean

  get breadCrumbList () {
    return this.$store.state.app.breadCrumbList
  }

  handleCollpasedChange (state:boolean) {
    this.$emit('on-coll-change', state)
  }
}
</script>
