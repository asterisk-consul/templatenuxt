import * as XLSX from 'xlsx'
import Papa from 'papaparse'

export function useExportData() {
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

  // ----------------------------------------------------
  // 📌 Exportar a CSV
  // ----------------------------------------------------
  const exportCSV = (rows: any[], filename = 'data.csv') => {
    const csv = Papa.unparse(rows)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    download(filename, blob)
  }

  // ----------------------------------------------------
  // 📌 Exportar a JSON
  // ----------------------------------------------------
  const exportJSON = (rows: any[], filename = 'data.json') => {
    const json = JSON.stringify(rows, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    download(filename, blob)
  }

  // ----------------------------------------------------
  // 📌 Exportar a Excel
  // ----------------------------------------------------
  const exportExcel = (rows: any[], filename = 'data.xlsx') => {
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

  return {
    exportCSV,
    exportExcel,
    exportJSON
  }
}
