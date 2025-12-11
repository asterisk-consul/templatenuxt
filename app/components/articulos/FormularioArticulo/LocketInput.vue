<script setup lang="ts">
interface Props {
  disabled?: boolean
  label?: string
  tooltipMessage?: string
}

const props = defineProps<Props>()
</script>

<template>
  <div class="flex flex-col gap-1 w-full">
    <span v-if="label" class="text-sm font-medium">{{ label }}</span>

    <!-- BLOQUEADO -->
    <UTooltip
      v-if="disabled"
      :text="tooltipMessage || 'Para editar haga clic en el botón “Editar”.'"
      placement="right"
      class="w-full block"
    >
      <!-- Contenedor externo que permite hover y ocupa todo el ancho -->
      <div class="w-full cursor-not-allowed block">
        <!-- Esto mantiene layout + full width -->
        <div class="pointer-events-none w-full opacity-80 block">
          <slot />
        </div>
      </div>
    </UTooltip>

    <!-- EDITABLE -->
    <div v-else class="w-full block">
      <slot />
    </div>
  </div>
</template>
