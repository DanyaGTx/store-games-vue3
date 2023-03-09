<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useUserDataStore } from "./stores/userData";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase/firebase";
import { useGamesStoreBasket } from "./stores/gamesBasket";
const userDataStore = useUserDataStore();

const gamesBasket = useGamesStoreBasket();

const auth = getAuth();

const loadCartGamesFromDatabase = async () => {
  await gamesBasket.setGamesInCart();
};

onMounted(async () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User is logged in", user);

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
  background-color: #252836;
  /* padding: 10px; */
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
