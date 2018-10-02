import { Prop, Vue, Component } from 'vue-property-decorator'

@Component
export default class ItemMixin extends Vue {
  @Prop({ default: () => {} })
  parentItem?:any
  @Prop({ default: '' })
  theme?: string
  @Prop({ default: 0 })
  iconSize?: number

  get parentName () {
    return this.parentItem.name
  }
  get children () {
    return this.parentItem.children
  }
  get textColor () {
    return this.theme === 'dark' ? '#fff' : '#495060'
  }
}
