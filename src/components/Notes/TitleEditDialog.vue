<script setup>
import { Dialog, Button, Textarea, InputText } from 'primevue';
import { ref } from 'vue';
import { useEditStore } from '../../store/store';
import { storeToRefs } from 'pinia';
const editStore = useEditStore();
const { updateNote } = editStore; 
const {title} = storeToRefs(editStore);
const title_temp = ref(""); 
const visible = ref(false);

const onSaveClick = async () => {
    title.value = title_temp.value; 
    updateNote(); 
    visible.value = false;  
}

const openButtonClick = () => {
    title_temp.value = title.value
    visible.value = true;
}

</script>
<template>
    <Button size="small" class="ml-2 mt-1 mx-1 h-6" icon="pi pi-pencil" @click="openButtonClick"></Button>
    <Dialog v-model:visible="visible" modal :style="{ width: '25rem' }" header="Edit note title">
        <InputText class="w-full" v-model="title_temp"/>
        <div class="mt-2">
            <Button class="ml" @click="onSaveClick">Save</Button>
            <Button class="ml-2" @click="visible = false">Cancel</Button>
        </div>
    </Dialog>
</template>