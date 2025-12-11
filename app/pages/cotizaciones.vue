<script setup lang="ts">
import DollarCard from '@/components/dolar/DolarCard.vue'

const { data, pending, error } = await useFetch('/api/dolar')

const dolar = computed(() => (data.value as ApiDolar[]) || [])

// Fecha de actualización (toma la primera cotización)
const fechaActualizacion = computed(() =>
  dolar.value.length ? dolar.value[0]?.fechaActualizacion : null
)
</script>

<template>
  <UDashboardPanel id="cotizaciones">
    <template #header>
      <UDashboardNavbar title="Cotizaciones" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="min-h-screen p-6">
        <div v-if="error" class="text-center" color="error">
          Error al obtener datos.
        </div>

        <div v-else-if="pending" class="text-center" color="warning">
          Cargando...
        </div>

        <div
          v-else
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mt-10"
        >
          <DollarCard
            v-for="d in dolar"
            :key="d.casa"
            :title="`Dólar ${d.nombre}`"
            :compra="d.compra"
            :venta="d.venta"
          />
        </div>

        <!-- Footer -->
        <div class="text-center mt-10 text-sm" v-if="fechaActualizacion">
          <div class="mt-1 text-xl">
            Actualizado el
            {{ new Date(fechaActualizacion).toLocaleString('es-AR') }}
          </div>
          <span>Datos obtenidos de</span>
          <a
            href="https://dolarapi.com"
            target="_blank"
            class="bg-blue-600 text-white px-2 rounded"
          >
            DolarApi.com
          </a>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
