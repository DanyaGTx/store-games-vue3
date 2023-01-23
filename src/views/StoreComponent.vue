<template>
  <div class="w-full">
    <h1 class="text-[30px] text-white mb-[20px]">Games</h1>
    <div v-if="!isLoading && !isError">
      <div
        class="grid gap-4 grid-cols-3 max-[1000px]:grid-cols-2 max-[750px]:grid-cols-1"
      >
        <game-card
          v-for="game in games"
          :key="game.id"
          :game="game"
        ></game-card>
      </div>
      <div class="mt-[30px]">
        <el-pagination
          @current-change="setCurrentPage"
          :current-page="currentPage"
          background
          layout="prev, pager, next"
          :total="1000"
          :small="calculatedSizePagination"
          :pager-count="calculatedSizePagerCount"
        />
      </div>
    </div>
    <div v-else-if="!isError" class="absolute right-[48%]">
      <img class="w-[100px]" src="../assets/loader.gif" alt="" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from "vue";

import { ElPagination } from "element-plus";

import GameCard from "../components/GameCard.vue";
import { useWindowSize } from "@vueuse/core";

import { api } from "../api/api.js";

import { useToast } from "vue-toastification";

import { toastOptions } from "../toast/toastOptions";
import { getAuth } from "@firebase/auth";

const toast = useToast();

const { width } = useWindowSize();

interface GAME {
  name: string;
  id: number;
  rating: number;
  background_image: string;
}

const games = ref<GAME[]>([]);
const isLoading = ref(false);
const isError = ref(false);
const currentPage = ref(1);

const setCurrentPage = (page: number) => {
  currentPage.value = page;
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const calculatedSizePagination = computed(() => {
  if (width.value <= 700) {
    return true;
  } else {
    return false;
  }
});

const calculatedSizePagerCount = computed(() => {
  if (width.value <= 450) {
    return 3;
  } else if (width.value <= 650) {
    return 5;
  } else {
    return 7;
  }
});

const fetchGames = async (page: number) => {
  const { data } = await api.games.getGames(page);

  games.value = data.results;
};

watch(currentPage, (newPage) => {
  fetchGames(newPage);
});

// const getCurrentUser = computed(() => {
//   const user = getAuth().currentUser;
//   if (user) {
//     return user.email;
//   } else {
//     return "human";
//   }
// }
const user = getAuth().currentUser;
onMounted(async () => {
  try {
    if (user?.email) {
      console.log(user.email);
    }
    isLoading.value = true;
    await fetchGames(currentPage.value);
    isLoading.value = false;
  } catch (error) {
    isError.value = true;
    toast.error("Error: " + error, toastOptions);
    isLoading.value = false;
  }

  console.log(games.value);
});
</script>

<style lang="scss" scoped></style>
