import StorePage from "../views/StorePage.vue";
import FavoriteGamesPage from "../views/FavoriteGamesPage.vue";
import MainPage from "../views/MainPage.vue";
import LoginPage from "../views/LoginPage.vue";
import ProfilePage from "../views/ProfilePage.vue";
import GameCardDetails from "../components/GameCardDetails.vue";
import CreatorsPage from "../views/CreatorsPage.vue";

export const routeNames = {
  store: "store",
  favorite: "favorite",
  creators: "creators",
  login: "login",
  register: "register",
  profile: "profile",
  game_details: "game-details",
};

export const routes = [
  {
    path: `/store`,
    name: routeNames.store,
    alias: "/",
    component: MainPage,
    children: [{ path: "", name: "route.store", component: StorePage }],
    redirect: {
      name: "route.store",
    },
    meta: {
      header: 1,
    },
  },
  {
    path: `/favorite`,
    name: routeNames.favorite,
    component: MainPage,
    meta: {
      requiresAuth: true,
    },
    children: [
      { path: "", name: "route.favorite", component: FavoriteGamesPage },
    ],
    redirect: {
      name: "route.favorite",
    },
  },
  {
    path: `/creators`,
    name: routeNames.creators,
    component: MainPage,
    meta: {
      requiresAuth: false,
      header: 0,
    },
    children: [{ path: "", name: "route.news", component: CreatorsPage }],
    redirect: {
      name: "route.news",
    },
  },
  {
    path: `/login`,
    name: routeNames.login,
    component: LoginPage,
  },
  {
    path: `/profile`,
    name: routeNames.profile,
    component: MainPage,
    meta: {
      requiresAuth: true,
      header: 0,
    },
    children: [
      { path: "", name: "route.profile", component: ProfilePage },
    ],
    redirect: {
      name: "route.profile",
    },
  },
  {
    path: `/store/card/:id`,
    name: routeNames.game_details,
    component: MainPage,
    meta: {
      requiresAuth: false,
    },
    children: [
      { path: "", name: "route.game-details", component: GameCardDetails },
    ],
    redirect: {
      name: "route.game-details",
    },
  },
];
