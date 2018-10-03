<template>
  <data-dialog title="学生数据" :width="500" ref="dlg" @OnDlgDataSave="onSaveData" @OnDlgDataSaveNew="onSaveNewData">
      <Form :model="dlgData" :rules="rules" :label-width="80" ref="dataForm">
          <FormItem label="姓名" prop="name">
              <Input placeholder="姓名" v-model="dlgData.name"/>
          </FormItem>
          <FormItem label="年龄" prop="age">
              <Input placeholder="年龄" v-model="dlgData.age"/>
          </FormItem>
          <FormItem label="电话" prop="phone">
              <Input placeholder="电话" v-model="dlgData.phone"/>
          </FormItem>
      </Form>
  </data-dialog>
</template>
<script lang="ts">
import { Prop, Vue, Component, Watch } from 'vue-property-decorator'
import DataDialog from '@/views/components/data-dialog/data-dialog.vue'
import DataDialogMix from '@/views/components/data-dialog/data-dialog-mix'
import { DataDialogMode } from '@/views/components/data-dialog/data-dialog-def'
import { Form } from 'iview'
import { StudentInfo } from '@/api/student'

@Component({name:"DemoDialog",
  components:{DataDialog},
  mixins:[DataDialogMix]
  })
export default class DemoDialog extends Vue {
    // 对话框数据
    dlgData?:StudentInfo={}

    rules={
      name: [{ required: true, min: 2, message: '名字不能为空,并至少2个字符', trigger: 'blur' }]
    }

    // 对dlgData进行监视，如果修改了提示要求保存
    @Watch('dlgData', {deep:true})
    onChangeDlgData () {
      let dlg=(this.$refs.dlg as DataDialog)
      dlg.setDataSaved(false)
    }

  // 表单数据检查,完成后执行相关操作
    doFormDataValidate (action:()=>void) {
      (this.$refs.dataForm as Form).validate(vaild => {
        if (vaild) {
          action()
        } else {
          this.$Message.error('数据校验失败,请更正')
        }
      })
    }

    // 保存新数增数据
    onSaveNewData () {
      this.doFormDataValidate(() => {
        alert('新增')
        let dlg=(this.$refs.dlg as DataDialog)
        dlg.setDataSaved(true)
        dlg.changeDlgMode(DataDialogMode.Modi);
        (this as any).freshDataList()
      })
    }

    // 保存数据
    onSaveData () {
      this.doFormDataValidate(() => {
        alert('保存')
        let dlg=(this.$refs.dlg as DataDialog)
        dlg.setDataSaved(true);
        (this as any).freshDataList()
      })
    }
}
</script>
<style lang="less" scoped>
</style>
