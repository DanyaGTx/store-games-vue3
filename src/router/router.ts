import { createRouter, createWebHistory } from "vue-router";
import StoreComponent from "../views/StoreComponent.vue";
import FavoriteGamesComponent from "../views/FavoriteGamesComponent.vue";
import MainUIVue from "../components/MainUI.vue";
import RegisterComponent from "../views/RegisterComponent.vue";
import LoginComponent from '../views/LoginComponent.vue'
import SettingsComponent from "../views/ProfileComponent.vue";
import GameCardDetails from "../components/GameCardDetails.vue";
import NewsComponent from '../views/NewsComponent.vue'
import { getAuth,onAuthStateChanged } from 'firebase/auth'
import { useToast } from "vue-toastification";
import { toastOptions } from "../toast/toastOptions";

const toast = useToast();
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
      path: `/favorite`,
      name: "favorite",
      redirect: {
        name: 'route.favorite'
      },
      component: MainUIVue,
      meta: {
        requiresAuth: true
      },
      children: [{ path: "", name: "route.favorite", component: FavoriteGamesComponent }],
    },
    {
      path: `/news`,
      name: "news",
      redirect: {
        name: 'route.news'
      },
      component: MainUIVue,
      meta: {
        requiresAuth: false
      },
      children: [{ path: "", name: "route.news", component: NewsComponent }],
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
    {
      path: `/settings`,
      name: "settings",
      redirect: {
        name: 'route.settings'
      },
      component: MainUIVue,
      meta: {
        requiresAuth: true
      },
      children: [{ path: "", name: "route.settings", component: SettingsComponent }],
    },
    {
      path: `/store/card/:id`,
      name: "game-details",
      redirect: {
        name: 'route.game-details'
      },
      component: MainUIVue,
      meta: {
        requiresAuth: false
      },
      children: [{ path: "", name: "route.game-details", component: GameCardDetails }],
    },
  ],
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