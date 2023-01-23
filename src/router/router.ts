import { createRouter, createWebHistory, routerKey } from "vue-router";

import StoreComponent from "../views/StoreComponent.vue";
import CommunityComponent from "../views/CommunityComponent.vue";
import MainUIVue from "../components/MainUI.vue";
import LoginComponent from '../views/LoginComponent.vue'
import RegisterComponent from '../views/RegisterComponent.vue'
import { getAuth,onAuthStateChanged } from 'firebase/auth'
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: `/store`,
      name: "store",
      alias: "/",
      redirect: {
        name: 'route.store'
      },
      component: MainUIVue,
      children: [{ path: "", name: "route.store", component: StoreComponent }],
    
    },
    {
      path: `/community`,
      name: "community",
      component: MainUIVue,
      meta: {
        requiresAuth: true
      },
      children: [{ path: "", name: "community", component: CommunityComponent }],
    },
    {
      path: `/login`,
      name: "login",
      component: LoginComponent,
    },
    {
      path: `/register`,
      name: "register",
      component: RegisterComponent,
    },
  ],
});



router.beforeEach(async (to,from, next) => {
  if(to.matched.some((record) => record.meta.requiresAuth)) {
    if(await getCurrentUser()) {
      next();
    } else {
        alert('you must be logged in');
        next('/')
    } 
  } else {
    next();
  }
})

const getCurrentUser = () => {
  return new Promise((resolve,reject) => {
    const removeListener = onAuthStateChanged(getAuth(),(user ) => {
       removeListener();
       resolve(user)
      },reject)
  })
}

export default router