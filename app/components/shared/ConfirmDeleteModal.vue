<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  open: boolean
  title?: string
  description?: string
  confirmText: string
  summary: string | string[]
  loading?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const input = ref('')

watch(
  () => props.open,
  (v) => {
    if (!v) input.value = ''
  }
)

const isValid = computed(() => input.value === props.confirmText)
</script>

<template>
  <UModal :open="open" @update:open="emit('cancel')">
    <template #header>
      <h3 class="text-lg font-semibold">
        {{ title ?? 'Confirmar eliminación' }}
      </h3>
    </template>
    <template #body>
      <UCard>
        <div class="space-y-4">
          <p class="text-lg text-red-500 font-semibold">
            {{ description ?? 'Esta acción no se puede deshacer.' }}
          </p>

          <!-- Resumen -->
          <div class="rounded-md border p-3 text-sm">
            <ul v-if="Array.isArray(summary)" class="list-disc pl-4 space-y-1">
              <li v-for="(s, i) in summary" :key="i">{{ s }}</li>
            </ul>
            <p v-else>{{ summary }}</p>
          </div>

          <!-- Confirm input -->
          <div class="space-y-1">
            <p class="text-sm">
              Escribí
              <strong>{{ confirmText }}</strong>
              para confirmar
            </p>
            <UInput v-model="input" />
          </div>
        </div>
      </UCard>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton variant="ghost" color="neutral" @click="emit('cancel')">
          Cancelar
        </UButton>

        <UButton
          color="error"
          :disabled="!isValid || loading"
          :loading="loading"
          @click="emit('confirm')"
        >
          Eliminar
        </UButton>
      </div>
    </template>
  </UModal>
</template>
