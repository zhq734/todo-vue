<script setup lang="ts">
import TaskItem from './TaskItem.vue'
import AddTaskDialog from './AddTaskDialog.vue'
import { useLang } from '../composables/useLang'
import { useTaskActions } from '../composables/useTaskActions'

const { t, formatDate } = useLang()
const {
  selectedDate, tasks, statsTotal, statsCompleted, statsPending,
  toggleTask, removeTask,
  editingIndex, editText, startEdit, saveEdit, cancelEdit,
  setPriority,
  dragOverIndex, onDragStart, onDragOver, onDrop, onDragEnd,
  showAddDialog, newTaskText, newTaskPriority, newTaskTime, openAddDialog, confirmAdd,
} = useTaskActions()
</script>

<template>
  <main class="main-panel">
    <div class="panel-header">
      <div class="panel-title">
        <h2>{{ t('myTasks') }}</h2>
        <span class="selected-date-label">{{ formatDate(selectedDate) }}</span>
      </div>
      <button class="btn-add-task" @click="openAddDialog">+ {{ t('addTask') }}</button>
    </div>

    <ul class="task-list">
      <TaskItem
        v-for="(task, index) in tasks"
        :key="index"
        :task="task"
        :index="index"
        :editingIndex="editingIndex"
        :editText="editText"
        :isDragOver="dragOverIndex === index"
        @toggle="toggleTask"
        @remove="removeTask"
        @startEdit="startEdit"
        @update:editText="editText = $event"
        @saveEdit="saveEdit"
        @cancelEdit="cancelEdit"
        @setPriority="setPriority"
        @dragStart="onDragStart"
        @dragOver="onDragOver"
        @drop="
onDrop"
        @dragEnd="onDragEnd"
      />
    </ul>

    <div v-if="tasks.length === 0" class="empty-state">
      <div class="empty-icon">📋</div>
      <p class="empty-title">{{ t('noTasksDate') }}</p>
      <button class="btn-add-empty" @click="openAddDialog">+ {{ t('addToDate') }}</button>
    </div>

    <div v-if="statsTotal > 0" class="stats-bar">
      <span>{{ t('statsTotal') }}：<strong>{{ statsTotal }}</strong></span>
      <span class="stats-divider">|</span>
      <span class="stats-done">{{ t('statsDone') }}：<strong>{{ statsCompleted }}</strong></span>
      <span class="stats-divider">|</span>
      <span class="stats-pending">{{ t('statsPending') }}：<strong>{{ statsPending }}</strong></span>
    </div>
  </main>

  <AddTaskDialog
    :show="showAddDialog"
    :selectedDate="selectedDate"
    :taskText="newTaskText"
    :priority="newTaskPriority"
    :time="newTaskTime"
    @update:taskText="newTaskText = $event"
    @update:priority="newTaskPriority = $event"
    @update:time="newTaskTime = $event"
    @confirm="confirmAdd"
    @close="showAddDialog = false"
  />
</template>

<style scoped>
.main-panel { background: var(--bg2); border: 1px solid var(--border); border-radius: 16px; padding: 24px; }
.panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.panel-title { display: flex; align-items: baseline; gap: 10px; }
.panel-title h2 { font-size: 20px; font-weight: 700; }
.selected-date-label { font-size: 14px; color: var(--muted); }
.btn-add-task {
  padding: 8px 16px; border: none; border-radius: 10px; background: var(--primary);
  color: white; font-size: 14px; font-weight: 500; cursor: pointer; transition: background 0.15s;
}
.btn-add-task:hover { background: var(--primary-dark); }
.task-list { list-style: none; display: flex; flex-direction: column; gap: 10px; }
.empty-state { text-align: center; padding: 48px 20px; }
.empty-icon { font-size: 40px; margin-bottom: 12px; }
.empty-title { color: var(--muted); font-size: 15px; margin-bottom: 16px; }
.btn-add-empty {
  padding: 10px 20px; border: 1.5px dashed var(--border); border-radius: 10px;
  background: transparent; color: var(--text2); font-size: 14px; cursor: pointer; transition: all 0.15s;
}
.btn-add-empty:hover { border-color: var(--primary); color: var(--primary); }
.stats-bar {
  display: flex; align-items: center; gap: 10px; padding: 12px 16px;
  background: var(--bg); border: 1px solid var(--border); border-radius: 10px;
  font-size: 13px; color: var(--text2); margin-top: 16px;
}
.stats-bar strong { color: var(--text); }
.stats-divider { color: var(--border); }
.stats-done strong { color: var(--success); }
.stats-pending strong { color: var(--dot); }
</style>
