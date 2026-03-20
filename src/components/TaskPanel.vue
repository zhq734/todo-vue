<script setup lang="ts">
import { nextTick } from 'vue'
import TaskItem from './TaskItem.vue'
import { PRIORITY_CONFIG } from '../types'
import type { Priority } from '../types'
import { useLang } from '../composables/useLang'
import { useTaskActions } from '../composables/useTaskActions'

const { t, formatDate, currentLang } = useLang()
const {
  selectedDate, tasks, statsTotal, statsCompleted, statsPending,
  toggleTask, removeTask,
  editingIndex, editText, startEdit, saveEdit, cancelEdit,
  setPriority,
  dragOverIndex, onDragStart, onDragOver, onDrop, onDragEnd,
  showAddDialog, newTaskText, newTaskPriority, newTaskTime, openAddDialog, confirmAdd,
} = useTaskActions()

async function handleOpenAdd() {
  openAddDialog()
  await nextTick()
  document.querySelector<HTMLInputElement>('.add-form-input')?.focus()
}
</script>

<template>
  <main class="main-panel">
    <div class="panel-header">
      <div class="panel-title">
        <h2>{{ t('myTasks') }}</h2>
        <span class="selected-date-label">{{ formatDate(selectedDate) }}</span>
      </div>
      <button v-if="!showAddDialog" class="btn-add-task" @click="handleOpenAdd">
        + {{ t('addTask') }}
      </button>
    </div>

    <!-- 外层裁剪，内层两视图并排平移 -->
    <div class="slide-outer" :class="{ 'show-form': showAddDialog }">
      <div class="view view-list">
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
              @drop="onDrop"
              @dragEnd="onDragEnd"
            />
          </ul>
          <div v-if="tasks.length === 0" class="empty-state">
            <div class="empty-icon">📋</div>
            <p class="empty-title">{{ t('noTasksDate') }}</p>
            <button class="btn-add-empty" @click="handleOpenAdd">+ {{ t('addToDate') }}</button>
          </div>
          <div v-if="statsTotal > 0" class="stats-bar">
            <span>{{ t('statsTotal') }}：<strong>{{ statsTotal }}</strong></span>
            <span class="stats-divider">|</span>
            <span class="stats-done">{{ t('statsDone') }}：<strong>{{ statsCompleted }}</strong></span>
            <span class="stats-divider">|</span>
            <span class="stats-pending">{{ t('statsPending') }}：<strong>{{ statsPending }}</strong></span>
          </div>
        </div>

        <!-- 新建表单 -->
        <div class="view view-form">
          <p class="form-date-hint">{{ formatDate(selectedDate) }}</p>
          <input
            class="add-form-input"
            :value="newTaskText"
            @input="newTaskText = ($event.target as HTMLInputElement).value"
            :placeholder="t('addTaskPlaceholder')"
            @keydown.enter="confirmAdd"
            @keydown.esc="showAddDialog = false"
          />
          <div class="form-row">
            <span class="row-label">{{ t('priority') }}</span>
            <div class="priority-options">
              <button
                v-for="p in (['high', 'medium', 'low'] as Priority[])"
                :key="p"
                :class="['priority-option', { active: newTaskPriority === p }]"
                :style="{
                  borderColor: PRIORITY_CONFIG[p].color,
                  background: newTaskPriority === p ? PRIORITY_CONFIG[p].color : 'transparent',
                  color: newTaskPriority === p ? 'white' : PRIORITY_CONFIG[p].color,
                }"
                @click="newTaskPriority = p"
              >{{ PRIORITY_CONFIG[p].label[currentLang] }}</button>
            </div>
          </div>
          <div class="form-row">
            <span class="row-label">{{ t('time') }}</span>
            <input
              type="time"
              :value="newTaskTime"
              @input="newTaskTime = ($event.target as HTMLInputElement).value"
              class="time-input"
            />
          </div>
          <div class="form-actions">
            <button class="btn-confirm" @click="confirmAdd">{{ t('save') }}</button>
            <button class="btn-cancel" @click="showAddDialog = false">{{ t('cancel') }}</button>
          </div>
        </div>

    </div>
  </main>
</template>

<style scoped>
.main-panel {
  background: var(--bg2); border: 1px solid var(--border); border-radius: 16px; padding: 24px;
}
.panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.panel-title { display: flex; align-items: baseline; gap: 10px; }
.panel-title h2 { font-size: 20px; font-weight: 700; }
.selected-date-label { font-size: 14px; color: var(--muted); }
.btn-add-task {
  padding: 8px 16px; border: none; border-radius: 10px; background: var(--primary);
  color: white; font-size: 14px; font-weight: 500; cursor: pointer; transition: background 0.15s;
}
.btn-add-task:hover { background: var(--primary-dark); }

/* 外层：裁剪溢出 */
.slide-outer { overflow: hidden; position: relative; }

/* 两视图切换时平移 */
.view {
  width: 100%;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s;
  will-change: transform, opacity;
}
/* 默认：列表正常流撑高度，表单绝对定位在右侧隐藏 */
.view-list { transform: translateX(0); opacity: 1; }
.view-form {
  position: absolute; top: 0; left: 0;
  transform: translateX(100%); opacity: 0;
  display: flex; flex-direction: column; gap: 14px;
}
/* show-form：列表绝对定位移出左侧，表单回到正常流撑高度 */
.slide-outer.show-form .view-list {
  position: absolute; top: 0; left: 0;
  transform: translateX(-100%); opacity: 0;
}
.slide-outer.show-form .view-form {
  position: relative;
  transform: translateX(0); opacity: 1;
}

/* 任务列表 */
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

/* 新建表单 */
.form-date-hint { font-size: 13px; color: var(--muted); }
.add-form-input {
  width: 100%; padding: 12px 14px; border: 1.5px solid var(--border); border-radius: 10px;
  background: var(--bg); color: var(--text); font-size: 15px; outline: none;
  transition: border-color 0.15s; font-family: inherit;
}
.add-form-input:focus { border-color: var(--primary); }
.form-row { display: flex; align-items: center; gap: 12px; }
.row-label { font-size: 13px; color: var(--text2); flex-shrink: 0; width: 44px; }
.priority-options { display: flex; gap: 8px; }
.priority-option {
  padding: 5px 14px; border-radius: 20px; border: 1.5px solid; font-size: 13px;
  font-weight: 500; cursor: pointer; transition: all 0.15s;
}
.time-input {
  padding: 6px 10px; border: 1.5px solid var(--border); border-radius: 8px;
  background: var(--bg); color: var(--text); font-size: 14px; outline: none;
  transition: border-color 0.15s; font-family: inherit;
}
.time-input:focus { border-color: var(--primary); }
.form-actions { display: flex; gap: 10px; }
.btn-confirm {
  padding: 9px 24px; border: none; border-radius: 9px; background: var(--primary);
  color: white; font-size: 14px; font-weight: 500; cursor: pointer; transition: background 0.15s;
}
.btn-confirm:hover { background: var(--primary-dark); }
.btn-cancel {
  padding: 9px 16px; border: 1px solid var(--border); border-radius: 9px;
  background: transparent; color: var(--text2); font-size: 14px; cursor: pointer; transition: all 0.15s;
}
.btn-cancel:hover { background: var(--bg3); }
</style>
