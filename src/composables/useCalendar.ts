import { ref, computed, watch } from 'vue'
import { useLang } from './useLang'

export function getToday() {
  return new Date().toISOString().split('T')[0]
}

function getWeekStartOf(dateStr: string) {
  const d = new Date(dateStr)
  d.setDate(d.getDate() - d.getDay())
  return d.toISOString().split('T')[0]
}

// 模块级单例，CalendarPanel 和 TaskPanel 共享同一个 selectedDate
const selectedDate = ref(getToday())

export function useCalendar() {
  const { currentLang, t } = useLang()

  const viewMode = ref<'month' | 'week'>('month')

  // ── 月视图 ──────────────────────────────────────────
  const calYear = ref(new Date().getFullYear())
  const calMonth = ref(new Date().getMonth())

  const monthLabel = computed(() => {
    return currentLang.value === 'zh'
      ? `${calYear.value}年 ${calMonth.value + 1}月`
      : `${calYear.value} / ${calMonth.value + 1}`
  })

  const monthDays = computed(() => {
    const year = calYear.value
    const month = calMonth.value
    const firstDow = new Date(year, month, 1).getDay()
    const lastDate = new Date(year, month + 1, 0).getDate()
    const days: Array<{ date: string; inMonth: boolean }> = []

    const prevLast = new Date(year, month, 0).getDate()
    for (let i = firstDow - 1; i >= 0; i--) {
      const d = prevLast - i
      const m = month === 0 ? 12 : month
      const y = month === 0 ? year - 1 : year
      days.push({ date: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`, inMonth: false })
    }
    for (let i = 1; i <= lastDate; i++) {
      days.push({ date: `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`, inMonth: true })
    }
    const next = 42 - days.length
    for (let i = 1; i <= next; i++) {
      const m = month === 11 ? 1 : month + 2
      const y = month === 11 ? year + 1 : year
      days.push({ date: `${y}-${String(m).padStart(2, '0')}-${String(i).padStart(2, '0')}`, inMonth: false })
    }
    return days
  })

  function prevMonth() {
    if (calMonth.value === 0) { calMonth.value = 11; calYear.value-- }
    else calMonth.value--
  }
  function nextMonth() {
    if (calMonth.value === 11) { calMonth.value = 0; calYear.value++ }
    else calMonth.value++
  }

  // ── 周视图 ──────────────────────────────────────────
  const weekStart = ref(getWeekStartOf(getToday()))

  const weekDays = computed(() => {
    const start = new Date(weekStart.value)
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      return { date: d.toISOString().split('T')[0], name: (t('weekNames') as string[])[d.getDay()] }
    })
  })

  const weekLabel = computed(() => `${weekDays.value[0].date} ~ ${weekDays.value[6].date}`)

  function prevWeek() {
    const d = new Date(weekStart.value); d.setDate(d.getDate() - 7)
    weekStart.value = d.toISOString().split('T')[0]
  }
  function nextWeek() {
    const d = new Date(weekStart.value); d.setDate(d.getDate() + 7)
    weekStart.value = d.toISOString().split('T')[0]
  }

  // 切换视图时同步日历位置
  watch(viewMode, (mode) => {
    const d = new Date(selectedDate.value)
    if (mode === 'month') { calYear.value = d.getFullYear(); calMonth.value = d.getMonth() }
    else weekStart.value = getWeekStartOf(selectedDate.value)
  })

  return {
    selectedDate, viewMode,
    calYear, calMonth, monthLabel, monthDays, prevMonth, nextMonth,
    weekStart, weekDays, weekLabel, prevWeek, nextWeek,
  }
}
