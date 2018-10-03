<template>
  <Modal v-model="isShowDialog" :width="width" >
        <p slot="header" >
            <span>{{curTitle}}</span>
        </p>
        <slot></slot>
        <div slot="footer">
            <Button type="text" @click="onCancle">取消</Button>
            <Button type="info" @click="onSaveData" v-if="showSaveButton">{{saveBtnTitle}}</Button>
        </div>
    </Modal>
</template>
<script lang="ts">
/**
 * 用于显示数据的对话框
 */
import { Prop, Vue, Component, Watch } from 'vue-property-decorator'
import { DataDialogMode } from './data-dialog-def'
import { setTimeout } from 'timers'

@Component({
  name:"dataDialog",
  components:{}
  })
export default class DataDialog extends Vue {
    // 对话框当前的显示模式
    dlgMode?:DataDialogMode

    curTitle:string=''

    @Prop({ default: '' })
    title?:string

    @Prop({ default: 800 })
    width?:number

    saveBtnTitle:string='新增'

    wantSaveAlert:boolean = false

  // 显示开关
    isShowDialog:boolean=false

    showSaveButton:boolean=true

  // 是否显示保存按钮
    get isShowSaveBtn ():boolean {
      return this.dlgMode===DataDialogMode.AddNew||this.dlgMode===DataDialogMode.Modi
    }

  // 对话框的标题
    setCurTitle () {
      let title:string=''
      if (this.dlgMode===DataDialogMode.AddNew) title='新增'
      if (this.dlgMode===DataDialogMode.View) title='查看'
      if (this.dlgMode===DataDialogMode.Modi) title='修改'

      this.curTitle=`${title} ${this.title}`

      this.saveBtnTitle='保存'
      if (this.dlgMode===DataDialogMode.AddNew) {
        this.saveBtnTitle='新增'
      }
    }

  // 设置说明数据已经被保存
    setDataSaved (isSave:boolean) {
      this.wantSaveAlert=!isSave
    }

    showDlg (mode:DataDialogMode) {
      this.dlgMode = mode
      this.setCurTitle()
      this.isShowDialog =true
      this.showSaveButton=this.dlgMode!==DataDialogMode.View

      setTimeout(() => {
        this.setDataSaved(true)
      }, 200)
    }

    closeDlg () {
      this.isShowDialog =false
    }

    onCancle () {
      if (this.dlgMode!==DataDialogMode.View&&this.wantSaveAlert) {
        this.$Modal.confirm({
          title: '确认',
          content: '确认要关闭吗？修改的数据会被丢失!',
          onOk: () => { this.closeDlg() }
        })
      } else {
        this.closeDlg()
      }
    }

  // 保存操作
    onSaveData () {
      if (this.dlgMode===DataDialogMode.AddNew) {
        this.$emit('OnDlgDataSaveNew')
      } else {
        this.$emit('OnDlgDataSave')
      }
    }

  // 修改当前对话框的模式
    changeDlgMode (mode:DataDialogMode) {
      this.dlgMode = mode
      this.setCurTitle()
    }
}
</script>
<style lang="less" scoped>
</style>
