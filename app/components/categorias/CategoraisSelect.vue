<script setup lang="ts">
import { useCategorias } from '@/composables/useCategorias'

interface Props {
  grupos?: string[]
  placeholder?: string
  disabled?: boolean
  showPath?: boolean // 👈 NUEVA
}

const props = defineProps<Props>()

// v-model del componente
const modelValue = defineModel<string | undefined>()

const { load, selectOptions, loading, resolvePath } = useCategorias()

const items = computed(() =>
  selectOptions.value.map((o) => ({
    value: o.value,
    label: props.showPath ? resolvePath(o.value) : o.label
  }))
)

onMounted(() => {
  load(props.grupos)
})
</script>

<template>
  <USelectMenu
    :items="items"
    :loading="loading"
    :disabled="disabled"
    :placeholder="placeholder ?? 'Seleccionar categoría'"
    :model-value="items.find((o) => o.value === modelValue)"
    @update:model-value="(item) => (modelValue = item?.value)"
  >
    <!-- Tooltip para cada item en la lista -->
    <template #item="{ item }">
      <UTooltip :text="item.label">
        <div class="max-w-[500px] truncate">{{ item.label }}</div>
      </UTooltip>
    </template>
  </USelectMenu>
</template>
