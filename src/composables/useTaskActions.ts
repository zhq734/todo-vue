import { ref, computed } from 'vue'
import type { Priority } from '../types'
import useTodoStore from '../stores/todo'
import { useLang } from './useLang'
import { useToast } from './useToast'
import { useCalendar } from './useCalendar'

export function useTaskActions() {
  const store = useTodoStore()
  const { t } = useLang()
  const { showToast } = useToast()
  const { selectedDate } = useCalendar()

  // ── 任务列表 & 统计 ──────────────────────────────────
  const tasks = computed(() => store.getBucketTasks(selectedDate.value))
  const statsTotal = computed(() => tasks.value.length)
  const statsCompleted = computed(() => tasks.value.filter(t => t.completed).length)
  const statsPending = computed(() => statsTotal.value - statsCompleted.value)

  // ── 勾选 / 删除 ──────────────────────────────────────
  function toggleTask(index: number) { store.toggleBucket(selectedDate.value, index) }
  function removeTask(index: number) {
    store.removeBucket(selectedDate.value, index)
    showToast(t('toastDeleteSuccess'), 'success')
  }

  // ── 编辑 ─────────────────────────────────────────────
  const editingIndex = ref<number | null>(null)
  const editText = ref('')

  function startEdit(index: number) { editingIndex.value = index; editText.value = tasks.value[index].text }
  function saveEdit() {
    if (editingIndex.value === null) return
    const text = editText.value.trim()
    if (!text) { showToast(t('toastEmpty'), 'error'); return }
    const ok = store.editBucket(selectedDate.value, editingIndex.value, text, (msg, type) => showToast(msg, type as any))
    if (ok) { showToast(t('toastEditSuccess'), 'success'); editingIndex.value = null }
  }
  function cancelEdit() { editingIndex.value = null }

  // ── 优先级 ────────────────────────────────────────────
  function setPriority(index: number, priority: Priority) { store.setPriority(selectedDate.value, index, priority) }

  // ── 拖拽排序 ──────────────────────────────────────────
  const dragFromIndex = ref<number | null>(null)
  const dragOverIndex = ref<number | null>(null)

  function onDragStart(index: number) { dragFromIndex.value = index }
  function onDragOver(e: DragEvent, index: number) { e.preventDefault(); dragOverIndex.value = index }
  function onDrop(toIndex: number) {
    if (dragFromIndex.value !== null && dragFromIndex.value !== toIndex)
      store.reorderBucket(selectedDate.value, dragFromIndex.value, toIndex)
    dragFromIndex.value = null; dragOverIndex.value = null
  }
  function onDragEnd() { dragFromIndex.value = null; dragOverIndex.value = null }

  // ── 添加任务 ──────────────────────────────────────────
  const showAddDialog = ref(false)
  const newTaskText = ref('')
  const newTaskPriority = ref<Priority>('medium')
  const newTaskTime = ref('')

  function openAddDialog() {
    newTaskText.value = ''
    newTaskPriority.value = 'medium'
    const now = new Date()
    newTaskTime.value = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    showAddDialog.value = true
  }
  function confirmAdd() {
    const text = newTaskText.value.trim()
    if (!text) { showToast(t('toastEmpty'), 'error'); return }
    const ok = store.addToDate(selectedDate.value, text, newTaskPriority.value, newTaskTime.value || undefined, (msg, type) => showToast(msg, type as any))
    if (ok) { showToast(t('toastAddSuccess'), 'success'); newTaskText.value = ''; showAddDialog.value = false }
  }

  return {
    selectedDate, tasks, statsTotal, statsCompleted, statsPending,
    toggleTask, removeTask,
    editingIndex, editText, startEdit, saveEdit, cancelEdit,
    setPriority,
    dragFromIndex, dragOverIndex, onDragStart, onDragOver, onDrop, onDragEnd,
    showAddDialog, newTaskText, newTaskPriority, newTaskTime, openAddDialog, confirmAdd,
  }
}
