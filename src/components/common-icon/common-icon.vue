<template>
  <component :is="iconType" :type="iconName" :color="iconColor" :size="iconSize"/>
</template>

<script lang="ts">
import Icons from '@/components/icons'
import { Prop, Vue, Component, Watch } from 'vue-property-decorator'

@Component({
  name: 'CommonIcon',
  components:{Icons}
  })
export default class CommonIcon extends Vue {
  @Prop({
    required: true
  })
  type?:string
  @Prop()
  color?:string
  @Prop()
  size?:number

  get iconType () {
    return (this.type as string).indexOf('_') === 0 ? 'Icons' : 'Icon'
  }

  get iconName () {
    return this.iconType === 'Icons' ? this.getCustomIconName(this.type as string) : this.type
  }
  get iconSize () {
    return this.size || (this.iconType === 'Icons' ? 12 : undefined)
  }
  get iconColor () {
    return this.color || ''
  }

  getCustomIconName (iconName:string) {
    return iconName.slice(1)
  }
}
</script>

<style>

</style>
