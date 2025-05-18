<script setup>
import { Button, InputText, Checkbox, Select } from 'primevue';
import { storeToRefs } from 'pinia';
import { useEditStore } from '../../store/store';
import { ref } from 'vue';

const editStore = useEditStore();

const { todos } = storeToRefs(editStore); 
const { addTodo, fetchTodos, deleteTodo, updateTodo } = editStore; 

const priorities = ["Low", "Normal", "High"]
const selectedPriority = ref(priorities[0])
const todo_title = ref("")


const addTodoButtonClick = async () => {
    addTodo(todo_title.value, selectedPriority.value).then(() => {
        selectedPriority.value = priorities[0];
        todo_title.value = ""
    }); 
}

</script>
<template>
    <div class="mt-4">
        <a class="text-2xl">Todo list </a>
        <div class="flex">
            <div class="mt-2">
                <div>
                    <InputText class="w-full" v-model="todo_title" placeholder="Title"/>
                    <div class="flex mt-2">
                        <Select class="w-full" v-model="selectedPriority" :options="priorities"></Select>
                        <Button class="ml-1" @click="addTodoButtonClick()" icon="pi pi-plus"/>
                    </div>
                </div>
                <div class="w-full" v-for="todo in todos" :key="todo._id.$oid">
                    <div class="flex mt-2">
                        <div class="mt-2 inline-flex">
                            <Checkbox :binary="true" v-model="todo.status" @click="updateTodo(todo)" class="mr-2 mt-0.5" :input-id="todo._id"/>   
                                <label class="items-center" :for="todo._id">
                                    <div v-if="todo.status == true" class=" line-through">
                                        {{ todo.title }}
                                    </div>
                                    <div v-else >
                                            {{ todo.title }}
                                    </div>
                                    {{ todo.priority }}
                                </label>
                        </div>
                        <div class="ml-auto">
                            <Button @click="deleteTodo(todo)" icon="pi pi-trash" variant="text"/>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>