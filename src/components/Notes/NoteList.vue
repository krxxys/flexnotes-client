<script setup>
import {InputText, Button, Badge, Card, Config, useConfirm, ConfirmDialog } from 'primevue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { ref, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

import { api } from '../../http';
import NoteEditDialog from './NoteEditDialog.vue';
import { useNoteStore, useEditStore } from '../../store/store';

const noteStore = useNoteStore();
const editStore = useEditStore();

const { notes, loading, searchQuery, filteredNotes } = storeToRefs(noteStore);
const { deleteNote, fetchNotes } = noteStore;
const { setCurrentNote } = editStore;

const router = useRouter();

onMounted(() => {
  fetchNotes()
})


const edit_click = (oid) => {
  setCurrentNote(oid);
  router.push({ path: "editor" });
}

const refresh_click = () => {
  fetchNotes();
}

const perform_note_delete = async (oid) => {
  deleteNote(oid);
};

const confirm = useConfirm();
const confirm_delete = (item) => {
  confirm.require({
    message: 'Are you sure you wanna delete: ' + item.title + "?",
    header: "Statement",
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      perform_note_delete(item.id.$oid)
    },
    reject: () => {

    }
  })
}

</script>
<template>
  <div
    class="grow p-2 dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-700 mx-auto w-full">
    <DataTable :value="filteredNotes" data-key="id.$oid">
      <template #header>
        <div class="flex">
          <div class="mr-auto text-3xl">
            Your notes
          </div>
          <div class="mx-auto flex">
            <InputText v-model="searchQuery" placeholder="Search by name or tag" type="text" />
          </div>
          <div class="ml-auto *:ml-2">
            <NoteEditDialog />
            <Button icon="pi pi-refresh" @click="refresh_click" />
          </div>
        </div>
      </template>
      <Column field="title" header="Title"></Column>
      <Column>
        <template #header>
          <div>Tags</div>
        </template>
        <template #body="{ data }">
          <div class="inline" v-for="tag in data.tags" :key="tag">
            <Badge v-if="tag" class="mx-1 mt-1" :value="tag"></Badge>
          </div>
        </template>
      </Column>
      <Column>
        <template #header>
          <div class="ml-auto">
            Action
          </div>
        </template>
        <template #body="{ data }">
          <div class="flex">
            <div class="ml-auto flex">
              <Button icon="pi pi-pencil" @click="edit_click(data.id.$oid)" />
              <span class="mx-1"/>
              <Button icon="pi pi-trash" @click="confirm_delete(data)" />
            </div>
          </div>
        </template>
      </Column>
    </DataTable>
    <ConfirmDialog />
  </div>
</template>