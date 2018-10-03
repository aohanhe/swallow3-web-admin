/**
 * 数据对话框 共用属性与操作
 */
import { Prop, Vue, Component } from 'vue-property-decorator'
import { objectCopy } from '@/libs/common-tools.js'
import { DataDialogOperts, DataDialogMode } from '@/views/components/data-dialog/data-dialog-def'

@Component({
  components:{}
  })
export default class DataDialogMix extends Vue implements DataDialogOperts {
  /**
   * 显示新增对话框
   */
  showAddNewDlg () {
    let dlg=this.$refs.dlg as any
    let that=this as any
    that.dlgData={} // 清空初始数据

    dlg.showDlg(DataDialogMode.AddNew)
  }

  /**
   * 显示指定模式的对话框
   * @param mode
   * @param data
   */
  showDlg (mode:DataDialogMode, data:any) {
    let dlg=this.$refs.dlg as any
    let that=this as any

    that.dlgData=objectCopy(data)
    dlg.showDlg(mode)
  }

  // 刷新打开对应的数据列表的数据
  freshDataList () {
    console.log('dofresh')
    this.$emit('onFreshDataList')
  }
}
