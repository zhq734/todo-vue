<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLang } from '../composables/useLang'
import { exportToExcel, importFromExcel } from '../composables/useImportExport'
import useTodoStore from '../stores/todo'
import { useToast } from '../composables/useToast'
import type { Priority } from '../types'

const props = defineProps<{ show: boolean }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const { t, currentLang } = useLang()
const { buckets, addToDate } = useTodoStore()
const { showToast } = useToast()

// 默认日期范围：本月第一天到今天
const today = new Date().toISOString().slice(0, 10)
const firstOfMonth = today.slice(0, 8) + '01'
const fromDate = ref(firstOfMonth)
const toDate = ref(today)

const tab = ref<'export' | 'import'>('export')
const isDragging = ref(false)
const importFile = ref<File | null>(null)
const fileInput = ref<HTMLInputElement>()

const bucketCount = computed(() => {
  return Array.from(buckets.value.keys()).filter(d => d >= fromDate.value && d <= toDate.value).length
})

function handleExport() {
  const ok = exportToExcel(buckets.value, fromDate.value, toDate.value, currentLang.value)
  if (ok) {
    showToast(t('exportSuccess'), 'success')
    emit('close')
  } else {
    showToast(t('exportNoData'), 'error')
  }
}

function onFileChange(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  if (f) importFile.value = f
}

function onDrop(e: DragEvent) {
  isDragging.value = false
  const f = e.dataTransfer?.files?.[0]
  if (f && f.name.endsWith('.xlsx')) importFile.value = f
}

async function handleImport() {
  if (!importFile.value) return
  try {
    const bucketList = await importFromExcel(importFile.value)
    let added = 0
    for (const bucket of bucketList) {
      for (const task of bucket.tasks) {
        const ok = addToDate(bucket.date, task.text, task.priority as Priority, task.time)
        if (ok) added++
      }
    }
    showToast(`${t('importSuccess')} (+${added})`, 'success')
    importFile.value = null
    emit('close')
  } catch {
    showToast(t('importError'), 'error')
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="overlay" @click.self="emit('close')">
      <div class="dialog">
        <div class="dialog-header">
          <div class="tabs">
            <button :class="['tab', tab === 'export' && 'active']" @click="tab = 'export'">
              📤 {{ t('exportBtn') }}
            </button>
            <button :class="['tab', tab === 'import' && 'active']" @click="tab = 'import'">
              📥 {{ t('importBtn') }}
            </button>
          </div>
          <button class="close-btn" @click="emit('close')">✕</button>
        </div>

        <!-- 导出 -->
        <div v-if="tab === 'export'" class="dialog-body">
          <div class="field-row">
            <label>{{ t('exportDateFrom') }}</label>
            <input type="date" v-model="fromDate" :max="toDate" />
          </div>
          <div class="field-row">
            <label>{{ t('exportDateTo') }}</label>
            <input type="date" v-model="toDate" :min="fromDate" />
          </div>
          <p class="hint">{{ bucketCount }} 个日期有任务数据</p>
          <button class="btn-primary" @click="handleExport">
            📤 {{ t('exportBtn') }}
          </button>
        </div>

        <!-- 导入 -->
        <div v-if="tab === 'import'" class="dialog-body">
          <div
            class="drop-zone"
            :class="{ dragging: isDragging }"
            @dragover.prevent="isDragging = true"
            @dragleave="isDragging = false"
            @drop.prevent="onDrop"
            @click="fileInput?.click()"
          >
            <span v-if="!importFile">📂 {{ t('importDrop') }}</span>
            <span v-else class="file-name">📄 {{ importFile.name }}</span>
          </div>
          <input ref="fileInput" type="file" accept=".xlsx" style="display:none" @change="onFileChange" />
          <p class="hint">{{ t('importConfirm') }}</p>
          <button class="btn-primary" :disabled="!importFile" @click="handleImport">
            📥 {{ t('importBtn') }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.4);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
}
.dialog {
  background: var(--bg2); border: 1px solid var(--border); border-radius: 16px;
  width: 380px; padding: 24px; box-shadow: 0 8px 32px rgba(0,0,0,0.15);
}
.dialog-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.tabs { display: flex; gap: 8px; }
.tab {
  padding: 7px 14px; border: 1.5px solid var(--border); border-radius: 8px;
  background: var(--bg); color: var(--text2); font-size: 13px; cursor: pointer; transition: all 0.15s;
}
.tab.active { background: var(--primary); color: white; border-color: var(--primary); }
.close-btn {
  background: none; border: none; font-size: 16px; color: var(--muted); cursor: pointer; padding: 4px 8px;
}
.dialog-body { display: flex; flex-direction: column; gap: 14px; }
.field-row { display: flex; align-items: center; gap: 12px; }
.field-row label { font-size: 13px; color: var(--text2); width: 70px; flex-shrink: 0; }
.field-row input[type="date"] {
  flex: 1; padding: 8px 10px; border: 1.5px solid var(--border); border-radius: 8px;
  background: var(--bg); color: var(--text); font-size: 13px;
}
.hint { font-size: 12px; color: var(--muted); }
.btn-primary {
  padding: 10px; border: none; border-radius: 10px; background: var(--primary);
  color: white; font-size: 14px; font-weight: 500; cursor: pointer; transition: background 0.15s;
}
.btn-primary:hover:not(:disabled) { background: var(--primary-dark); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.drop-zone {
  border: 2px dashed var(--border); border-radius: 10px; padding: 32px 16px;
  text-align: center; cursor: pointer; color: var(--text2); font-size: 14px;
  transition: all 0.15s; background: var(--bg);
}
.drop-zone:hover, .drop-zone.dragging { border-color: var(--primary); color: var(--primary); background: var(--bg3); }
.file-name { color: var(--primary); font-weight: 500; }
</style>
