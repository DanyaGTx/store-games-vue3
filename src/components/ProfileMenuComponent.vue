<template>
  <div v-if="isLoggedIn">
    <el-dropdown trigger="click">
      <div class="flex items-center el-dropdown-link cursor-pointer">
        <!-- <img class="w-[50px] mr-[5px]" src="../assets/user.png" alt="" /> -->
        <div class="mr-[10px] w-[50px] h-[50px]">
          <img
            class="w-full h-full object-cover rounded-[50%]"
            :src="userDataStore.getUserProfileAvatar"
            alt=""
          />
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
import { onMounted, ref } from "vue";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { ArrowDown } from "@element-plus/icons-vue";
import {
  ElDropdown,
  ElIcon,
  ElDropdownMenu,
  ElDropdownItem,
} from "element-plus";
import { useToast } from "vue-toastification";
import router from "../router/router";
import { toastOptions } from "../toast/toastOptions";
import { computed } from "@vue/reactivity";

import { useUserDataStore } from "../stores/userData";
const userDataStore = useUserDataStore();

const toast = useToast();
const isLoggedIn = ref(false);
let auth = getAuth();

const handleSignOut = () => {
  signOut(auth).then(() => {
    toast("You are logged out", toastOptions);
    router.push({ name: "login" });
  });
};

const getCurrentUser = computed(() => {
  if (auth.currentUser) {
    return auth.currentUser.email;
  }
});

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true;
    } else {
      isLoggedIn.value = false;
    }
  });
});
</script>

<style lang="scss" scoped></style>
