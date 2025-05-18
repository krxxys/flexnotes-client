<script setup>
import AppTopbar from '../components/AppTopbar.vue'
import NoteEditor from '../components/Notes/NoteEditor.vue'
import AppFooter from '../components/AppFooter.vue'
import { ref } from "vue";
import { Drawer } from 'primevue';
const visible = ref(false);

</script>
<template>
  <div class="bg-surface-50 dark:bg-surface-800 min-h-screen p-8 flex flex-col gap-6">
    <AppTopbar />


    <NoteEditor class="grow p-2" />

    <div class="mt-auto">
      <AppFooter />
    </div>
  </div>
</template>
