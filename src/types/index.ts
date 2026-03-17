export type Priority = 'high' | 'medium' | 'low'
export type Lang = 'zh' | 'en'
export type ToastType = 'info' | 'error' | 'success'

export interface Todo {
  text: string
  completed: boolean
  createdAt: string
  priority: Priority
  order: number
  time?: string
}

export interface DailyBucket {
  date: string
  tasks: Todo[]
}

export const PRIORITY_CONFIG: Record<Priority, { color: string; label: Record<Lang, string> }> = {
  high:   { color: '#ef4444', label: { zh: '高', en: 'High' } },
  medium: { color: '#f59e0b', label: { zh: '中', en: 'Med'  } },
  low:    { color: '#22c55e', label: { zh: '低', en: 'Low'  } },
}
