<script setup lang="ts">
import { useLang } from '../composables/useLang'
import { useCalendar, getToday } from '../composables/useCalendar'
import useTodoStore from '../stores/todo'

const { t } = useLang()
const store = useTodoStore()

const {
  selectedDate, viewMode,
  calMonth, monthLabel, monthDays, prevMonth, nextMonth,
  weekDays, weekLabel, prevWeek, nextWeek,
} = useCalendar()

// 暴露 selectedDate 给父组件
defineExpose({ selectedDate })
</script>

<template>
  <aside class="calendar-panel">
    <div class="cal-top">
      <h2>{{ t('calendarTitle') }}</h2>
      <div class="view-tabs">
        <button :class="['tab', { active: viewMode === 'month' }]" @click="viewMode = 'month'">{{ t('viewMonth') }}</button>
        <button :class="['tab', { active: viewMode === 'week' }]" @click="viewMode = 'week'">{{ t('viewWeek') }}</button>
      </div>
    </div>

    <!-- 月视图 -->
    <div v-if="viewMode === 'month'" class="month-view">
      <div class="nav-row">
        <button class="nav-btn" @click="prevMonth">‹</button>
        <span class="nav-label">{{ monthLabel }}</span>
        <button class="nav-btn" @click="nextMonth">›</button>
      </div>
      <div class="cal-grid">
        <div v-for="name in (t('weekNames') as string[])" :key="name" class="cal-weekday">{{ name }}</div>
        <div
          v-for="day in monthDays"
          :key="day.date"
          :class="['cal-day', {
            'other-month': !day.inMonth,
            'is-today': day.date === getToday(),
            'is-selected': day.date === selectedDate,
            'has-tasks': store.hasTasks(day.date)
          }]"
          @click="selectedDate = day.date"
        >
          <span class="day-num">{{ day.date.split('-')[2].replace(/^0/, '') }}</span>
          <span v-if="store.hasTasks(day.date)" class="task-dot"></span>
        </div>
      </div>
    </div>

    <!-- 周视图 -->
    <div v-if="viewMode === 'week'" class="week-view">
      <div class="nav-row">
        <button class="nav-btn" @click="prevWeek">‹</button>
        <span class="nav-label week-label">{{ weekLabel }}</span>
        <button class="nav-btn" @click="nextWeek">›</button>
      </div>
      <div class="week-days">
        <div
          v-for="day in weekDays"
          :key="day.date"
          :class="['week-day', {
            'is-today': day.date === getToday(),
            'is-selected': day.date === selectedDate,
            'has-tasks': store.hasTasks(day.date)
          }]"
          @click="selectedDate = day.date"
        >
          <span class="week-day-name">{{ day.name }}</span>
          <span class="week-day-num">{{ day.date.split('-')[2].replace(/^0/, '') }}</span>
          <span v-if="store.hasTasks(day.date)" class="task-dot"></span>
        </div>
      </div>
    </div>

    <button class="today-btn" @click="selectedDate = getToday()">{{ t('today') }}</button>
  </aside>
</template>

<style scoped>
.calendar-panel {
  background: var(--bg2); border: 1px solid var(--border); border-radius: 16px;
  padding: 20px; position: sticky; top: 24px;
}
.cal-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.cal-top h2 { font-size: 16px; font-weight: 600; }
.view-tabs { display: flex; gap: 4px; background: var(--bg3); border-radius: 8px; padding: 3px; }
.tab {
  padding: 4px 12px; border: none; border-radius: 6px; font-size: 13px;
  background: transparent; color: var(--text2); cursor: pointer; transition: all 0.15s;
}
.tab.active { background: var(--primary); color: white; }
.nav-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.nav-btn {
  width: 30px; height: 30px; border: none; border-radius: 8px; background: var(--bg3);
  color: var(--text); font-size: 20px; cursor: pointer; display: flex; align-items: center;
  justify-content: center; transition: background 0.15s; line-height: 1;
}
.nav-btn:hover { background: var(--border); }
.nav-label { font-size: 14px; font-weight: 600; color: var(--text); }
.week-label { font-size: 12px; }
.cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
.cal-weekday { text-align: center; font-size: 11px; color: var(--muted); padding: 6px 0; font-weight: 500; }
.cal-day {
  aspect-ratio: 1; display: flex; flex-direction: column; align-items: center;
  justify-content: center; border-radius: 8px; cursor: pointer; position: relative;
  transition: background 0.15s; gap: 2px;
}
.cal-day:hover { background: var(--bg3); }
.cal-day.other-month .day-num { color: var(--muted); opacity: 0.5; }
.cal-day.is-today { border: 2px solid var(--primary); }
.cal-day.is-selected { background: var(--primary) !important; }
.cal-day.is-selected .day-num { color: white; }
.day-num { font-size: 13px; font-weight: 500; line-height: 1; }
.week-days { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
.week-day {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  padding: 10px 4px; border-radius: 10px; cursor: pointer; position: relative;
  transition: background 0.15s; border: 1.5px solid transparent;
}
.week-day:hover { background: var(--bg3); }
.week-day.is-today { border-color: var(--primary); }
.week-day.is-selected { background: var(--primary); }
.week-day.is-selected .week-day-name,
.week-day.is-selected .week-day-num { color: white; }
.week-day-name { font-size: 11px; color: var(--muted); }
.week-day.is-selected .week-day-name { color: rgba(255,255,255,0.8); }
.week-day-num { font-size: 16px; font-weight: 600; }
.task-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--dot); flex-shrink: 0; }
.cal-day.is-selected .task-dot,
.week-day.is-selected .task-dot { background: rgba(255,255,255,0.9); }
.today-btn {
  width: 100%; margin-top: 12px; padding: 8px; border: 1.5px solid var(--border);
  border-radius: 10px; background: transparent; color: var(--text2); font-size: 13px;
  cursor: pointer; transition: all 0.15s;
}
.today-btn:hover { background: var(--bg3); color: var(--text); }
</style>
