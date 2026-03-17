<script setup lang="ts">
import type { Todo, Priority } from '../types'
import { PRIORITY_CONFIG } from '../types'
import { useLang } from '../composables/useLang'

const { t, currentLang } = useLang()

defineProps<{
  task: Todo
  index: number
  editingIndex: number | null
  editText: string
  isDragOver: boolean
}>()

const emit = defineEmits<{
  toggle: [index: number]
  remove: [index: number]
  startEdit: [index: number]
  'update:editText': [value: string]
  saveEdit: []
  cancelEdit: []
  setPriority: [index: number, priority: Priority]
  dragStart: [index: number]
  dragOver: [e: DragEvent, index: number]
  drop: [index: number]
  dragEnd: []
}>()
</script>

<template>
  <li
    :class="['task-item', { completed: task.completed, 'drag-over': isDragOver }]"
    draggable="true"
    @dragstart="emit('dragStart', index)"
    @dragover="emit('dragOver', $event, index)"
    @drop="emit('drop', index)"
    @dragend="emit('dragEnd')"
  >
    <div class="priority-bar" :style="{ background: PRIORITY_CONFIG[task.priority].color }"></div>
    <div class="drag-handle">⠿</div>

    <div class="checkbox" @click="emit('toggle', index)">
      <span v-if="task.completed" class="check-icon">✓</span>
    </div>

    <div class="task-body">
      <div v-if="editingIndex === index" class="edit-row">
        <input
          :value="editText"
          @input="emit('update:editText', ($event.target as HTMLInputElement).value)"
          class="edit-input"
          @keydown.enter="emit('saveEdit')"
          @keydown.esc="emit('cancelEdit')"
          autofocus
        />
        <button class="btn-sm btn-save" @click="emit('saveEdit')">{{ t('save') }}</button>
        <button class="btn-sm btn-cancel" @click="emit('cancelEdit')">{{ t('cancel') }}</button>
      </div>
      <div v-else class="task-main">
        <span class="task-text">{{ task.text }}</span>
        <span
          class="priority-badge"
          :style="{
            background: PRIORITY_CONFIG[task.priority].color + '22',
            color: PRIORITY_CONFIG[task.priority].color,
            borderColor: PRIORITY_CONFIG[task.priority].color + '55'
          }"
        >{{ PRIORITY_CONFIG[task.priority].label[currentLang] }}</span>
        <span v-if="task.time" class="task-time">🕐 {{ task.time }}</span>
      </div>
    </div>

    <div v-if="editingIndex !== index" class="task-actions">
      <div class="priority-select">
        <button
          v-for="p in (['high', 'medium', 'low'] as Priority[])"
          :key="p"
          :class="['priority-dot-btn', { active: task.priority === p }]"
          :style="{ background: task.priority === p ? PRIORITY_CONFIG[p].color : 'transparent', borderColor: PRIORITY_CONFIG[p].color }"
          :title="PRIORITY_CONFIG[p].label[currentLang]"
          @click="emit('setPriority', index, p)"
        ></button>
      </div>
      <button class="btn-sm btn-edit" @click="emit('startEdit', index)">{{ t('edit') }}</button>
      <button class="btn-sm btn-delete" @click="emit('remove', index)">{{ t('delete') }}</button>
    </div>
  </li>
</template>

<style scoped>
.task-item {
  display: flex; align-items: center; gap: 12px; padding: 12px 16px;
  background: var(--bg); border: 1px solid var(--border); border-radius: 12px;
  transition: opacity 0.2s, box-shadow 0.15s; cursor: default;
}
.task-item.completed { opacity: 0.55; }
.task-item.completed .task-text { text-decoration: line-through; color: var(--muted); }
.task-item.drag-over { box-shadow: 0 0 0 2px var(--primary); background: var(--bg2); }
.priority-bar { width: 4px; height: 36px; border-radius: 4px; flex-shrink: 0; }
.drag-handle {
  color: var(--muted); font-size: 18px; cursor: grab; flex-shrink: 0;
  user-select: none; opacity: 0.5; transition: opacity 0.15s;
}
.task-item:hover .drag-handle { opacity: 1; }
.drag-handle:active { cursor: grabbing; }
.checkbox {
  width: 22px; height: 22px; border: 2px solid var(--border); border-radius: 6px;
  flex-shrink: 0; cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
}
.task-item.completed .checkbox { background: var(--success); border-color: var(--success); }
.check-icon { color: white; font-size: 13px; font-weight: 700; }
.task-body { flex: 1; min-width: 0; }
.task-main { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.task-text { font-size: 15px; word-break: break-word; }
.priority-badge {
  font-size: 11px; font-weight: 600; padding: 2px 7px; border-radius: 20px;
  border: 1px solid; flex-shrink: 0;
}
.task-time { font-size: 12px; color: var(--muted); flex-shrink: 0; }
.edit-row { display: flex; align-items: center; gap: 8px; }
.edit-input {
  flex: 1; padding: 6px 10px; border: 1.5px solid var(--primary); border-radius: 8px;
  background: var(--bg); color: var(--text); font-size: 14px; outline: none; font-family: inherit;
}
.task-actions { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
.priority-select { display: flex; gap: 4px; align-items: center; }
.priority-dot-btn {
  width: 12px; height: 12px; border-radius: 50%; border: 2px solid; cursor: pointer;
  transition: transform 0.15s; padding: 0;
}
.priority-dot-btn:hover { transform: scale(1.3); }
.priority-dot-btn.active { transform: scale(1.2); }
.btn-sm {
  padding: 5px 10px; border-radius: 7px; font-size: 12px; cursor: pointer;
  border: 1px solid var(--border); background: var(--bg2); color: var(--text2); transition: all 0.15s;
}
.btn-sm:hover { background: var(--bg3); }
.btn-save { background: var(--primary); color: white; border-color: var(--primary); }
.btn-save:hover { background: var(--primary-dark); }
.btn-delete:hover { background: var(--danger-soft); color: var(--danger); border-color: var(--danger); }
.btn-edit:hover { background: var(--primary); color: white; border-color: var(--primary); }
.btn-cancel { color: var(--muted); }
</style>
