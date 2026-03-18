import * as XLSX from 'xlsx'
import type { Todo, Priority } from '../types'

interface DailyBucket {
  date: string
  tasks: Todo[]
}

const PRIORITY_MAP_ZH: Record<string, Priority> = { '高': 'high', '中': 'medium', '低': 'low' }
const PRIORITY_MAP_EN: Record<string, Priority> = { 'High': 'high', 'Med': 'medium', 'Low': 'low' }
const PRIORITY_LABEL: Record<Priority, Record<string, string>> = {
  high:   { zh: '高', en: 'High' },
  medium: { zh: '中', en: 'Med' },
  low:    { zh: '低', en: 'Low' },
}

export function exportToExcel(
  buckets: Map<string, DailyBucket>,
  fromDate: string,
  toDate: string,
  lang: string
) {
  const wb = XLSX.utils.book_new()
  const colIndex = lang === 'zh' ? '序号' : 'No.'
  const colTask  = lang === 'zh' ? '任务名称' : 'Task'
  const colTime  = lang === 'zh' ? '时间' : 'Time'
  const colPri   = lang === 'zh' ? '优先级' : 'Priority'

  const dates = Array.from(buckets.keys())
    .filter(d => d >= fromDate && d <= toDate)
    .sort()

  if (dates.length === 0) return false

  for (const date of dates) {
    const bucket = buckets.get(date)!
    // 用 aoa_to_sheet 手动构建，确保所有单元格强制为字符串类型
    const aoa: string[][] = [
      [colIndex, colTask, colTime, colPri],
      ...bucket.tasks.map((t, i) => [
        String(i + 1),
        t.text,
        t.time || '',
        PRIORITY_LABEL[t.priority]?.[lang] ?? t.priority,
      ]),
    ]
    const ws = XLSX.utils.aoa_to_sheet(aoa)
    // 将所有单元格格式设为字符串
    for (const cellAddr of Object.keys(ws)) {
      if (cellAddr.startsWith('!')) continue
      ws[cellAddr].t = 's'
      ws[cellAddr].z = '@'
    }
    ws['!cols'] = [{ wch: 6 }, { wch: 30 }, { wch: 10 }, { wch: 8 }]
    XLSX.utils.book_append_sheet(wb, ws, date)
  }

  XLSX.writeFile(wb, `tasks_${fromDate}_${toDate}.xlsx`)
  return true
}

export function importFromExcel(file: File): Promise<DailyBucket[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer)
        const wb = XLSX.read(data, { type: 'array' })
        const buckets: DailyBucket[] = []

        for (const sheetName of wb.SheetNames) {
          // sheet名必须是 YYYY-MM-DD 格式
          if (!/^\d{4}-\d{2}-\d{2}$/.test(sheetName)) continue
          const ws = wb.Sheets[sheetName]
          const rows = XLSX.utils.sheet_to_json<Record<string, string>>(ws)
          const tasks: Todo[] = rows.map((row, i) => {
            // 兼容中英文列名
            const text = (row['任务名称'] || row['Task'] || '').toString().trim()
            const time = (row['时间'] || row['Time'] || '').toString().trim() || undefined
            const priRaw = (row['优先级'] || row['Priority'] || '').toString().trim()
            const priority: Priority =
              PRIORITY_MAP_ZH[priRaw] || PRIORITY_MAP_EN[priRaw] || 'medium'
            return {
              text,
              completed: false,
              createdAt: new Date().toISOString(),
              priority,
              order: i,
              time: time || undefined,
            }
          }).filter(t => t.text)

          if (tasks.length > 0) buckets.push({ date: sheetName, tasks })
        }
        resolve(buckets)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}
