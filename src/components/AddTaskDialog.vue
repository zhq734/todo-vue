<script setup lang="ts">
import type { Priority } from '../types'
import { PRIORITY_CONFIG } from '../types'
import { useLang } from '../composables/useLang'

const { t, currentLang, formatDate } = useLang()

const props = defineProps<{
  show: boolean
  selectedDate: string
  taskText: string
  priority: Priority
  time: string
}>()

const emit = defineEmits<{
  'update:taskText': [value: string]
  'update:priority': [value: Priority]
  'update:time': [value: string]
  'confirm': []
  'close': []
}>()
</script>

<template>
  <div v-if="show" class="dialog-mask" @click.self="emit('close')">
    <div class="dialog">
      <h3>{{ t('addToDate') }} · {{ formatDate(selectedDate) }}</h3>

      <input
        :value="taskText"
        @input="emit('update:taskText', ($event.target as HTMLInputElement).value)"
        class="dialog-input"
        :placeholder="t('addTaskPlaceholder')"
        @keydown.enter="emit('confirm')"
        autofocus
      />

      <div class="dialog-row">
        <span class="row-label">{{ t('priority') }}</span>
        <div class="priority-options">
          <button
            v-for="p in (['high', 'medium', 'low'] as Priority[])"
            :key="p"
            :class="['priority-option', { active: priority === p }]"
            :style="{
              borderColor: PRIORITY_CONFIG[p].color,
              background: priority === p ? PRIORITY_CONFIG[p].color : 'transparent',
              color: priority === p ? 'white' : PRIORITY_CONFIG[p].color
            }"
            @click="emit('update:priority', p)"
          >{{ PRIORITY_CONFIG[p].label[currentLang] }}</button>
        </div>
      </div>

      <div class="dialog-row">
        <span class="row-label">{{ t('time') }}</span>
        <input
          type="time"
          :value="time"
          @input="emit('update:time', ($event.target as HTMLInputElement).value)"
          class="time-input"
        />
      </div>

      <div class="dialog-actions">
        <button class="btn-confirm" @click="emit('confirm')">{{ t('save') }}</button>
        <button class="btn-cancel-dialog" @click="emit('close')">{{ t('cancel') }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dialog-mask {
  position: fixed; inset: 0; background: rgba(0,0,0,0.4);
  display: flex; align-items: center; justify-content: center; z-index: 100;
}
.dialog {
  background: var(--bg); border-radius: 16px; padding: 28px; width: 380px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
}
.dialog h3 { font-size: 16px; font-weight: 600; margin-bottom: 16px; }
.dialog-input {
  width: 100%; padding: 12px 14px; border: 1.5px solid var(--border); border-radius: 10px;
  background: var(--bg2); color: var(--text); font-size: 15px; outline: none;
  transition: border-color 0.15s; margin-bottom: 14px; font-family: inherit;
}
.dialog-input:focus { border-color: var(--primary); }
.dialog-row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.row-label { font-size: 13px; color: var(--text2); flex-shrink: 0; width: 40px; }
.priority-options { display: flex; gap: 8px; }
.priority-option {
  padding: 5px 14px; border-radius: 20px; border: 1.5px solid; font-size: 13px;
  font-weight: 500; cursor: pointer; transition: all 0.15s;
}
.time-input {
  padding: 6px 10px; border: 1.5px solid var(--border); border-radius: 8px;
  background: var(--bg2); color: var(--text); font-size: 14px; outline: none;
  transition: border-color 0.15s; font-family: inherit;
}
.time-input:focus { border-color: var(--primary); }
.dialog-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 16px; }
.btn-confirm {
  padding: 9px 20px; border: none; border-radius: 9px; background: var(--primary);
  color: white; font-size: 14px; font-weight: 500; cursor: pointer; transition: background 0.15s;
}
.btn-confirm:hover { background: var(--primary-dark); }
.btn-cancel-dialog {
  padding: 9px 16px; border: 1px solid var(--border); border-radius: 9px;
  background: transparent; color: var(--text2); font-size: 14px; cursor: pointer; transition: all 0.15s;
}
.btn-cancel-dialog:hover { background: var(--bg2); }
</style>
