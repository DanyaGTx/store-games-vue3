<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useUserDataStore } from "./stores/userData";
import { useGamesStoreBasket } from "./stores/gamesBasket";
import { useFavoriteGames } from "./stores/favoriteGames";

const userDataStore = useUserDataStore();
const gamesBasket = useGamesStoreBasket();
const favoriteGamesStore = useFavoriteGames();

const auth = getAuth();

const loadCartGamesFromDatabase = async () => {
  await gamesBasket.setGamesInCart();
};

onMounted(async () => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      await favoriteGamesStore.getFavoriteGamesFromDB();
      loadCartGamesFromDatabase();
      if (user.photoURL) {
        userDataStore.setUserProfileAvatar(user.photoURL);
      } else {
        userDataStore.setUserProfileAvatar("");
      }
    } else {
      console.log("User is logged out");
    }
  });
});
</script>

<style>
body {
  @apply bg-primary;
}
::placeholder {
  /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: black;
  opacity: 1; /* Firefox */
}

:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: black;
}

::-ms-input-placeholder {
  /* Microsoft Edge */
  color: black;
}
</style>
