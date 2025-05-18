<script setup>
import { Dialog, Button } from 'primevue';
import { ref } from 'vue';
import { api } from '../../http';
import { useNoteStore } from '../../store/store';
import { storeToRefs } from 'pinia';


const noteStore = useNoteStore(); 

const {createNoteEditorVisible} = storeToRefs(noteStore);
const {createNote, setCreateDialogVisiblity} = noteStore;


const title_field = ref("")
const tags_field = ref("")



const on_create_click = async () => {
    createNote(title_field.value, tags_field.value)
}


</script>

<template>
    <Button icon="pi pi-plus" @click="setCreateDialogVisiblity(true)"/>
    <Dialog v-model:visible="createNoteEditorVisible" modal :style="{ width: '25rem'}"  header="Create/Edit Note">
        <div class="flex items-center gap-4 mb-4">
            <label for="note_title">Title</label>
            <InputText v-model="title_field" id="note_title"/>
        </div>
        <div class="flex items-center gap-4 mb-4">
            <label for="note_title">Tags</label>
            <InputText v-model="tags_field" placeholder="example: tag1,tag2,tag3" id="note_title"/>
        </div>
        <Button @click="on_create_click">Create</Button>
    </Dialog>
</template>