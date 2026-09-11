<script setup lang="ts">
defineProps<{ pixels: (number | null)[]; side: number; active?: number; label?: string }>()
</script>
<template>
  <svg class="binary-image" :viewBox="`0 0 ${side * 12} ${side * 12}`" role="img" :aria-label="label || 'Binary image'">
    <rect v-for="(bit, j) in pixels" :key="j" :x="j % side * 12 + 1" :y="Math.floor(j / side) * 12 + 1" width="10" height="10"
      :fill="bit === null ? '#dce5eb' : bit ? '#17324d' : '#fff'" :stroke="j === active ? '#e17838' : '#9eafbd'" :stroke-width="j === active ? 2 : .6" />
  </svg>
</template>
<style scoped>
.binary-image { display: block; width: 52px; height: 52px; flex-shrink: 0; }
</style>
