// src/composables/useFileUploader.ts
import { ref } from 'vue'
import { useFileParser } from './useFileParser'

export function useFileUploader() {
  const { parseFile } = useFileParser()

  const file = ref<File | null>(null)
  const parsedData = ref<any[]>([])
  const error = ref<string | null>(null)
  const loading = ref(false)

  const onSelectFile = async (event: Event) => {
    error.value = null
    parsedData.value = []

    const input = event.target as HTMLInputElement
    const selected = input.files?.[0]
    if (!selected) return

    file.value = selected
    loading.value = true

    try {
      const raw = await parseFile(selected, { header: false })

      parsedData.value = normalizeRows(raw)
    } catch (err: any) {
      error.value = err.message || 'Error al procesar el archivo'
    } finally {
      loading.value = false
    }
  }

  // ⚠ Convierte [["id","nombre"],[1,"coca"]] en [{id:1,nombre:"coca"}]
  const normalizeRows = (rows: any[][]): any[] => {
    if (!rows.length) return []

    const headers = rows[0].map((h) => h.toString().trim())
    const items = rows.slice(1)

    return items.map((row) => {
      const obj: any = {}
      row.forEach((val, i) => {
        obj[headers[i]] = val
      })
      return obj
    })
  }

  return {
    file,
    parsedData,
    error,
    loading,
    onSelectFile
  }
}
