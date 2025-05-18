<script setup>
import { ref } from "vue";
import { Drawer, Button, ButtonGroup } from "primevue";
import Pomodoro from "./Pomodoro.vue";
import Todolist from "./Todolist.vue";
const visible = ref(false);




</script>
<template>
    <div class="card flex justify-center">
        <Drawer v-model:visible="visible" position="right">
            <template #header>
                <a class="text-3xl">Focus Area</a>
            </template>

            <Pomodoro />
            <Todolist />
        </Drawer>
        <Button class="mr-2" icon="pi pi-clock" @click="visible = true" />
    </div>
</template>
