<script setup>
import { ref, watch, onMounted } from "vue";
import { useLayout } from "./composables/useLayout";
const { primary, surface, isDarkMode } = useLayout();
import { RouterView } from "vue-router";

</script>

<template>
  <main>
  <Toast/>
  <RouterView/>
  </main>
</template>
