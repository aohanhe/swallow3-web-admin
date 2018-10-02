<template>
  <div>
     这是首页
  </div>
</template>

<script lang="ts">
import { Prop, Vue, Component, Watch } from 'vue-property-decorator'

@Component({
  name: 'mainhome'
  })
export default class MainHome extends Vue {

}
</script>

<style lang="less">
.count-style{
  font-size: 50px;
}
</style>
