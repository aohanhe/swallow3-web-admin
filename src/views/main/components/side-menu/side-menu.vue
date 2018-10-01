<template>
  <div class="side-menu-wrapper">
    <slot></slot>
    <Menu ref="menu" v-show="!collapsed" :active-name="activeName" :open-names="openedNames" :accordion="accordion" :theme="theme" width="auto" @on-select="handleSelect">
      <template v-for="item in menuList">
        <template v-if="item.children && item.children.length === 1">
          <side-menu-item v-if="showChildren(item)" :key="`menu-${item.name}`" :parent-item="item"></side-menu-item>
          <menu-item v-else :name="getNameOrHref(item, true)" :key="`menu-${item.children[0].name}`"><common-icon :type="item.children[0].icon || ''"/><span>{{ showTitle(item.children[0]) }}</span></menu-item>
        </template>
        <template v-else>
          <side-menu-item v-if="showChildren(item)" :key="`menu-${item.name}`" :parent-item="item"></side-menu-item>
          <menu-item v-else :name="getNameOrHref(item)" :key="`menu-${item.name}`"><common-icon :type="item.icon || ''"/><span>{{ showTitle(item) }}</span></menu-item>
        </template>
      </template>
    </Menu>
    <div class="menu-collapsed" v-show="collapsed" :list="menuList">
      <template v-for="item in menuList">
        <collapsed-menu v-if="item.children && item.children.length > 1" @on-click="handleSelect" hide-title :root-icon-size="rootIconSize" :icon-size="iconSize" :theme="theme" :parent-item="item" :key="`drop-menu-${item.name}`"></collapsed-menu>
        <Tooltip transfer v-else :content="(item.meta && item.meta.title) || (item.children && item.children[0] && item.children[0].meta.title)" placement="right" :key="`drop-menu-${item.name}`">
          <a @click="handleSelect(getNameOrHref(item, true))" class="drop-menu-a" :style="{textAlign: 'center'}"><common-icon :size="rootIconSize" :color="textColor" :type="item.icon || (item.children && item.children[0].icon)"/></a>
        </Tooltip>
      </template>
    </div>
  </div>
</template>
<script lang="ts">
import { Prop, Vue, Component, Watch } from 'vue-property-decorator'
import SideMenuItem from './side-menu-item.vue'
import CollapsedMenu from './collapsed-menu.vue'
import mixin from './mixin'
import { getUnion } from '@/libs/common-tools.js'
import { Menu } from 'iview'

@Component({
  name: 'SideMenu',
  mixins:[mixin],
  components: {
  SideMenuItem,
  CollapsedMenu
  }
  })
export default class SideMenu extends Vue {
    @Prop({ default: () => [] })
    menuList?:Array<any>

    @Prop()
    collapsed?:boolean

    @Prop({ default: 'dark' })
    theme?:string

    @Prop({ default: 20 })
    rootIconSize?:number

    @Prop({ default: 16 })
    iconSize?:number

    @Prop()
    accordion?: boolean

    @Prop({ default: '' })
    activeName?:string

    @Prop({ default: () => [] })
    openNames?:Array<any>

    openedNames:Array<any>=[]

    handleSelect (name:string) {
      this.$emit('on-select', name)
    }
    getOpenedNamesByActiveName (name:string) {
      return this.$route.matched.map(item => item.name).filter(item => item !== name)
    }
    updateOpenName (name:string) {
      if (name === 'home') this.openedNames = []
      else this.openedNames = this.getOpenedNamesByActiveName(name)
    }

    get textColor () {
      return this.theme === 'dark' ? '#fff' : '#495060'
    }

    @Watch('activeName')
    onActiveName (name:string) {
      if (this.accordion) this.openedNames = this.getOpenedNamesByActiveName(name)
      else this.openedNames = getUnion(this.openedNames, this.getOpenedNamesByActiveName(name))
    }

    @Watch('openNames')
    onOpenNames (newNames:any) {
      this.openedNames = newNames
    }

    @Watch('openedNames')
    onOpenedNames () {
      this.$nextTick(() => {
        (this.$refs.menu as Menu).updateOpened()
      })
    }

    mounted () {
      this.openedNames = getUnion(this.openedNames, this.getOpenedNamesByActiveName(name))
    }
}
</script>
<style lang="less">
@import './side-menu.less';
</style>
