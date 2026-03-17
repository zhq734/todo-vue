import { ref } from 'vue'
import type { ToastType } from '../types'

const toast = ref<{ message: string; type: ToastType; visible: boolean }>({
  message: '', type: 'info', visible: false,
})

export function useToast() {
  function showToast(message: string, type: ToastType = 'info') {
    toast.value = { message, type, visible: true }
    setTimeout(() => { toast.value.visible = false }, 2200)
  }

  return { toast, showToast }
}
