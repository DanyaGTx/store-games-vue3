<template>
  <div class="w-full">
    <h1 class="text-[30px] text-white mb-[20px]">Games</h1>
    <div v-if="!isLoading && !isError">
      <div
        class="grid gap-4 m-[10px] grid-cols-4 max-[1300px]:grid-cols-3 max-[1100px]:grid-cols-2 max-[750px]:grid-cols-1"
      >
        <game-card
          @click="openCardDetails(game.id)"
          v-for="game in allGamesStore.allGames"
          :key="game.id"
          :game="game"
          :isLoading="isLoading"
        >
        </game-card>
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
    <div v-else-if="!isError" class="absolute left-[50%]">
      <img class="w-[100px]" src="../assets/loader.gif" alt="" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { ElPagination } from "element-plus";
//@ts-ignore
import debounce from "lodash.debounce";

import GameCard from "../components/GameCard.vue";
import { useWindowSize } from "@vueuse/core";

import { useAllGamesStore } from "../stores/allGames";
import { useGamesStoreBasket } from "../stores/gamesBasket";
import { useToast } from "vue-toastification";

import { toastOptions } from "../toast/toastOptions";
import { getAuth } from "@firebase/auth";
const toast = useToast();

const router = useRouter();

const allGamesStore = useAllGamesStore();
const gamesBasket = useGamesStoreBasket();
const { width } = useWindowSize();

interface GAME {
  name: string;
  id: number;
  rating: number;
  background_image: string;
}
const props = defineProps<{
  searchQuery: string;
}>();

const games = ref<GAME[]>([]);
const isLoading = ref(false);
const isError = ref(false);
const currentPage = ref(1);

const setCurrentPage = (page: number) => {
  isLoading.value = true;
  currentPage.value = page;
  window.scrollTo({
    top: 0,
  });
};

const openCardDetails = (id: number) => {
  router.push({
    name: "game-details",
    params: { id },
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

const fetchGamesWithSearch = async (page: number, searchQuery: string) => {
  await allGamesStore.getGamesBySearch(page, searchQuery);
  isLoading.value = false;
};

watch(currentPage, (newPage) => {
  fetchGamesWithSearch(currentPage.value, props.searchQuery);
});

watch(
  () => props.searchQuery,
  debounce(async (searchQuery: string) => {
    setCurrentPage(1);
    await fetchGamesWithSearch(currentPage.value, searchQuery);
  }, 1000)
);

const user = getAuth().currentUser;
onMounted(async () => {
  try {
    if (user?.email) {
      console.log(user.email);
    }
    isLoading.value = true;

    await fetchGamesWithSearch(currentPage.value, props.searchQuery);
    isLoading.value = false;
  } catch (error) {
    isError.value = true;
    toast.error("Error: " + error, toastOptions);
    isLoading.value = false;
  }

  console.log(games.value);
});
</script>

<style scoped></style>
