<script setup lang="ts">
const props = defineProps<{
  row: any
  actions: {
    label: string
    icon?: string
    handler: (row: any) => void
  }[]
}>()
</script>

<template>
  <UDropdown :items="[actions]">
    <UButton icon="i-lucide-more-vertical" variant="ghost" size="xs" />
  </UDropdown>
</template>
