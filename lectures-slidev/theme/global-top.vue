<script setup lang="ts">
import { useNav } from '@slidev/client'
const { currentSlideNo, total } = useNav()
</script>
<template>
  <div v-if="currentSlideNo > 1" class="course-header">DEEP GENERATIVE MODELS · MIPT & YSDA · 2026</div>
  <div class="course-folio">{{ currentSlideNo }} / {{ total }}</div>
  <CourseTools />
</template>
