<!-- 日历组件 -->
<template>
  <div class="calendar-container">
    <div class="calendar-header">
      <button class="btn-nav" @click="prevMonth">&lt;</button>
      <span class="month-title">{{ currentMonthYear }}</span>
      <button class="btn-nav" @click="nextMonth">&gt;</button>
    </div>
    
    <div class="calendar-grid">
      <div class="calendar-weekday">周日</div>
      <div class="calendar-weekday">周一</div>
      <div class="calendar-weekday">周二</div>
      <div class="calendar-weekday">周三</div>
      <div class="calendar-weekday">周四</div>
      <div class="calendar-weekday">周五</div>
      <div class="calendar-weekday">周六</div>
      
      <div
        v-for="day in calendarDays"
        :key="day.date"
        class="calendar-day"
        :class="{
          selected: selectedDate === day.date,
          today: isToday(day.date),
          hasTasks: store.hasTasks(day.date)
        }"
        @click="selectDate(day.date)"
      >
        {{ day.dayOfMonth }}
        <span 
          v-if="store.hasTasks(day.date)"
          class="task-dot"
          :style="{ animation: `bounce ${Math.random() * 1 + 0.5}s infinite` }"
        ></span>
      </div>
    </div>

    <div class="date-picker">
      <label>选择日期：</label>
      <input 
        type="date" 
        v-model="selectedDate"
        @change="selectDate($event.target.value)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import useTodoStore from '../stores/todo'

const store = useTodoStore()
const todayString = () => new Date().toISOString().split('T')[0]

const currentDate = ref(new Date())
const selectedDate = ref(todayString())

const currentMonthYear = computed(() => {
  const date = currentDate.value
  return `${date.getFullYear()}年${date.getMonth() + 1}月`
})

const calendarDays = computed(() => {
  const days = []
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const lastDay = new Date(year, month + 1, 0).getDate()
  
  // 填充空白
  for (let i = 0; i < firstDay; i++) {
    days.push({ dayOfMonth: '', date: '' })
  }
  
  // 填充日期
  for (let i = 1; i <= lastDay; i++) {
    const date = new Date(year, month, i)
    const dateStr = date.toISOString().split('T')[0]
    days.push({
      dayOfMonth: i,
      date: dateStr
    })
  }
  
  return days
})

const prevMonth = () => {
  currentDate.value.setMonth(currentDate.value.getMonth() - 1)
}

const nextMonth = () => {
  currentDate.value.setMonth(currentDate.value.getMonth() + 1)
}

const selectDate = (date: string) => {
  selectedDate.value = date
  // 自动滚动到任务列表显示该日期
  if (typeof (document as any).querySelector === 'function') {
    const target = (document as any).querySelector('.task-list-item[data-date="' + date + '"]')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }
}

const isToday = (date: string) => {
  const today = todayString()
  return date === today
}


</script>

<style scoped>
.calendar-container {
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.btn-nav {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 10px;
  background: var(--bg-tertiary);
  color: var(--text-primary);
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-nav:hover {
  background: var(--border-focus);
}

.month-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  margin-bottom: 20px;
}

.calendar-weekday {
  text-align: center;
  font-size: 13px;
  color: var(--text-muted);
  font-weight: 500;
  padding: 8px 0;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-size: 14px;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.calendar-day:hover {
  background: var(--bg-tertiary);
}

.calendar-day.selected {
  background: var(--primary);
  color: white;
}

.calendar-day.today {
  border: 2px solid var(--primary);
}

.calendar-day.hasTasks {
  border: 2px solid var(--success);
}

.task-dot {
  width: 8px;
  height: 8px;
  background: var(--danger);
  border-radius: 50%;
  position: absolute;
  top: 4px;
  right: 4px;
}

.date-picker {
  display: flex;
  gap: 12px;
  align-items: center;
}

.date-picker label {
  font-size: 14px;
  color: var(--text-secondary);
}

.date-picker input {
  padding: 8px 12px;
  border: 2px solid var(--border-default);
  border-radius: 10px;
  font-size: 14px;
  font-family: inherit;
  color: var(--text-primary);
  background: var(--bg-primary);
  outline: none;
  transition: border-color 0.2s;
}

.date-picker input:focus {
  border-color: var(--primary);
}
</style>