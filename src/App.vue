<script setup lang="ts">
import CalendarPanel from './components/CalendarPanel.vue'
import TaskPanel from './components/TaskPanel.vue'
import AppToast from './components/AppToast.vue'
import ThemePicker from './components/ThemePicker.vue'
import ImportExportDialog from './components/ImportExportDialog.vue'
import { ref } from 'vue'
import { useLang } from './composables/useLang'
import { useToast } from './composables/useToast'

const { t, currentLang, switchLanguage } = useLang()
const { toast } = useToast()
const showImportExport = ref(false)
</script>

<template>
  <div class="container">
    <header class="header">
      <h1>{{ t('title') }}</h1>
      <div class="header-actions">
        <ThemePicker />
        <button class="lang-toggle" @click="showImportExport = true">
          📊 {{ currentLang === 'zh' ? '导入/导出' : 'Import/Export' }}
        </button>
        <button class="lang-toggle" @click="switchLanguage">
          🌐 {{ currentLang === 'zh' ? 'EN' : '中文' }}
        </button>
      </div>
    </header>

    <div class="main-content">
      <CalendarPanel />
      <TaskPanel />
    </div>

    <AppToast :visible="toast.visible" :message="toast.message" :type="toast.type" />
    <ImportExportDialog :show="showImportExport" @close="showImportExport = false" />
  </div>
</template>

<style>
:root {
  --primary: oklch(0.60 0.22 250);
  --primary-dark: oklch(0.50 0.25 250);
  --bg: oklch(0.98 0.01 240);
  --bg2: oklch(0.95 0.02 240);
  --bg3: oklch(0.92 0.03 240);
  --text: oklch(0.18 0.02 240);
  --text2: oklch(0.40 0.03 240);
  --muted: oklch(0.60 0.02 240);
  --border: oklch(0.88 0.02 240);
  --success: oklch(0.58 0.18 140);
  --danger: oklch(0.58 0.20 20);
  --danger-soft: oklch(0.92 0.08 20);
  --dot: oklch(0.60 0.22 20);
}
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--bg); color: var(--text);
  min-height: 100vh; padding: 24px; -webkit-font-smoothing: antialiased;
}
.container { max-width: 1200px; margin: 0 auto; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.header h1 { font-size: 28px; font-weight: 700; letter-spacing: -0.02em; }
.header-actions { display: flex; align-items: center; gap: 12px; }
.lang-toggle {
  padding: 8px 16px; border: 1.5px solid var(--border); border-radius: 10px;
  background: var(--bg2); color: var(--text); font-size: 13px; cursor: pointer; transition: all 0.2s;
}
.lang-toggle:hover { background: var(--bg3); }
.main-content { display: grid; grid-template-columns: 340px 1fr; gap: 20px; align-items: start; }
</style>
