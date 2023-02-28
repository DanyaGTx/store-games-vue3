import { createApp } from "vue";
import { createPinia } from 'pinia'
import ElementPlus from "element-plus";
import App from "./App.vue";

import router from "./router/router";
import toast from "./toast";
import "./style.css";
import "./styles/font.css";
import "element-plus/dist/index.css";
import { initializeFirebase } from './firebase/firebase'



const pinia = createPinia()

export const plugins = [ElementPlus, router, toast, pinia];
const app = createApp(App);

plugins.forEach((plugin) => {
  app.use(plugin);
});
initializeFirebase()
app.mount("#app");
