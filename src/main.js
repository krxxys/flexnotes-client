import "./assets/styles/main.css";

import { createApp } from "vue";
import PrimeVue from "primevue/config";
import App from "./App.vue";
import Aura from "@primevue/themes/aura";
import Checkbox from "primevue/checkbox";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import FloatLabel from "primevue/floatlabel";
import Toolbar from "primevue/toolbar";
import ToggleSwitch from "primevue/toggleswitch";
import SelectButton from "primevue/selectbutton";
import StyleClass from "primevue/styleclass";
import { ConfirmationService, Toast } from "primevue";
import { createPinia } from "pinia";
import { ToastService } from "primevue";


const app = createApp(App);

const pinia = createPinia();



import router from "./router"

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: ".p-dark",
    },
  },
});

app.component("Button", Button);
app.component("InputText", InputText);
app.component("FloatLabel", FloatLabel);
app.component("Toolbar", Toolbar);
app.component("ToggleSwitch", ToggleSwitch);
app.component("SelectButton", SelectButton);
app.component("Toast", Toast);
app.component("Checkbox", Checkbox)
app.directive("styleclass", StyleClass);



app.use(pinia).use(router).use(ConfirmationService).use(ToastService).mount("#app");
