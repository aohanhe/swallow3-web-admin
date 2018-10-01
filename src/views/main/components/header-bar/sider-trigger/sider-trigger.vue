<template>
  <a @click="handleChange" type="text" :class="['sider-trigger-a', collapsed ? 'collapsed' : '']">
    <Icon :type="icon" :size="size" />
  </a>
</template>
<script lang="ts">
import { Prop, Vue, Component, Provide } from 'vue-property-decorator'

@Component({name: 'siderTrigger'})
export default class SiderTrigger extends Vue {
  @Prop({ default: false })
  collapsed?:boolean

  @Prop({ default: 'navicon-round' })
  icon?:string

  @Prop({ default: 26 })
  size?:number

  handleChange () {
    this.$emit('on-change', !this.collapsed)
  }
}
</script>
<style lang="less">
@import './sider-trigger.less';
</style>
