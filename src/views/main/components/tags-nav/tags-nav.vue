<template>
  <div class="tags-nav">
    <ul v-show="visible" :style="{left: contextMenuLeft + 'px', top: contextMenuTop + 'px'}" class="contextmenu">
      <li v-for="(item, key) of menuList" @click="handleTagsOption(key)" :key="key">{{item}}</li>
    </ul>
    <div class="btn-con left-btn">
      <Button type="text" @click="handleScroll(240)">
        <Icon :size="18" type="ios-arrow-back" />
      </Button>
    </div>
    <div class="btn-con right-btn">
      <Button type="text" @click="handleScroll(-240)">
        <Icon :size="18" type="ios-arrow-forward" />
      </Button>
    </div>
    <div class="scroll-outer" ref="scrollOuter" @DOMMouseScroll="handlescroll" @mousewheel="handlescroll">
      <div ref="scrollBody" class="scroll-body" :style="{left: tagBodyLeft + 'px'}">
        <transition-group name="taglist-moving-animation">
          <Tag
            type="dot"
            v-for="(item, index) in list"
            ref="tagsPageOpened"
            :key="`tag-nav-${index}`"
            :name="item.name"
            @on-close="handleClose(item)"
            @click.native="handleClick(item)"
            :closable="item.name !== 'home'"
            :color="isCurrentTag(item) ? 'primary' : 'default'"
            @contextmenu.prevent.native="contextMenu(item, $event)"
          >{{ showTitleInside(item) }}</Tag>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop, Vue, Component, Watch } from 'vue-property-decorator'
import { Tag } from 'iview'
import TagNav from '@/libs/nav'
import RouteRight from '@/libs/route_right'

@Component({name: 'TagsNav'})
export default class TagsNav extends Vue {
    @Prop({ default: {} })
    value?:any

    @Prop({ default: () => [] })
    list?:Array<any>

    tagBodyLeft:number= 0
    rightOffset:number= 40
    outerPadding:number= 4
    contextMenuLeft:number= 0
    contextMenuTop:number= 0
    visible:boolean = false
    menuList= {
      others: '关闭其他',
      all: '关闭所有'
    }

    refsTag:Array<Tag>=[]

    get currentRouteObj () {
      const { name, params, query } = this.value
      return { name, params, query }
    }

    handlescroll (e:any) {
      var type = e.type
      let delta = 0
      if (type === 'DOMMouseScroll' || type === 'mousewheel') {
        delta = (e.wheelDelta) ? e.wheelDelta : -(e.detail || 0) * 40
      }
      this.handleScroll(delta)
    }

    handleScroll (offset:number) {
      const outerWidth = (this.$refs.scrollOuter as HTMLElement).offsetWidth
      const bodyWidth = (this.$refs.scrollBody as HTMLElement).offsetWidth
      if (offset > 0) {
        this.tagBodyLeft = Math.min(0, this.tagBodyLeft + offset)
      } else {
        if (outerWidth < bodyWidth) {
          if (this.tagBodyLeft < -(bodyWidth - outerWidth)) {
            this.tagBodyLeft = this.tagBodyLeft
          } else {
            this.tagBodyLeft = Math.max(this.tagBodyLeft + offset, outerWidth - bodyWidth)
          }
        } else {
          this.tagBodyLeft = 0
        }
      }
    }

    handleTagsOption (type:string) {
      if (type === 'all') {
        // 关闭所有，除了home
        let res = (this.list as Array<any>).filter(item => item.name === 'home')
        this.$emit('on-close', res, 'all')
      } else if (type === 'others') {
        // 关闭除当前页和home页的其他页
        let res = (this.list as Array<any>).filter(item => RouteRight.routeEqual(this.currentRouteObj, item) || item.name === 'home')
        this.$emit('on-close', res, 'others', this.currentRouteObj)
        setTimeout(() => {
          this.getTagElementByName(this.currentRouteObj.name)
        }, 100)
      }
    }

    handleClose (current:any) {
      let res = (this.list as Array<any>).filter(item => !RouteRight.routeEqual(current, item))
      this.$emit('on-close', res, undefined, current)
    }
    handleClick (item:any) {
      this.$emit('input', item)
    }
    showTitleInside (item:any) {
      return TagNav.showTitle(item, Vue)
    }
    isCurrentTag (item:any) {
      return RouteRight.routeEqual(this.currentRouteObj, item)
    }
    moveToView (tag:any) {
      const outerWidth = (this.$refs.scrollOuter as HTMLElement).offsetWidth
      const bodyWidth = (this.$refs.scrollBody as HTMLElement).offsetWidth
      if (bodyWidth < outerWidth) {
        this.tagBodyLeft = 0
      } else if (tag.offsetLeft < -this.tagBodyLeft) {
        // 标签在可视区域左侧
        this.tagBodyLeft = -tag.offsetLeft + this.outerPadding
      } else if (tag.offsetLeft > -this.tagBodyLeft && tag.offsetLeft + tag.offsetWidth < -this.tagBodyLeft + outerWidth) {
        // 标签在可视区域
        this.tagBodyLeft = Math.min(0, outerWidth - tag.offsetWidth - tag.offsetLeft - this.outerPadding)
      } else {
        // 标签在可视区域右侧
        this.tagBodyLeft = -(tag.offsetLeft - (outerWidth - this.outerPadding - tag.offsetWidth))
      }
    }

    getTagElementByName (name:string) {
      this.$nextTick(() => {
        this.refsTag = this.$refs.tagsPageOpened as Array<Tag>

        this.refsTag.forEach((item, index) => {
          if (name === item.name) {
            let tag = this.refsTag[index].$el
            this.moveToView(tag)
          }
        })
      })
    }
    contextMenu (item:any, e:any) {
      if (item.name === 'home') {
        return
      }
      this.visible = true
      const offsetLeft = this.$el.getBoundingClientRect().left
      this.contextMenuLeft = e.clientX - offsetLeft + 10
      this.contextMenuTop = e.clientY - 64
    }
    closeMenu () {
      this.visible = false
    }

    @Watch('$route')
    onRoute (to:any) {
      this.getTagElementByName(to.name)
    }
    @Watch('visible')
    onVisible (value:any) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }

    mounted () {
      setTimeout(() => {
        if (this.$route) {
          let route:any=this.$route
          this.getTagElementByName(route.name)
        }
      }, 200)
    }
}
</script>

<style lang="less">
@import './tags-nav.less';
</style>
