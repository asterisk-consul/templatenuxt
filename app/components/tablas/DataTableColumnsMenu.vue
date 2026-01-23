<script setup lang="ts">
import { useDraggable } from 'vue-draggable-plus'

const props = defineProps<{
  columns: {
    key: string
    label: string
    visible?: boolean
  }[]
}>()

const emit = defineEmits<{
  (e: 'toggle', payload: { key: string; visible: boolean }): void
  (e: 'reorder', from: number, to: number): void
}>()

const listRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!listRef.value) return

  useDraggable(listRef.value, props.columns, {
    handle: '.drag-handle',
    animation: 150,
    onEnd: (evt) => {
      if (evt.oldIndex != null && evt.newIndex != null) {
        emit('reorder', evt.oldIndex, evt.newIndex)
      }
    }
  })
})
</script>

<template>
  <UPopover>
    <UButton icon="i-lucide-columns" label="Columnas" variant="outline" />

    <template #content>
      <div ref="listRef" class="p-3 space-y-1 w-64">
        <div
          v-for="col in columns"
          :key="col.key"
          class="flex items-center gap-2 p-2 rounded hover:bg-gray-100"
        >
          <UIcon
            name="i-lucide-grip-vertical"
            class="drag-handle w-4 h-4 text-gray-400 cursor-grab"
          />

          <UCheckbox
            :model-value="col.visible"
            @update:model-value="
              emit('toggle', { key: col.key, visible: $event })
            "
          />

          <span class="text-sm truncate">{{ col.label }}</span>
        </div>
      </div>
    </template>
  </UPopover>
</template>
