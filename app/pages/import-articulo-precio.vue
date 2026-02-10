<template>
  <div style="max-width: 500px; margin: 40px auto">
    <h2>Importar Artículo - Precio</h2>

    <input type="file" accept=".xlsx,.xls" @change="onFileChange" />

    <br />
    <br />

    <button :disabled="!file || loading" @click="upload">
      {{ loading ? 'Importando...' : 'Importar' }}
    </button>

    <pre v-if="result">{{ result }}</pre>
    <p v-if="error" style="color: red">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
const file = ref<File | null>(null)
const loading = ref(false)
const result = ref<any>(null)
const error = ref<string | null>(null)

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  file.value = target.files?.[0] ?? null
}

async function upload() {
  if (!file.value) return

  loading.value = true
  error.value = null
  result.value = null

  const formData = new FormData()
  formData.append('file', file.value)

  try {
    const response = await $fetch(
      'http://localhost:3000/data-import/articulo-precio',
      {
        method: 'POST',
        body: formData
      }
    )

    result.value = response
  } catch (err: any) {
    error.value = err?.data?.message || 'Error al importar'
  } finally {
    loading.value = false
  }
}
</script>
