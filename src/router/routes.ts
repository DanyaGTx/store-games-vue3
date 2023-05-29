import StoreComponent from "../views/StoreComponent.vue";
import FavoriteGamesComponent from "../views/FavoriteGamesComponent.vue";
import MainUIVue from "../views/MainUI.vue";
import RegisterComponent from "../views/RegisterComponent.vue";
import LoginComponent from '../views/LoginComponent.vue'
import ProfileComponent from "../views/ProfileComponent.vue";
import GameCardDetails from "../components/GameCardDetails.vue";
import CreatorsComponent from '../views/CreatorsComponent.vue'

export const routeNames = {
    store: 'store',
    favorite: 'favorite',
    news: 'news',
    login: 'login',
    register: 'register',
    profile: 'profile',
    game_details: 'game-details',
}

export const routes = [
  {
    path: `/store`,
    name: routeNames.store,
    alias: "/",
    component: MainUIVue,
    children: [{ path: "", name: "route.store", component: StoreComponent }],
    redirect: {
      name: 'route.store'
    },
  },
  {
    path: `/favorite`,
    name: routeNames.favorite,
    component: MainUIVue,
    meta: {
      requiresAuth: true
    },
    children: [{ path: "", name: "route.favorite", component: FavoriteGamesComponent }],
    redirect: {
      name: 'route.favorite'
    },
  },
  {
    path: `/news`,
    name: routeNames.news,
    component: MainUIVue,
    meta: {
      requiresAuth: false
    },
    children: [{ path: "", name: "route.news", component: CreatorsComponent }],
    redirect: {
      name: 'route.news'
    },
  },
  {
    path: `/login`,
    name: routeNames.login,
    component: LoginComponent,
  },
  {
    path: `/register`,
    name: routeNames.register,
    component: RegisterComponent,
  },
  {
    path: `/profile`,
    name: routeNames.profile,
    component: MainUIVue,
    meta: {
      requiresAuth: true
    },
    children: [{ path: "", name: "route.profile", component: ProfileComponent }],
    redirect: {
      name: 'route.profile'
    },
  },
  {
    path: `/store/card/:id`,
    name: routeNames.game_details,
    component: MainUIVue,
    meta: {
      requiresAuth: false
    },
    children: [{ path: "", name: "route.game-details", component: GameCardDetails }],
    redirect: {
      name: 'route.game-details'
    },
  },
]