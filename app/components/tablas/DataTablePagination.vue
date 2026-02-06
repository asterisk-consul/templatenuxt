<script setup lang="ts">
const props = defineProps<{
  meta: {
    page: number
    limit: number
    total: number
  }
}>()

const emit = defineEmits<{
  (e: 'page-change', page: number): void
}>()
onMounted(() => {
  console.log(props.meta)
})
</script>

<template>
  <div class="flex justify-end border-t pt-3">
    <UPagination
      :page="meta.page"
      :items-per-page="meta.limit"
      :total="meta.total"
      :sibling-count="1"
      @update:page="emit('page-change', $event)"
    />
  </div>
</template>
