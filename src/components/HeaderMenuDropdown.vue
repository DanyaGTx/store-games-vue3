<template>
  <div v-if="getIsLoggedIn">
    <el-dropdown trigger="click">
      <div class="flex items-center el-dropdown-link cursor-pointer">
        <div class="min-w-[50px] h-[50px]">
          <img
            v-if="getCurrentAvatar"
            class="object-cover rounded-[50%] w-[50px] h-[50px]"
            :src="userDataStore.getUserProfileAvatar"
            alt="avatar"
          />
          <img v-else width="50" src="../assets/user.png" alt="avatar" />
        </div>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="$router.push({ name: 'profile' })">
            Profile
          </el-dropdown-item>
          <el-dropdown-item @click="handleSignOut">Logout</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
  <div v-else>
    <button
      @click="$router.push({ name: 'login' })"
      class="bg-[#26bbff] transition-colors hover:bg-[#85cdee] py-1 px-5 rounded-xl text-black mr-5"
    >
      Sign In
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { ElDropdown, ElDropdownMenu, ElDropdownItem } from "element-plus";
import { useToast } from "vue-toastification";
import { toastOptions } from "../toast/toastOptions";
import router from "../router/router";
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
    } else {
      userDataStore.setIsLoggedInUser(false);
    }
  });
});
</script>

<style lang="scss" scoped></style>
