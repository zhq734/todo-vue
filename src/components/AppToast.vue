<script setup lang="ts">
import type { ToastType } from '../types'

defineProps<{
  visible: boolean
  message: string
  type: ToastType
}>()
</script>

<template>
  <transition name="toast">
    <div v-if="visible" :class="['toast', `toast-${type}`]">
      <span>{{ type === 'error' ? '⚠️' : type === 'success' ? '✓' : 'ℹ️' }}</span>
      {{ message }}
    </div>
  </transition>
</template>

<style scoped>
.toast {
  position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
  padding: 12px 20px; border-radius: 12px; font-size: 14px; font-weight: 500;
  background: var(--bg); border: 1px solid var(--border);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  display: flex; align-items: center; gap: 8px; z-index: 200; white-space: nowrap;
}
.toast-success { border-color: var(--success); color: var(--success); }
.toast-error { border-color: var(--danger); color: var(--danger); }
.toast-enter-active, .toast-leave-active { transition: all 0.25s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(10px); }
</style>
