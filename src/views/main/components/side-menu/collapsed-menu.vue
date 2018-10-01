<template>
  <Dropdown ref="dropdown" @on-click="handleClick" :class="hideTitle ? '' : 'collased-menu-dropdown'" :transfer="hideTitle" :placement="placement">
    <a class="drop-menu-a" type="text" @mouseover="handleMousemove($event, children)" :style="{textAlign: !hideTitle ? 'left' : ''}"><common-icon :size="rootIconSize" :color="textColor" :type="parentItem.icon"/><span class="menu-title" v-if="!hideTitle">{{ showTitle(parentItem) }}</span><Icon style="float: right;" v-if="!hideTitle" type="ios-arrow-forward" :size="16"/></a>
    <DropdownMenu ref="dropdown" slot="list">
      <template v-for="child in children">
        <collapsed-menu v-if="showChildren(child)" :icon-size="iconSize" :parent-item="child" :key="`drop-${child.name}`"></collapsed-menu>
        <DropdownItem v-else :key="`drop-${child.name}`" :name="child.name"><common-icon :size="iconSize" :type="child.icon"/><span class="menu-title">{{ showTitle(child) }}</span></DropdownItem>
      </template>
    </DropdownMenu>
  </Dropdown>
</template>
<script lang="ts">
import mixin from './mixin'
import itemMixin from './item-mixin'
import { Menu } from '@/libs/menu'
import { Prop, Vue, Component, Watch } from 'vue-property-decorator'

@Component({
  name:'CollapsedMenu',
  mixins:[ mixin, itemMixin ]
  })

export default class CollapsedMenu extends Vue {
    @Prop({
      default: false
    })
    hideTitle?:boolean
    @Prop({ default: 16 })
    rootIconSize?:number

    placement='right-end'

    handleClick (name:string) {
      this.$emit('on-click', name)
    }

    handleMousemove (event:any, children:any) {
      const { pageY } = event
      const height = children.length * 38
      const isOverflow = pageY + height < window.innerHeight
      this.placement = isOverflow ? 'right-start' : 'right-end'
    }

    mounted () {
      let drop:any=this.$refs['dropdown']
      let dropdown = Menu.findNodeUpperByClasses(drop.$el, ['ivu-select-dropdown', 'ivu-dropdown-transfer']) as HTMLElement

      if (dropdown) {
        dropdown.style.overflow = 'visible'
      }
    }
}
</script>
