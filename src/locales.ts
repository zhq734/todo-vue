export interface LocaleText {
  title: string
  subtitle: string
  addTask: string
  addTaskPlaceholder: string
  delete: string
  emptyTitle: string
  emptyDesc: string
  statsTotal: string
  statsCompleted: string
  statsPending: string
  toastEmpty: string
  toastAddSuccess: string
  toastDuplicate: string
  switchLang: string
}

export type Locale = 'zh' | 'en'

export const locales: Record<Locale, LocaleText> = {
  zh: {
    title: '待办任务',
    subtitle: '记录并完成任务，让每一天都更有序',
    addTask: '添加任务',
    addTaskPlaceholder: '添加新任务...',
    delete: '删除',
    emptyTitle: '暂无任务',
    emptyDesc: '在上面输入任务内容，按 Enter 键或点击添加，开始你的待办清单吧！',
    statsTotal: '任务总数：',
    statsCompleted: '已完成：',
    statsPending: '待完成：',
    toastEmpty: '任务内容不能为空',
    toastAddSuccess: '任务添加成功',
    toastDuplicate: '检测到重复任务！每个任务必须是唯一的。',
    switchLang: '切换语言'
  },
  en: {
    title: 'Todo List',
    subtitle: 'Track and complete tasks, keep your day organized',
    addTask: 'Add Task',
    addTaskPlaceholder: 'Add a new task...',
    delete: 'Delete',
    emptyTitle: 'No tasks yet',
    emptyDesc: 'Enter a task above, press Enter or click Add to start your todo list!',
    statsTotal: 'Total Tasks:',
    statsCompleted: 'Completed:',
    statsPending: 'Pending:',
    toastEmpty: 'Task content cannot be empty',
    toastAddSuccess: 'Task added successfully',
    toastDuplicate: 'Duplicate task detected! Each task must be unique.',
    switchLang: 'Switch Language'
  }
}
