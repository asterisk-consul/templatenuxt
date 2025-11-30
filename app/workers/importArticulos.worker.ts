// workers/importArticulos.worker.ts
import * as XLSX from 'xlsx'

// Para mandar logs hacia la app:
function debugLog(...msg: any[]) {
  self.postMessage({ type: 'debug', msg })
}

function cleanKey(key: string) {
  return key.includes('.') ? key.split('.')[1] : key
}

function normalizeValue(value: any) {
  if (value === 'true') return true
  if (value === 'false') return false
  if (value === '' || value === undefined) return null
  return value
}

function normalizeArticulo(raw: any) {
  const row: any = {}
  console.log(raw)

  Object.keys(raw).forEach((key) => {
    if (key.startsWith('articulos.')) {
      const clean = key.split('.')[1]
      row[clean] = normalizeValue(raw[key])
    }
  })

  console.log(row)

  const payload = {
    id: row.id,
    internalcode: row.internalcode,
    externalcode: row.externalcode,
    nombre: row.nombre,
    descrip: row.descrip,
    activo: row.activo,
    isservice: row.isservice,
    ischeque: row.ischeque,
    isamedida: row.isamedida,
    categid: row.categid,
    categoria: row.categid ? { id: row.categid } : null
  }

  return payload
}

self.onmessage = async (event) => {
  const { file, endpointBase, apiBase, token } = event.data

  try {
    debugLog('Recibido archivo:', file.name)

    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: 'array' })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]

    const rows = XLSX.utils.sheet_to_json(sheet)
    debugLog('Rows crudos:', rows.length)
    debugLog('Keys:', Object.keys(rows[0] || {}))

    const validRows = rows.map((r) => normalizeArticulo(r)).filter((r) => r.id)

    debugLog('Filas válidas normalizadas:', validRows)

    let processed = 0
    const total = validRows.length

    for (const row of validRows) {
      debugLog('Enviando fila:', row)

      const url = `${apiBase}${endpointBase}/${row.id}`

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(row)
      })

      if (!res.ok) {
        const text = await res.text()

        self.postMessage({
          type: 'row-error',
          data: {
            id: row.id,
            nombre: row.nombre,
            msg: text
          }
        })

        continue
      }

      // ✔ OK
      self.postMessage({
        type: 'row-ok',
        data: {
          id: row.id,
          nombre: row.nombre
        }
      })

      processed++
      self.postMessage({ type: 'progress', processed, total })
    }

    self.postMessage({ type: 'done', total })

    self.postMessage({ type: 'done', total })
  } catch (error: any) {
    debugLog('ERROR:', error.message)
    self.postMessage({ type: 'error', error: error.message })
  }
}
