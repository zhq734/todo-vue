import { ref, watch } from 'vue'

export type ColorMode = 'light' | 'dark'

export interface Theme {
  id: string
  name: { zh: string; en: string }
  color: string
  vars: Record<string, string>
}

export const THEMES: Theme[] = [
  {
    id: 'blue',
    name: { zh: '海洋蓝', en: 'Ocean' },
    color: '#3b82f6',
    vars: { '--primary': 'oklch(0.60 0.22 250)', '--primary-dark': 'oklch(0.50 0.25 250)' },
  },
  {
    id: 'purple',
    name: { zh: '薰衣草', en: 'Lavender' },
    color: '#8b5cf6',
    vars: { '--primary': 'oklch(0.55 0.25 295)', '--primary-dark': 'oklch(0.45 0.28 295)' },
  },
  {
    id: 'green',
    name: { zh: '抹茶绿', en: 'Matcha' },
    color: '#10b981',
    vars: { '--primary': 'oklch(0.60 0.18 160)', '--primary-dark': 'oklch(0.50 0.20 160)' },
  },
  {
    id: 'rose',
    name: { zh: '玫瑰红', en: 'Rose' },
    color: '#f43f5e',
    vars: { '--primary': 'oklch(0.58 0.24 10)', '--primary-dark': 'oklch(0.48 0.26 10)' },
  },
  {
    id: 'amber',
    name: { zh: '琥珀橙', en: 'Amber' },
    color: '#f59e0b',
    vars: { '--primary': 'oklch(0.70 0.18 75)', '--primary-dark': 'oklch(0.60 0.20 75)' },
  },
]

const MODE_VARS: Record<ColorMode, Record<string, string>> = {
  light: {
    '--bg':           'oklch(0.98 0.01 240)',
    '--bg2':          'oklch(0.95 0.02 240)',
    '--bg3':          'oklch(0.92 0.03 240)',
    '--text':         'oklch(0.18 0.02 240)',
    '--text2':        'oklch(0.40 0.03 240)',
    '--muted':        'oklch(0.60 0.02 240)',
    '--border':       'oklch(0.88 0.02 240)',
    '--danger-soft':  'oklch(0.92 0.08 20)',
  },
  dark: {
    '--bg':           'oklch(0.12 0.02 240)',
    '--bg2':          'oklch(0.16 0.03 240)',
    '--bg3':          'oklch(0.20 0.04 240)',
    '--text':         'oklch(0.90 0.02 240)',
    '--text2':        'oklch(0.65 0.03 240)',
    '--muted':        'oklch(0.50 0.02 240)',
    '--border':       'oklch(0.28 0.03 240)',
    '--danger-soft':  'oklch(0.22 0.08 20)',
  },
}

const currentThemeId = ref(localStorage.getItem('theme') ?? 'blue')
const colorMode = ref<ColorMode>((localStorage.getItem('colorMode') as ColorMode) ?? 'light')

function applyAll() {
  const root = document.documentElement
  const theme = THEMES.find(t => t.id === currentThemeId.value) ?? THEMES[0]
  // 主题色
  Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v))
  // 亮/暗背景色
  Object.entries(MODE_VARS[colorMode.value]).forEach(([k, v]) => root.style.setProperty(k, v))
  // data 属性（方便外部 CSS 选择器使用）
  root.setAttribute('data-mode', colorMode.value)
}

// 初始化
applyAll()

watch([currentThemeId, colorMode], () => {
  applyAll()
  localStorage.setItem('theme', currentThemeId.value)
  localStorage.setItem('colorMode', colorMode.value)
})

export function useTheme() {
  function setTheme(id: string) { currentThemeId.value = id }
  function toggleMode() { colorMode.value = colorMode.value === 'light' ? 'dark' : 'light' }

  return { currentThemeId, colorMode, THEMES, setTheme, toggleMode }
}
