<script setup>
import { ref, watch, onMounted, onBeforeMount, computed } from 'vue'
import AppTopbar from '../components/AppTopbar.vue'
import AppFooter from '../components/AppFooter.vue'
import Card from 'primevue/card'
import { useLayout } from '../composables/useLayout'
const { primary, surface, isDarkMode } = useLayout()
import NoteList from '../components/Notes/NoteList.vue'
</script>

<template>
  <div class="bg-surface-50 dark:bg-surface-800 min-h-screen p-8 flex flex-col gap-6">
    <AppTopbar />
    <NoteList />
    <div class="mt-auto">
      <AppFooter />
    </div>
  </div>
</template>
