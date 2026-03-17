import { ref } from 'vue'
import type { Todo, Priority } from '../types'

export type { Priority }

interface DailyBucket {
  date: string
  tasks: Todo[]
}

export default function useTodoStore() {
  const buckets = ref<Map<string, DailyBucket>>(new Map())

  const initStorage = () => {
    try {
      const bucketsData = localStorage.getItem('buckets')
      if (bucketsData) buckets.value = new Map(JSON.parse(bucketsData))
      // 兼容旧数据
      buckets.value.forEach(bucket => {
        bucket.tasks.forEach((t, i) => {
          if (!t.priority) t.priority = 'medium'
          if (t.order === undefined) t.order = i
        })
      })
    } catch (e) {
      console.error('Load error:', e)
      buckets.value.clear()
    }
  }

  const saveBuckets = () =>
    localStorage.setItem('buckets', JSON.stringify(Array.from(buckets.value.entries())))

  function addToDate(date: string, text: string, priority: Priority = 'medium', time?: string, toast?: (msg: string, type?: 'info' | 'error' | 'success') => void) {
    let bucket = buckets.value.get(date)
    if (!bucket) { bucket = { date, tasks: [] }; buckets.value.set(date, bucket) }
    if (bucket.tasks.some(t => t.text.toLowerCase() === text.toLowerCase())) {
      toast?.('已存在相同任务', 'error'); return false
    }
    bucket.tasks.push({ text, completed: false, createdAt: new Date().toISOString(), priority, order: bucket.tasks.length, time })
    saveBuckets(); return true
  }

  function toggleBucket(date: string, index: number) {
    const bucket = buckets.value.get(date)
    if (bucket) { bucket.tasks[index].completed = !bucket.tasks[index].completed; saveBuckets() }
  }

  function removeBucket(date: string, index: number) {
    const bucket = buckets.value.get(date)
    if (bucket) {
      bucket.tasks.splice(index, 1)
      if (bucket.tasks.length === 0) buckets.value.delete(date)
      saveBuckets()
    }
  }

  function editBucket(date: string, index: number, newText: string, toast?: (msg: string, type?: 'info' | 'error' | 'success') => void) {
    const bucket = buckets.value.get(date)
    if (!bucket) return false
    const text = newText.trim()
    if (!text) { toast?.('任务内容不能为空', 'error'); return false }
    if (bucket.tasks.some((t, i) => i !== index && t.text.toLowerCase() === text.toLowerCase())) {
      toast?.('已存在相同任务', 'error'); return false
    }
    bucket.tasks[index].text = text; saveBuckets(); return true
  }

  function setPriority(date: string, index: number, priority: Priority) {
    const bucket = buckets.value.get(date)
    if (bucket) { bucket.tasks[index].priority = priority; saveBuckets() }
  }

  function reorderBucket(date: string, fromIndex: number, toIndex: number) {
    const bucket = buckets.value.get(date)
    if (!bucket) return
    const [moved] = bucket.tasks.splice(fromIndex, 1)
    bucket.tasks.splice(toIndex, 0, moved)
    bucket.tasks.forEach((t, i) => { t.order = i })
    saveBuckets()
  }

  function getBucketTasks(date: string) { return buckets.value.get(date)?.tasks || [] }
  function hasTasks(date: string) { return buckets.value.has(date) && buckets.value.get(date)!.tasks.length > 0 }
  function getAllBuckets() { return Array.from(buckets.value.entries()).sort((a, b) => b[0].localeCompare(a[0])) }

  initStorage()
  return { buckets, addToDate, toggleBucket, removeBucket, editBucket, setPriority, reorderBucket, getBucketTasks, hasTasks, getAllBuckets }
}
