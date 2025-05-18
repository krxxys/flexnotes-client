<script setup>
import { Dialog, Button, Textarea, InputText } from 'primevue';
import { onBeforeMount, onMounted, ref } from 'vue';
import { useEditStore } from '../../store/store';
import { storeToRefs } from 'pinia';
const editStore = useEditStore();
const { updateNote } = editStore; 
const {tags} = storeToRefs(editStore);


const visible = ref(false);
const tag_input_temp = ref("");
const tags_temp = ref([]);




const save_click = async () => {
    console.log(typeof(tags_temp), tags_temp)
    tags.value = tags_temp.value;
    updateNote();
    visible.value = false;
}
const add_click = async () => {
    tags_temp.value.push(tag_input_temp.value);
    tag_input_temp.value = "";
}

const delete_tag = async (tag) => {
    tags_temp.value = tags_temp.value.filter(item => item !== tag)
}

const onOpenButtonClick = () => {
    tags_temp.value = [...tags.value];
    visible.value = true; 
}

</script>
<template>
    <Button size="small" class="mt-1 mx-1 h-6" icon="pi pi-plus" @click="onOpenButtonClick"></Button>
    <Dialog v-model:visible="visible" modal :style="{ width: '25rem' }" header="Edit your note Tags">
        <div v-for="(tag) in tags_temp" :key="tag" class="flex items-center gap-4 mb-4">
            <a class="tex-sm">{{ tag }}</a>
            <div class="ml-auto">
                <Button icon="pi pi-trash" size="small" @click="delete_tag(tag)"></Button>
            </div>
        </div>
        <div class="flex w-full">
            <InputText class="grow mr-2" v-model="tag_input_temp"/>
            <Button class="ml-auto" icon="pi pi-plus" @click="add_click" />
        </div>
        <div class="mt-2">
            <Button @click="save_click" icon="pi pi-save" label="Save" />
            <Button class="ml-2" icon="pi pi-times" label="Cancel" @click="visible = false" />
        </div>
    </Dialog>
</template>