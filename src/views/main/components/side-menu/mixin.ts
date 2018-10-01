import CommonIcon from '@/components/common-icon'
import { RouteConfig } from 'vue-router'
import { Prop, Vue, Component } from 'vue-property-decorator'

@Component({
  components:{CommonIcon}
  })
export default class CollapsedMixins extends Vue {
  showTitle (item:RouteConfig) {
    return Vue.prototype.$config.useI18n ? Vue.prototype.$t(item.name) : ((item.meta && item.meta.title) || item.name)
  }
  showChildren (item:RouteConfig) {
    return item.children && (item.children.length > 1 || (item.meta && item.meta.showAlways))
  }
  getNameOrHref (item:any, children0:RouteConfig) {
    return item.href ? `isTurnByHref_${item.href}` : (children0 ? item.children[0].name : item.name)
  }
}
