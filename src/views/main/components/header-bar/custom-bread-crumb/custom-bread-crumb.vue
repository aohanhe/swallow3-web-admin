<template>
  <div class="custom-bread-crumb">
    <Breadcrumb :style="{fontSize: `${fontSize}px`}">
      <BreadcrumbItem v-for="item in list" :to="item.to" :key="`bread-crumb-${item.name}`">
        <common-icon style="margin-right: 4px;" :type="item.icon || ''"/>
        {{ showTitle(item) }}
      </BreadcrumbItem>
    </Breadcrumb>
  </div>
</template>
<script lang="ts">
import { Prop, Vue, Component } from 'vue-property-decorator'
import { BreadCrumbList, BreadCrumbItem } from '@/libs/bread_crumbList'
import CommonIcon from '@/components/common-icon'
import './custom-bread-crumb.less'

@Component({
  name: 'customBreadCrumb',
  components:{CommonIcon}
  })
export default class CustomBreadCrumb extends Vue {
    @Prop({ default: () => [] })
    list?:Array<BreadCrumbItem>
    @Prop({ default: 14 })
    fontSize?:number
    @Prop({ default: false })
    showIcon?:boolean

    showTitle (item:BreadCrumbItem) {
      return BreadCrumbList.showTitle(item, Vue)
    }
    isCustomIcon (iconName:string) {
      return iconName.indexOf('_') === 0
    }
    getCustomIconName (iconName:string) {
      return iconName.slice(1)
    }
}
</script>
