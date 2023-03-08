<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useUserDataStore } from "./stores/userData";
const userDataStore = useUserDataStore();
const auth = getAuth();
onMounted(async () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User is logged in", user);

      if (user.displayName && user.photoURL) {
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
