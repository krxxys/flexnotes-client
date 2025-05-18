<script setup>
import { computed, ref, watch } from "vue";
import { ButtonGroup, Button } from "primevue";

const options = ref(1);
const timer_started = ref(false);

let intervalId;

const seconds = ref(0);
const minutes = ref(25);



const timer = computed(() => {
    let minutes_text = ""; 
    let seconds_text = "";

    if(minutes.value > 9) {
        minutes_text = minutes.value;
    } else {
        minutes_text = "0" + minutes.value;
    } 

    if(seconds.value > 9) {
        seconds_text = seconds.value; 
    } else {
        seconds_text = "0" + seconds.value;
    }

    return minutes_text + ":" + seconds_text; 
})

const timer_toggle = () => {
    timer_started.value = !timer_started.value;
    if (timer_started.value == true) {
        intervalId = setInterval(() => {
            seconds.value--; 
            
            if(seconds.value <= 0) {
                minutes.value--; 
                seconds.value = 59;
            }

            if(minutes.value == 0 && seconds.value == 0) {
                    timer_started.value = false; 
                    clearInterval(intervalId)
            }
        }, 1000)
    } else {
        clearInterval(intervalId);
    }
}

const clear = () => {
    clearInterval(intervalId);
    change_timer(options.value);
    timer_started.value = false;
}

const change_timer = (option) => {
    options.value = option;
    switch (option) {
        case 1: 
            minutes.value = 25;
            seconds.value = 0;
            break; 
        case 2: 
            minutes.value = 5;
            seconds.value = 0;
            break;
        case 3: 
            minutes.value = 15;
            seconds.value = 0;
            break;
    }
}

</script>
<template>
    <div>
        <a class="text-2xl">Pomodoro</a>
        <div class="flex flex-col">
            <ButtonGroup class="mx-auto mt-2">
                <Button size="small" label="Basic" @click="change_timer(1)"/>
                <Button size="small" label="Short Break" @click="change_timer(2)"/>
                <Button size="small" label="Long Break" @click="change_timer(3)" />
            </ButtonGroup>

            <a class=" text-7xl mx-auto my-2"> {{ timer }}</a>

            <div class="mx-auto mt-2">
                <Button class="w-30" size="small" @click="timer_toggle">{{ timer_started ? "Stop" :
                    "Start" }}
                </Button>
                <Button class="w-30 ml-2" size="small" label="Clear" @click="clear"/> 
            </div>
        </div>
    </div>
</template>