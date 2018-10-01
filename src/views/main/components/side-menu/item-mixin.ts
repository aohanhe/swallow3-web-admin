import { Prop, Vue, Component } from 'vue-property-decorator'

@Component
export default class ItemMixin extends Vue {
  @Prop()
  parentItem:any={}
  @Prop()
  theme: string=''
  @Prop()
  iconSize: number=0

  parentName () {
    return this.parentItem.name
  }
  children () {
    return this.parentItem.children
  }
  textColor () {
    return this.theme === 'dark' ? '#fff' : '#495060'
  }
}
