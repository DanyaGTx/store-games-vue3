import { createApp } from "vue";
import { createPinia } from 'pinia'
import ElementPlus from "element-plus";
import App from "./App.vue";

import router from "./router/router";
import toast from "./toast";
import "./style.css";
import "./styles/font.css";
import "element-plus/dist/index.css";



// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDejbB3Du5N_Q9_e9ldb2YR45LbZsEsZPs",
  authDomain: "gamesstorevue3.firebaseapp.com",
  projectId: "gamesstorevue3",
  storageBucket: "gamesstorevue3.appspot.com",
  messagingSenderId: "495024675538",
  appId: "1:495024675538:web:a7e55f3b44d2e19ae42b0b"
};

// Initialize Firebase
initializeApp(firebaseConfig);


const pinia = createPinia()

export const plugins = [ElementPlus, router, toast, pinia];

const app = createApp(App);

plugins.forEach((plugin) => {
  app.use(plugin);
});

app.mount("#app");
