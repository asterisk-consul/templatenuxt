<script setup lang="ts">
import CamposPrincipales from '@/components/articulos/FormularioArticulo/CamposPrincipales.vue'
import CamposOpciones from '@/components/articulos/FormularioArticulo/CamposOpciones.vue'
import CamposTabs from '@/components/articulos/FormularioArticulo/CamposTabs.vue'
import CamposImagen from '@/components/articulos/FormularioArticulo/CamposImagen.vue'

interface Props {
  articuloEdit: Partial<ArticulosApiN> | null
  disabled?: boolean
}

const props = defineProps<Props>()

const form = reactive<Partial<ArticulosApiN>>({
  imagen: null
})

const fileInput = ref<HTMLInputElement | null>(null)

watch(
  () => props.articuloEdit,
  (val) => {
    if (val) Object.assign(form, val)
  },
  { immediate: true }
)
</script>

<template>
  <UForm :state="form" class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
    <CamposImagen :form="form" :disabled="disabled" />

    <CamposPrincipales :form="form" :disabled="disabled" />

    <CamposOpciones :form="form" :disabled="disabled" />

    <CamposTabs :form="form" :disabled="disabled" />
  </UForm>
</template>
