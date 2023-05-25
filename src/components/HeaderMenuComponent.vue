<template>
  <div v-if="getIsLoggedIn">
    <el-dropdown trigger="click">
      <div class="flex items-center el-dropdown-link cursor-pointer">
        <div class="mr-[10px] min-w-[50px] h-[50px]">
          <img
            v-if="getCurrentAvatar"
            class="object-cover rounded-[50%] w-[50px] h-[50px]"
            :src="userDataStore.getUserProfileAvatar"
            alt=""
          />
          <img v-else src="../assets/user.png" alt="" />
        </div>

        <h3 class="text-white">{{ getCurrentUser }}</h3>
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="$router.push({ name: 'settings' })"
            >Profile</el-dropdown-item
          >
          <el-dropdown-item @click="handleSignOut">Logout</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
  <div v-else>
    <h2
      @click="$router.push({ name: 'login' })"
      class="cursor-pointer text-gray-500"
    >
      Login
    </h2>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { ArrowDown } from "@element-plus/icons-vue";
import {
  ElDropdown,
  ElIcon,
  ElDropdownMenu,
  ElDropdownItem,
} from "element-plus";
import router from "../router/router";
import { useToast } from "vue-toastification";
import { toastOptions } from "../toast/toastOptions";

import { useUserDataStore } from "../stores/userData";
const userDataStore = useUserDataStore();

const toast = useToast();

let auth = getAuth();

const handleSignOut = () => {
  signOut(auth).then(() => {
    toast("You are logged out", toastOptions);
    router.push({ name: "login" });
  });
};

const getCurrentUser = computed(() => {
  return userDataStore.getUserProfileName;
});

const getCurrentAvatar = computed(() => {
  return userDataStore.getUserProfileAvatar;
});

const getIsLoggedIn = computed(() => {
  return userDataStore.getIsLoggedIn;
});

onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (user?.email) {
      userDataStore.setIsLoggedInUser(true);
      userDataStore.setUserEmail(user.email);
      if (user?.displayName) {
        userDataStore.setUserProfileName(user.displayName);
      } else {
        userDataStore.setUserProfileName(user.email);
      }
      console.log(user);
    } else {
      userDataStore.setIsLoggedInUser(false);
    }
  });
});
</script>

<style lang="scss" scoped></style>
