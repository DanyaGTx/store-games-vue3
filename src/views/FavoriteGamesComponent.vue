<template>
  <div>
    <div class="text-[30px] text-white">Favorite Games</div>
    <div
      v-if="!isGamesLoading"
      class="text-white"
      v-for="game in favoriteGames"
    >
      {{ game.name }}

      <el-button @click="deleteGameFromFavorite(game.id)">Delete</el-button>
    </div>
    <div v-else class="absolute left-[50%]">
      <img class="w-[100px] text-center" src="../assets/loader.gif" alt="" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useFavoriteGames } from "../stores/favoriteGames";
import { api } from "../api/api";
import { storeToRefs } from "pinia";
const favoriteGames = ref<GAME[]>([]);
const isGamesLoading = ref(true);

const favoriteGamesStore = useFavoriteGames();
const { favoriteGamesIds } = storeToRefs(favoriteGamesStore);

onMounted(async () => {
  window.scrollTo({
    top: 0,
  });
  await favoriteGamesStore.getFavoriteGamesFromDB();
  // await getGamesForLibrary();
  console.log("Mounteed Favorite Games");
});

const getGamesForLibrary = async () => {
  const favoriteGamesStores = favoriteGamesStore.getFavoriteIds;
  const gamePromises = favoriteGamesStores.map((id) =>
    api.games.getGameById(id)
  );
  const games = [] as GAME[];
  try {
    isGamesLoading.value = true;
    const gameResults = await Promise.all(gamePromises);
    gameResults.forEach((result) => {
      const { id, name } = result.data;
      games.push({ id, name });
    });
    favoriteGames.value = games;
  } catch (error) {
    console.error("Error fetching game data:", error);
  } finally {
    isGamesLoading.value = false;
  }
};

const deleteGameFromFavorite = async (id: number) => {
  await favoriteGamesStore.deleteGameFromLibrary(id);
};

interface GAME {
  name: string;
  id: number;
  // rating: number;
  // background_image: string;
  // maybe I need more fields, who knows..
}

watch(
  () => favoriteGamesIds,
  async (newIds, oldIds) => {
    console.log("favoriteGamesIds Changed");
    await getGamesForLibrary();
  },
  { deep: true }
);
</script>

<style lang="scss" scoped></style>
