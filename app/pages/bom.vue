<script setup>
import ArbolCostosTable from '~/components/articulos/ArbolCostosBom.vue'
const data = await fetchData('/articulos/arbol-costos/1118')
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Árbol de Costos</h1>

    <ArbolCostosTable :data="data" />
  </div>
</template>
