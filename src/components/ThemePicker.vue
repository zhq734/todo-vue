<script setup lang="ts">
import { useTheme } from '../composables/useTheme'
import { useLang } from '../composables/useLang'

const { currentThemeId, colorMode, THEMES, setTheme, toggleMode } = useTheme()
const { currentLang } = useLang()
</script>

<template>
  <div class="theme-picker">
    <!-- 亮/暗切换 -->
    <button class="mode-btn" @click="toggleMode" :title="colorMode === 'light' ? '切换暗色' : '切换亮色'">
      {{ colorMode === 'light' ? '🌙' : '☀️' }}
    </button>

    <div class="divider"></div>

    <!-- 主题色点 -->
    <button
      v-for="theme in THEMES"
      :key="theme.id"
      :class="['theme-dot', { active: currentThemeId === theme.id }]"
      :style="{ background: theme.color }"
      :title="theme.name[currentLang]"
      @click="setTheme(theme.id)"
    >
      <span v-if="currentThemeId === theme.id" class="check">✓</span>
    </button>
  </div>
</template>

<style scoped>
.theme-picker {
  display: flex;
  align-items: center;
  gap: 8px;
}
.mode-btn {
  width: 32px; height: 32px; border-radius: 8px;
  border: 1.5px solid var(--border); background: var(--bg2);
  font-size: 16px; cursor: pointer; display: flex; align-items: center;
  justify-content: center; transition: all 0.15s; line-height: 1;
}
.mode-btn:hover { background: var(--bg3); transform: scale(1.1); }
.divider {
  width: 1px; height: 20px; background: var(--border);
}
.theme-dot {
  width: 24px; height: 24px; border-radius: 50%;
  border: 2px solid transparent; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: transform 0.15s, border-color 0.15s; padding: 0;
}
.theme-dot:hover { transform: scale(1.15); }
.theme-dot.active { border-color: var(--text); transform: scale(1.15); }
.check {
  color: white; font-size: 12px; font-weight: 700;
  line-height: 1; text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}
</style>
