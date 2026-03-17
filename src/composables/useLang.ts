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
