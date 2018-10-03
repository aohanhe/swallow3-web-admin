<template>
  <tables-page :showExportExcel="true" :columDefines="colums" :data="data"  :operColumDefines="opers" :total="total"
    @OnTableDelRow="onTableDelRow" @onPageDataRefresh="onPageDataRefresh" @OnClearQuery="onClearQuery"
    @OnAddNew="onAddNew" @onTableRowView="onViewData" @onTableRowEdit="onEditData"
  >
      <template slot="seacherbar" >
          <Input placeholder="姓名" v-model="query.query.name" style="width:150px"/>
      </template>
      <template slot="dialog">
        <dialog-demo ref="dlg" @onFreshDataList="doFecthDataFromServer"></dialog-demo>
      </template>
  </tables-page>
</template>
<script lang="ts">
import { Prop, Vue, Component, Watch } from 'vue-property-decorator'
import TablesPage, { OperationItem, PageInfo } from '../components/tables-page/tables-page.vue'
import { Query, ResponseDataPager } from '@/libs/request'
import { DataDialogMode, DataDialogOperts } from '@/views/components/data-dialog/data-dialog-def'
import Student, { StudentInfo, StudentPager } from '@/api/student'
import DialogDemo from './dialog-demo.vue'

@Component({
  name:"tableDemoPage",
  components:{TablesPage, DialogDemo}
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

    // 数据查看
    onViewData (row:any) {
      let dlg=(this.$refs.dlg as any) as DataDialogOperts
      dlg.showDlg(DataDialogMode.View, row)
    }

    // 新增数据操作
    onAddNew () {
      let dlg=(this.$refs.dlg as any) as DataDialogOperts
      dlg.showAddNewDlg()
    }

    // 修改数据
    onEditData (row:any) {
      let dlg=(this.$refs.dlg as any) as DataDialogOperts
      dlg.showDlg(DataDialogMode.Modi, row)
    }

    // 删除数据操作
    onTableDelRow (item:any) {
      alert(JSON.stringify(item))
    }
}
</script>
<style lang="less" scoped>
</style>
