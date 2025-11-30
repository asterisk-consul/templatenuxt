import { useAuthStore } from '@/stores/useAuthStore'

export function useImportArticulos() {
  const progress = ref(0)
  const totalprocess = ref(0)
  const finished = ref(false)
  const error = ref<string | null>(null)

  const resultsOk = ref<any[]>([])
  const resultsError = ref<any[]>([])

  let worker: Worker | null = null

  // 🔧 La función reset EXISTE y funciona
  const resetState = () => {
    progress.value = 0
    totalprocess.value = 0
    finished.value = false
    error.value = null
    resultsOk.value = []
    resultsError.value = []
  }

  const startImport = (file: File) => {
    // 👈 Usamos el nombre correcto
    resetState()
    return new Promise<void>((resolve, reject) => {
      worker = new Worker(
        new URL('@/workers/importArticulos.worker.ts', import.meta.url),
        { type: 'module' }
      )

      worker.onmessage = (e) => {
        const msg = e.data

        switch (msg.type) {
          case 'progress':
            progress.value = msg.processed
            totalprocess.value = msg.total
            break

          case 'row-ok':
            resultsOk.value.push(msg.data)
            break

          case 'row-error':
            resultsError.value.push(msg.data)
            break

          case 'done':
            finished.value = true
            worker?.terminate()
            resolve()
            break

          case 'error':
            error.value = msg.error
            worker?.terminate()
            reject(msg.error)
            break

          case 'debug':
            console.log('👷 Worker:', ...msg.msg)
            break
        }
      }

      const config = useRuntimeConfig()
      const authStore = useAuthStore()

      worker.postMessage({
        file,
        endpointBase: '/articulo/update',
        apiBase: config.public.apiBase,
        token: authStore.token
      })
    })
  }

  return {
    progress,
    totalprocess,
    finished,
    error,
    resultsOk,
    resultsError,
    startImport
  }
}
