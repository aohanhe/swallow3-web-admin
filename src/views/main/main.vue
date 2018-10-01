<template>
  <Layout style="height: 100%" class="main">
    <Sider hide-trigger collapsible :width="256" :collapsed-width="64" v-model="collapsed" class="left-sider" :style="{overflow: 'hidden'}">
      <side-menu accordion ref="sideMenu" :active-name="$route.name" :collapsed="collapsed" @on-select="turnToPage" :menu-list="menuList">
        <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
        <div class="logo-con">
          <img v-show="!collapsed" src="~@/assets/images/logo.jpg" key="max-logo" />
          <img v-show="collapsed" src="~@/assets/images/logo-min.jpg" key="min-logo" />
        </div>
      </side-menu>
    </Sider>
    <Layout>
      <Header class="header-con">
        <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
          <user :user-avator="userAvator"/>
          <language @on-lang-change="setLocal" style="margin-right: 10px;" :lang="local"/>
          <fullscreen v-model="isFullscreen" style="margin-right: 10px;"/>
        </header-bar>
      </Header>
      <Content class="main-content-con">
        <Layout class="main-layout-con">
          <div class="tag-nav-wrapper">
            <tags-nav :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag"/>
          </div>
          <Content class="content-wrapper">
            <keep-alive :include="cacheList">
              <router-view/>
            </keep-alive>
          </Content>
        </Layout>
      </Content>
    </Layout>
  </Layout>
</template>
<script lang="ts">
import { Prop, Vue, Component, Watch } from 'vue-property-decorator'
import { dispatchHandleLogin } from '@/store/dispatcher'
import CommitTool from '@/store/commit'
import router, { RouteConfig } from 'vue-router'
import SideMenu from './components/side-menu'
import HeaderBar from './components/header-bar'
import TagsNav from './components/tags-nav'
import User from './components/user'
import Fullscreen from './components/fullscreen'
import Language from './components/language'
import Tool from '@/libs/tools'
import RouteRight from '@/libs/route_right'
import NavTool from '@/libs/nav'
import './main.less'

@Component({
  name: 'Main',
  components: {
  SideMenu,
  HeaderBar,
  Language,
  TagsNav,
  Fullscreen,
  User
  }
  })
export default class Main extends Vue {
      collapsed:boolean= false
      minLogo:string=''
      maxLogo:string=''
      isFullscreen:boolean= false

      get tagNavList () {
        return this.$store.state.app.tagNavList
      }
      get tagRouter () {
        return this.$store.state.app.tagRouter
      }
      get userAvator () {
        return this.$store.state.user.avatorImgPath
      }
      get cacheList () {
        return this.tagNavList.length ? this.tagNavList.filter((item:any) => !(item.meta && item.meta.notCache)).map((item:any) => item.name) : []
      }
      get menuList () {
        return this.$store.getters['app/menuList']
      }
      get local () {
        return this.$store.state.app.local
      }

      turnToPage (route:any) {
        let name, params, query
        if (typeof route === 'string') name = route
        else {
          name = route.name
          params = route.params
          query = route.query
        }
        if (name.indexOf('isTurnByHref_') > -1) {
          window.open(name.split('_')[1])
          return
        }
        this.$router.push({
          name,
          params,
          query
        })
      }
      handleCollapsedChange (state:boolean) {
        this.collapsed = state
      }

      handleCloseTag (res:any, type:any, route:any) {
        console.log('do handleCloseTag')
        let openName:string = ''
        if (type === 'all') {
          this.turnToPage('home')
          openName = 'home'
        } else if (RouteRight.routeEqual(this.$route, route)) {
          if (type === 'others') {
            openName = route.name
          } else {
            const nextRoute = Tool.getNextRoute(this.tagNavList, route)
            if (nextRoute) {
              this.$router.push(nextRoute as RouteConfig)
              openName = nextRoute.name as string
            }
          }
        }

        CommitTool.setTagNavList(res)
        let sideMenu:any = this.$refs.sideMenu
        sideMenu.updateOpenName(openName)
      }
      handleClick (item:any) {
        this.turnToPage(item)
      }

      @Watch('$route')
      onRoute (newRoute:any) {
        CommitTool.setBreadCrumb(newRoute.matched)
        CommitTool.setTagNavList(NavTool.getNewTagList(this.tagNavList, newRoute))
      }

      /**
       * 设置界面的语言
       */
      setLocal (lang:string) {
        CommitTool.setLocal(lang)
      }

      mounted () {
        /**
     * @description 初始化设置面包屑导航和标签导航
     */
        CommitTool.setTagNavList([])
        CommitTool.addTag({
          route: this.$store.state.app.homeRoute
        })
        CommitTool.setBreadCrumb(this.$route.matched)
        // 设置初始语言
        CommitTool.setLocal('zh-CN')
      }
}

</script>
