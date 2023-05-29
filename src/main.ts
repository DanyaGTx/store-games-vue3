import { createApp } from "vue";
import { initializeFirebase } from './firebase/firebase'
import { createPinia } from 'pinia'
import ElementPlus from "element-plus";
import router from "./router/router";
import toast from "./toast";
import App from "./App.vue";
import "./style.css";
import "./styles/font.css";
import "element-plus/dist/index.css";

const pinia = createPinia()

export const plugins = [ElementPlus, router, toast, pinia];
const app = createApp(App);

plugins.forEach((plugin) => {
  app.use(plugin);
});
initializeFirebase()
app.mount("#app");
