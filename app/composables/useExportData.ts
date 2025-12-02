import * as XLSX from 'xlsx'
import Papa from 'papaparse'

export function useExportData() {
  // Worker opcional (si existe)
  const worker =
    typeof window !== 'undefined' ? new Worker('/workers/exporter.js') : null

  // Número de filas a partir del cual usamos Worker
  const WORKER_THRESHOLD = 500

  // ----------------------------------------------------
  // 📌 Descargar archivo
  // ----------------------------------------------------
  const download = (filename: string, blob: Blob) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  // ====================================================
  // 🔥 MÉTODOS DE EXPORTACIÓN LOCAL
  // ====================================================

  const localCSV = (rows: any[], filename = 'data.csv') => {
    const csv = Papa.unparse(rows)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    download(filename, blob)
  }

  const localJSON = (rows: any[], filename = 'data.json') => {
    const json = JSON.stringify(rows, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    download(filename, blob)
  }

  const localExcel = (rows: any[], filename = 'data.xlsx') => {
    const worksheet = XLSX.utils.json_to_sheet(rows)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data')

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    })

    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })

    download(filename, blob)
  }

  // ====================================================
  // 🔥 MÉTODOS PRINCIPALES (AUTOMÁTICOS)
  // ====================================================
  const autoExport = (
    type: 'csv' | 'xlsx' | 'json',
    rows: any[],
    filename: string
  ) => {
    if (!rows || rows.length === 0) return

    // 👉 Si pocas filas → exportación local
    if (rows.length < WORKER_THRESHOLD || !worker) {
      if (type === 'csv') return localCSV(rows, filename)
      if (type === 'json') return localJSON(rows, filename)
      if (type === 'xlsx') return localExcel(rows, filename)
      return
    }

    // 👉 Si muchas filas → Worker
    return new Promise((resolve, reject) => {
      worker.onmessage = (event) => {
        if (event.data.type === 'download') {
          const { filename, content, mime } = event.data
          const blob = new Blob([content], { type: mime })
          download(filename, blob)
          resolve(true)
        } else if (event.data.type === 'error') {
          reject(event.data.error)
        }
      }

      worker.postMessage({
        type,
        data: rows,
        filename
      })
    })
  }

  return {
    exportCSV: (rows: any[], filename = 'data.csv') =>
      autoExport('csv', rows, filename),
    exportExcel: (rows: any[], filename = 'data.xlsx') =>
      autoExport('xlsx', rows, filename),
    exportJSON: (rows: any[], filename = 'data.json') =>
      autoExport('json', rows, filename)
  }
}
