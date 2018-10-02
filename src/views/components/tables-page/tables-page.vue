<template>

        <Card>
            <!-- 查询条部分 -->
            <Card :bordered="false">
                <p slot="title" style="height:30px">查询条件&nbsp;&nbsp;
                    <Button icon="ios-close" size="small" type="info" shape="circle"  @click="clearQuery"></Button></p>
                <Layout class="seacher_bar">
                    <Content >
                        <slot name="seacherbar" ></slot>
                    </Content>
                    <Sider hide-trigger class="seacher_bar_tool" :width="280">

                        <Button type="primary" @click="reqestPageData(pageInfo)">搜&nbsp;索</Button>
                        <Button type="primary" v-if="showAddBtn" @click="addNew">新&nbsp;增</Button>
                        <Button type="warning" v-if="showDelBtn" @click="delteAllSelRow">删&nbsp;除</Button>

                    </Sider>
                </Layout>
            </Card>

            <!-- 数据表格部分-->
            <Table :columns="colums" :data="dataList" stripe ref="dataTable"
                @on-selection-change="onSelectChange"
            ></Table>

            <!-- 分页操作部分-->
            <Layout class="footer_panel">
                <Sider hide-trigger  :width="280" >
                    <!-- 底部的操作面版 -->
                    <div class="footer_panel_tool">
                        <slot name="footerbar"></slot>
                        <Button type="primary" v-if="showExportExcel" @click="exportSvc">导出execl</Button>
                    </div>
                </Sider>
                <!-- 底部的分页面版 -->
                <Content class="footer_panel_context">
                    <Page ref="Pager" :total="total" size="small" show-elevator show-sizer show-total
                     @on-change="onPageChange" @on-page-size-change="onPageSizeChange"/>
                </Content>
            </Layout>
        </Card>

</template>
<script lang="ts">
import { Prop, Vue, Component, Watch, Emit } from 'vue-property-decorator'
import { Page, Table } from 'iview'

// 操作定义接口
export interface OperationItem{
    icon:string
    action:(item:any)=>void
}

// 表格分页信息
export interface PageInfo{
    curPage:number
    pageSize:number
}

@Component({name:"TablePage"})
export default class TablePage extends Vue {
  // 是否显示添加按钮
    @Prop({ default: true })
    showAddBtn?:boolean

  // 是否显示删除按钮
    @Prop({ default: true })
    showDelBtn?:boolean

  // 是否显示导出excel表btn
    @Prop({ default: false })
    showExportExcel?:boolean

  // 是否显示选择列
    @Prop({ default: true })
    showSelectColum?:boolean

  // 列定义
    @Prop({ default: () => [] })
    columDefines?:Array<any>

  // 自定义的操作列列表
    @Prop({ default: () => [] })
    operColumDefines?:Array<OperationItem>

    @Prop({ default: () => [] })
    data?:Array<any>

    // 列表数据的总数
    @Prop({ default: 0 })
    total?:number

  // 取得当前的操作列
    get colums () {
      if (this.showSelectColum&&this.columDefines) {
        let defs:Array<any>=[{
          type: 'selection',
          width: 60,
          align: 'center'
        }]

        let opers:Array<OperationItem>=[{
          icon: 'md-eye',
          action: this.viewRow
        }]

        if (this.operColumDefines&&this.operColumDefines.length!==0) {
          opers = opers.concat(this.operColumDefines)
        }

        // 如果显示删除按钮则与在操作条中显示删除
        if (this.showDelBtn) {
          opers.push({
            icon: 'md-trash',
            action: this.deleteRow
          })
        }

        // 生成操作条
        let opertorDefs=[{
          title: '操作',
          key: 'action',
          width: 60*opers.length,
          align: 'center',
          render: (h:any, params:any) => {
            let list=opers.map((item) => {
              return h('Button', {
                props: {
                  icon: item.icon,
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    // 以下为查看操作
                    item.action(params.row)
                  }
                }
              })
            })

            return h('div', list)
          }
        }]

        // 将操作条加入到列中
        return defs.concat(this.columDefines, opertorDefs)
      }
      return this.columDefines
    }

  // 创建一个操作按钮
    private createOperAction (h:any, params:any, icon:string, action:(item:any)=>void) {
      return h('Button', {
        props: {
          icon: icon,
          size: '20'
        },
        on: {
          click: () => {
            // 以下为删除操作
            action(params.row)
          }
        }
      })
    }

    get dataList () {
      return this.data
    }

  // 当前选择了的列表
    selecLists?:Array<any>
    onSelectChange (selection:Array<any>, row:any) {
      this.selecLists=selection
    }

    // 数据查看操作
    viewRow (data:any) {

    }

  // 清除查询条件
    clearQuery () {
      this.$emit('OnClearQuery')
    }

    // 导出列表数据
    exportSvc () {
      (this.$refs.dataTable as Table).exportCsv({})
    }

    // 添加新的数据
    addNew () {
      this.$emit('OnAddNew')
    }

    // 以下为数据删除操作
    deleteRow (data:any) {
      this.$Modal.confirm({
        title: '提醒',
        content: '确定要删除这些数据吗，操作将永久删除!',
        onOk: () => {
          this.$emit('OnTableDelRow', [data])
        }
      })
    }

  // 所有列删除事件
    delteAllSelRow () {
      if (this.selecLists&&this.selecLists.length) {
        this.$Modal.confirm({
          title: '提醒',
          content: '确定要删除这些数据吗，操作将永久删除!',
          onOk: () => {
            this.$emit('OnTableDelRow', this.selecLists)
          }
        })
      }
    }

    pageInfo:PageInfo={
      curPage: 1,
      pageSize: 10
    }

  // 当页号跳转时
    onPageChange (newPage:number) {
      this.pageInfo.curPage=newPage
      this.reqestPageData()
    }
  // 当页面大小改变时
    onPageSizeChange (newPageSize:number) {
      this.pageInfo.pageSize=newPageSize
      this.reqestPageData()
    }

    @Emit('onPageDataRefresh')
    reqestPageData () {
      return this.pageInfo
    }

    // 处理组件事件
    // 在组件初始化时 自动加载数据
    created () {
      this.reqestPageData()
    }
}
</script>
<style lang="less" scoped>
    .seacher_bar{
        background-color: white
    }

    // 设置搜索条中的布局
    .seacher_bar_tool{
        background-color: white;
        height: 50px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-around;
        align-items: center;
    }
    .seacher_bar_tool button{
        margin: 5px;
    }

    @foot-bar-height:50px;

    //底部面版设置
    .footer_panel{
        height: @foot-bar-height
    }

    .footer_panel_context{
        background-color: white;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

    //设置底部的操作面版
    .footer_panel_tool{
        height: @foot-bar-height;
        background-color: white;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

</style>
