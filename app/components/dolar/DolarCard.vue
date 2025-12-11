<template>
  <div
    class="bg-slate-800/70 backdrop-blur-md border border-slate-700 rounded-xl p-6 flex flex-col gap-3 shadow-lg hover:shadow-xl transition-all duration-200"
  >
    <h2 class="text-xl font-semibold text-white text-center">{{ title }}</h2>

    <div class="flex justify-between mt-2">
      <div class="flex flex-col text-left">
        <span class="text-slate-400 text-sm">COMPRA</span>
        <span class="text-lg font-bold text-white">${{ compra }}</span>
      </div>

      <div class="flex flex-col text-right">
        <span class="text-slate-400 text-sm">VENTA</span>
        <span class="text-lg font-bold text-white">${{ venta }}</span>
      </div>
    </div>

    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  compra: number
  venta: number
}>()
</script>
