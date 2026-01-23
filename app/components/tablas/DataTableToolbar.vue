<script setup lang="ts">
import DataTableColumnsMenu from './DataTableColumnsMenu.vue'

const props = defineProps<{
  columns: {
    key: string
    label: string
    visible?: boolean
  }[]
}>()

const emit = defineEmits<{
  (e: 'search', value: string): void
  (e: 'toggle-column', key: string, visible: boolean): void
}>()

const search = ref('')
</script>

<template>
  <div class="flex items-center justify-between gap-3">
    <!-- Search -->
    <UInput
      v-model="search"
      placeholder="Buscar…"
      icon="i-lucide-search"
      class="max-w-sm"
      @update:model-value="emit('search', search)"
    />

    <!-- Column menu -->
    <DataTableColumnsMenu
      :columns="columns"
      @toggle="emit('toggle-column', $event.key, $event.visible)"
    />
  </div>
</template>
