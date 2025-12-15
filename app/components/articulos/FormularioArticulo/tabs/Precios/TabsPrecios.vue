<script setup lang="ts">
import { useCategorias } from '@/composables/useCategorias'
import type { DropdownMenuItem } from '@nuxt/ui'

import { columns } from './columns'

const { load } = useCategorias()

interface Props {
  form: {
    articuloprecio: Articuloprecio[]
  }
  disabled?: boolean
}

const props = defineProps<Props>()

function getDropdownActions(row: Articuloprecio): DropdownMenuItem[][] {
  return [
    [
      {
        label: 'Editar',
        icon: 'i-lucide-edit',
        onClick: () => {
          console.log(row)
        }
      },
      {
        label: 'Eliminar',
        icon: 'i-lucide-trash',
        color: 'error',
        onClick: () => {
          console.log(row)
        }
      }
    ]
  ]
}

onMounted(async () => {
  await load()
})
</script>

<template>
  <UTable
    :data="props.form.articuloprecio"
    :columns="columns"
    :disabled="props.disabled"
  >
    <template #action-cell="{ row }">
      <UDropdownMenu :items="getDropdownActions(row.original)">
        <UButton
          icon="i-lucide-ellipsis-vertical"
          color="neutral"
          variant="ghost"
          aria-label="Actions"
        />
      </UDropdownMenu>
    </template>
  </UTable>
</template>
