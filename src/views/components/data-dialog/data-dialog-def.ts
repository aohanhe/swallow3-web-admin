/**
 * 数据对话框的模式
 */
export enum DataDialogMode{
    AddNew=1,
    View,
    Modi
}

/**
 * 数据对话框可用操作
 */
export interface DataDialogOperts{
    showAddNewDlg: ()=>void
    showDlg:(mode:DataDialogMode, data:any)=>void

}
