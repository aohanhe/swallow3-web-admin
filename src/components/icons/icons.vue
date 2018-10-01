<template>
  <i :class="`iconfont icon-${type}`" :style="styles"></i>
</template>

<script lang="ts">
import { Prop, Vue, Component, Watch } from 'vue-property-decorator'

@Component({
  name: 'Icons'
  })
export default class Icons extends Vue {
    @Prop({ required: true })
    type?:string
    @Prop({ default: '#5c6b77' })
    color?:string
    @Prop({ default: 16 })
    size?:number

    get styles () {
      return {
        fontSize: `${this.size}px`,
        color: this.color
      }
    }
}
</script>

<style>

</style>
