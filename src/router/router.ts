import { createRouter, createWebHistory } from "vue-router";
import { getAuth,onAuthStateChanged } from 'firebase/auth'
import { useToast } from "vue-toastification";
import { toastOptions } from "../toast/toastOptions";
import { routes } from "./routes";

const toast = useToast();
const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to,from, next) => {
  if(to.matched.some((record) => record.meta.requiresAuth)) {
    if(await getCurrentUser()) {
      next();
    } else {
        toast("You must be logged in", toastOptions);
        next('/')
    } 
  } else {
    next();
  }
})

const getCurrentUser = () => {
  return new Promise((resolve,reject) => {
    const removeListener = onAuthStateChanged(getAuth(),(user) => {
       removeListener();
       resolve(user)
      },
      reject)
  })
}

export default router