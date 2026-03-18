import { ref } from 'vue'
import type { Lang } from '../types'

const langText = {
  zh: {
    title: '待办任务', calendarTitle: '日历', myTasks: '我的任务',
    addTask: '添加任务', addTaskPlaceholder: '添加新任务...',
    delete: '删除', edit: '编辑', cancel: '取消', save: '保存',
    toastEmpty: '任务内容不能为空', toastAddSuccess: '任务添加成功',
    toastDeleteSuccess: '任务已删除', toastEditSuccess: '任务已更新',
    noTasksDate: '该日期暂无任务', addToDate: '为此日期添加任务',
    today: '今天', priority: '优先级', time: '时间',
    weekNames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    viewMonth: '月', viewWeek: '周',
    statsTotal: '任务总数', statsDone: '已完成', statsPending: '待完成',
    exportTitle: '导出任务', exportDateFrom: '开始日期', exportDateTo: '结束日期',
    exportBtn: '导出 Excel', importBtn: '导入 Excel',
    importSuccess: '导入成功', importError: '导入失败，请检查文件格式',
    exportSuccess: '导出成功', exportNoData: '所选日期范围内没有任务',
    importConfirm: '导入将与现有任务合并，是否继续？',
    importDrop: '点击或拖拽 Excel 文件到此处',
  },
  en: {
    title: 'Todo List', calendarTitle: 'Calendar', myTasks: 'My Tasks',
    addTask: 'Add Task', addTaskPlaceholder: 'Add a new task...',
    delete: 'Delete', edit: 'Edit', cancel: 'Cancel', save: 'Save',
    toastEmpty: 'Task cannot be empty', toastAddSuccess: 'Task added',
    toastDeleteSuccess: 'Task deleted', toastEditSuccess: 'Task updated',
    noTasksDate: 'No tasks for this date', addToDate: 'Add task to this date',
    today: 'Today', priority: 'Priority', time: 'Time',
    weekNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    viewMonth: 'Month', viewWeek: 'Week',
    statsTotal: 'Total', statsDone: 'Done', statsPending: 'Pending',
    exportTitle: 'Export Tasks', exportDateFrom: 'From', exportDateTo: 'To',
    exportBtn: 'Export Excel', importBtn: 'Import Excel',
    importSuccess: 'Import successful', importError: 'Import failed, please check file format',
    exportSuccess: 'Export successful', exportNoData: 'No tasks in selected date range',
    importConfirm: 'Import will merge with existing tasks. Continue?',
    importDrop: 'Click or drag Excel file here',
  },
}

const currentLang = ref<Lang>('zh')

export function useLang() {
  const t = (key: string): any => (langText[currentLang.value] as any)[key] ?? key

  const switchLanguage = () => {
    currentLang.value = currentLang.value === 'zh' ? 'en' : 'zh'
  }

  const formatDate = (date: string) => {
    const [y, m, d] = date.split('-')
    return currentLang.value === 'zh' ? `${m}月${d}日` : `${m}/${d}/${y}`
  }

  return { currentLang, t, switchLanguage, formatDate }
}
