<script setup lang="ts">
import { useCategorias } from '@/composables/useCategorias'
import type { DropdownMenuItem } from '@nuxt/ui'
import ModalPrecio from './ModalPrecio.vue'
import ConfirmDeleteModal from '@/components/shared/ConfirmDeleteModal.vue'
import { getColumns } from './columns'

import {
  toArticuloprecioDomain,
  toArticuloprecioForm
} from '@/adapters/articuloprecio.adapter'

import LockedInput from '~/components/articulos/FormularioArticulo/ui/LocketInput.vue'

const { resolveNombre, load } = useCategorias()
const columns = getColumns(resolveNombre)

interface Props {
  form: {
    articuloprecio: Articuloprecio[]
  }
  disabled?: boolean
}

const props = defineProps<Props>()

const modalOpen = ref(false)

const deleteOpen = ref(false)
const toDelete = ref<Articuloprecio | null>(null)
const selectedPrecio = ref<ArticuloprecioForm | null>(null)

/**
 * Acciones del dropdown por fila
 */
function getDropdownActions(row: Articuloprecio): DropdownMenuItem[][] {
  return [
    [
      {
        label: 'Editar',
        icon: 'i-lucide-edit',
        onClick: () => {
          selectedPrecio.value = toArticuloprecioForm(row)
          modalOpen.value = true
        }
      },
      {
        label: 'Eliminar',
        icon: 'i-lucide-trash',
        color: 'error',
        onClick: () => {
          toDelete.value = row
          deleteOpen.value = true
        }
      }
    ]
  ]
}

function handleSave(form: ArticuloprecioForm) {
  const payload: Articuloprecio = toArticuloprecioDomain(form)

  if (payload.id) {
    console.log('EDIT', payload)
  } else {
    console.log('CREATE', payload)
  }

  closeModal()
}

function closeModal() {
  modalOpen.value = false
  selectedPrecio.value = null
}

function confirmDelete() {
  if (!toDelete.value) return

  console.log('DELETE', toDelete.value.id)

  deleteOpen.value = false
  toDelete.value = null
}

onMounted(async () => {
  await load()
  console.log(props.form)
})
</script>

<template>
  <LockedInput :disabled="props.disabled">
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
    <UButton icon="i-lucide-plus" color="primary" @click="modalOpen = true" />

    <!-- MODAL CONTROLADO -->

    <ModalPrecio
      :open="modalOpen"
      :model-value="selectedPrecio"
      @save="handleSave"
      @cancel="closeModal"
    />

    <ConfirmDeleteModal
      :open="deleteOpen"
      title="Eliminar Precio"
      :summary="[
        `Categoría: ${resolveNombre(
          toDelete?.categid != null ? String(toDelete.categid) : undefined
        )}`,
        `Precio: $${toDelete?.precio}`,
        `sobre el artículo ${toDelete?.articuloid}`
      ]"
      :confirm-text="
        String(
          resolveNombre(
            toDelete?.categid != null ? String(toDelete.categid) : undefined
          )
        )
      "
      @cancel="() => (deleteOpen = false)"
      @confirm="confirmDelete"
    />
  </LockedInput>
</template>
