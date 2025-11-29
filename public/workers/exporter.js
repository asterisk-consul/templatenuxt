self.importScripts(
  'https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js'
)

self.onmessage = async (event) => {
  const { type, data } = event.data

  try {
    if (type === 'csv') {
      const csv = generarCSV(data)
      self.postMessage({
        type: 'download',
        filename: 'articulos.csv',
        mime: 'text/csv',
        content: csv
      })
    }

    if (type === 'json') {
      const json = JSON.stringify(data, null, 2)
      self.postMessage({
        type: 'download',
        filename: 'articulos.json',
        mime: 'application/json',
        content: json
      })
    }

    if (type === 'xlsx') {
      const buffer = generarXLSX(data)
      self.postMessage({
        type: 'download',
        filename: 'articulos.xlsx',
        mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        content: buffer
      })
    }
  } catch (error) {
    self.postMessage({
      type: 'error',
      error: error.message
    })
  }
}

// --- Funciones de generación ---
function generarCSV(rows) {
  if (!rows.length) return ''

  const headers = Object.keys(rows[0])
  const csvRows = [
    headers.join(','),
    ...rows.map((r) => headers.map((h) => JSON.stringify(r[h] ?? '')).join(','))
  ]
  return csvRows.join('\n')
}

function generarXLSX(rows) {
  const worksheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Articulos')

  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array'
  })
  return excelBuffer
}
