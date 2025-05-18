<script setup>
import { computed, onBeforeMount, onMounted, ref, watchEffect } from 'vue';
import 'katex/dist/katex.css';

import CodeMirror from 'vue-codemirror6';
import { basicSetup, EditorView } from '@codemirror/basic-setup';
import { markdown as md } from '@codemirror/lang-markdown';
import { HighlightStyle, LanguageSupport, syntaxHighlighting } from '@codemirror/language';

import { Textarea, SplitButton, ScrollPanel, Button, Badge } from 'primevue';
import TagEditDialog from './TagEditDialog.vue';
import { useEditStore } from '../../store/store';
import { storeToRefs } from 'pinia';
import { useConfirm, ConfirmDialog } from 'primevue';
import { useRouter } from 'vue-router';
import TitleEditDialog from './TitleEditDialog.vue';
import { useLayout } from '../../composables/useLayout';
import Sidepanel from '../FocusArea/Sidepanel.vue';


/* overriding markdown language default style */
const minimalMarkdown = new LanguageSupport(md());
const emptyHighlighting = syntaxHighlighting(HighlightStyle.define([]));


const layout = useLayout();
const { isDarkMode } = layout;

const router = useRouter();

const editStore = useEditStore();
const { title, tags, content, rendered_content, visualized } = storeToRefs(editStore);
const { updateNote, fetchNote } = editStore;

onBeforeMount(() => {
  fetchNote()
})

const confirm = useConfirm();
const confirm_exit = () => {
  confirm.require({
    message: 'Do you want save the note before exiting ?',
    header: 'Exit dialog',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      updateNote();
      router.push({ path: '/' })
    },
    reject: () => {
      router.push({ path: '/' })
    }
  })

}


const baseDark = {
  "&": {
    height: "100%",
    "fontSize": "14px"
  },
  ".cm-scroller": { overflow: "auto" },
  ".cm-lineNumbers": {
    width: "2rem",
    textAlign: "right",
    paddingRight: "1rem",
  },
  ".cm-activeLine": { backgroundColor: "#c9c9c91f" },
  ".cm-activeLineGutter": {
    backgroundColor: "#ffffff00"
  },
  ".cm-gutters": {
    backgroundColor: "#00000000",
  },
  ".cm-url": { color: "#6cb6ff", textDecoration: "underline" },
  ".cm-url:hover": { color: "#8ac7ff" }

};

const baseLight = {
  "&": {
    height: "100%",
    "font-size": "14px"
  },
  ".cm-scroller": { overflow: "auto" },
  ".cm-lineNumbers": {
    width: "2rem",
    textAlign: "right",
    paddingRight: "1rem",
  },
  ".cm-activeLine": { backgroundColor: "#2929291f" },
  ".cm-activeLineGutter": {
    backgroundColor: "#ffffff00"
  },
  ".cm-gutters": {
    backgroundColor: "#00000000",
  },

};

const currentTheme = computed(() => {
  return isDarkMode.value ? baseDark : baseLight;
})


const save_button_options = [
  {
    label: "Save", command: () => {
      updateNote();
    }
  },
  { label: "Export" },
  { label: "Help" },
  {
    label: "Exit", command: () => {
      confirm_exit()
    }
  },]

</script>

<template>
  <div
    class="bg-surface-0 dark:bg-surface-900 p-2 rounded-2xl flex flex-col mx-auto border border-surface-200 dark:border-surface-700 w-full">
    <ConfirmDialog />
    <!-- toolbar -->
    <div class="flex flex-row items-center px-2 bg-surface-100 dark:bg-surface-900 h-16 rounded-xl">
      <!-- Left -->
      <div class="mr-auto">
        <div class="flex flex-row items-center">
          <i class="pi pi-book ml-1" style="font-size: 1.25rem;"></i>
          <ToggleSwitch v-model="visualized" class="mx-2"></ToggleSwitch>
        </div>

      </div>
      <!-- Center -->
      <div class="mx-auto inline-flex items-center">
        <a class=" xl:text-2xl md:text-xl">
          {{ title }}
        </a>
        <div v-if="!visualized">
          <TitleEditDialog />
        </div>
      </div>
      <!-- Right -->
      <div class="ml-auto">
        <div class="flex flex-row items-center">
          <Sidepanel/>
          <SplitButton icon="pi pi-file" label="File" :model="save_button_options"></SplitButton>
        </div>
      </div>
    </div>
    <!--Editor -->
    <div class="grow items-center mt-2 h-16">
      <div class="flex flex-col h-full w-full">
        <div v-if="visualized" class="bg-surface-100 dark:bg-surface-800 rounded-t p-2 px-3 h-full">
          <ScrollPanel class="h-full w-full">
            <div class="prose dark:prose-invert prose-headings:mt-0 prose-headings:mb-0 max-w-fit"
              v-html="rendered_content">
            </div>
          </ScrollPanel>
        </div>
        <div v-else class="flex flex-col h-full">
          <ScrollPanel class="h-full bg-surface-100 dark:bg-surface-800">
            <code-mirror class="h-full" :extensions="[minimalMarkdown, emptyHighlighting]" :theme="currentTheme"
              :dark="isDarkMode" basic v-model="content" />
          </ScrollPanel>

        </div>
      </div>
    </div>
    <!-- Tags -->
    <div class="rounded-b bg-surface-100 dark:bg-surface-800 p-2 flex flex-row">
      <a class="text-xl mr-1">Tags: </a>
      <div v-for="tag in tags" :key="tag">
        <Badge class="mx-1 mt-1" :value="tag"></Badge>
      </div>
      <TagEditDialog v-if="!visualized" />
    </div>
  </div>

</template>
