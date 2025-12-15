<script setup lang="ts">
import { useCategorias } from '@/composables/useCategorias'
import type { DropdownMenuItem } from '@nuxt/ui'
import ModalPrecio from './ModalPrecio.vue'

import { columns } from './columns'

const { load } = useCategorias()

interface Props {
  form: {
    articuloprecio: Articuloprecio[]
  }
  disabled?: boolean
}

const props = defineProps<Props>()
const modalOpen = ref(false)
const selectedPrecio = ref<Articuloprecio | null>(null)

function getDropdownActions(row: Articuloprecio): DropdownMenuItem[][] {
  return [
    [
      {
        label: 'Editar',
        icon: 'i-lucide-edit',
        onClick: () => {
          selectedPrecio.value = row
          modalOpen.value = true
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

function handleSave(precio: Articuloprecio) {
  if (precio.id) {
    // editar
    console.log('EDIT', precio)
  } else {
    // crear
    console.log('CREATE', precio)
  }

  modalOpen.value = false
  selectedPrecio.value = null
}


onMounted(async () => {
  await load()
  console.log(props.form.articuloprecio)
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
<UModal v-model:open="modalOpen">
  <template #content>
    
  <ModalPrecio
    :model-value="selectedPrecio"
    @save="handleSave"
    @cancel="modalOpen = false"
  />
</template>
</UModal>

</template>
