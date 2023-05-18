<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useUserDataStore } from "./stores/userData";
import { useGamesStoreBasket } from "./stores/gamesBasket";
import { db } from "./firebase/firebase";
import { collection, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import userFields from "./constants/userFields";
const userDataStore = useUserDataStore();

const gamesBasket = useGamesStoreBasket();

const auth = getAuth();

const loadCartGamesFromDatabase = async () => {
  await gamesBasket.setGamesInCart();
};

const updateAccountFields = async () => {
  if (userDataStore.getUserProfileName) {
    const usersRef = collection(db, "users");
    const docRef = doc(usersRef, userDataStore.getUserProfileName);
    await setDoc(docRef, userFields.setup().userFields);
  }
};

onMounted(async () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User is logged in", user);

      loadCartGamesFromDatabase();
      updateAccountFields();
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
