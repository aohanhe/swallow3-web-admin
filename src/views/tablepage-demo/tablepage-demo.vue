<template>
  <tables-page :showExportExcel="true" :columDefines="colums" :data="data"  :operColumDefines="opers" :total="total"
    @OnTableDelRow="onTableRow" @onPageDataRefresh="onPageDataRefresh" @OnClearQuery="onClearQuery"
  >
      <template slot="seacherbar" >
          <Input placeholder="姓名" v-model="query.query.name" style="width:150px"/>
      </template>
  </tables-page>
</template>
<script lang="ts">
import { Prop, Vue, Component, Watch } from 'vue-property-decorator'
import TablesPage, { OperationItem, PageInfo } from '../components/tables-page/tables-page.vue'
import { Query, ResponseDataPager } from '@/libs/request'
import Student, { StudentInfo, StudentPager } from '@/api/student'

@Component({
  name:"tableDemoPage",
  components:{TablesPage}
  })
export default class TableDemoPage extends Vue {
    colums=[
      {
        title: '姓名',
        key: 'name'
      },
      {
        title: '年龄',
        key: 'age'
      },
      {
        title: '城市',
        key: 'city'
      },
      {
        title: '电话',
        key: 'phone'
      },
      {
        title: '成绩',
        key: 'score'
      }

    ]

    data:Array<StudentInfo>=[]

    total:number=0

  // 查询对象
    query:Query<StudentInfo>={
      page: 1,
      pageSize: 10,
      query: {
        name: ''
      },
      sorts: []
    }

    opers:Array<OperationItem>=[{
      icon: 'ios-add-circle',
      action: (item:any) => { alert(item) }
    }]

    onTableRow (item:any) {
      alert(JSON.stringify(item))
    }

  // 从服务器提取数据
    doFecthDataFromServer () {
      this.$Loading.start()
      Student.fecthList(this.query)
        .then(rep => {
          let list=rep.data as ResponseDataPager<StudentInfo>
          this.total = list.total
          this.data = list.items
        }).catch(ex => {
          this.$Loading.error()
          // 提示操作失败
          this.$Notice.error({
            title: '服务请求失败',
            desc: ex.message
          })
        }).finally(() => {
          this.$Loading.finish()
        })
    }

  // 页面刷新请求处理
    onPageDataRefresh (pager:PageInfo) {
      this.query.page=pager.curPage
      this.query.pageSize=pager.pageSize

      console.log(`要求加载 第${pager.curPage}的,每页数据要求${pager.pageSize}条记录`)

      this.doFecthDataFromServer()
    }

  // 清除查询
    onClearQuery () {
      this.query.query={}
      this.doFecthDataFromServer()
    }
}
</script>
<style lang="less" scoped>
</style>
