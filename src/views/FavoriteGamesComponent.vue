<template>
  <div class="w-full">
    <div class="text-[30px] text-white">Favorite Games</div>
    <div v-if="isGamesLoading">
      <p class="text-center text-white text-[20px]">Loading...</p>
      <img
        class="w-[100px] text-center m-auto"
        src="../assets/loader.gif"
        alt=""
      />
    </div>
    <div
      v-if="!isGamesLoading && favoriteGames.length"
      class="text-white mb-[10px] mt-[20px] max-[450px]:m-[20px] mr-[15px] animate__animated animate__fadeIn"
      v-for="game in favoriteGames"
    >
      <div
        class="flex gap-2 max-[450px]:flex-col max-[380px]:border-blue-500 max-[380px]:border-2 max-[380px]:p-[10px] max-[380px]:rounded-md bg-slate-600 p-[10px] rounded-md"
        :class="game.isDeleting ? 'animate__animated animate__zoomOut' : ''"
      >
        <div
          @click="openCardDetails(game.id)"
          class="max-w-[200px] min-[450px]:min-h-[220px] max-[450px]:max-w-full"
        >
          <img
            class="cursor-pointer w-full h-full object-cover min-[450px]:min-w-[200px] max-[450px]:max-w-full rounded-lg"
            :src="game.background_image"
            alt=""
          />
        </div>

        <div class="flex flex-col justify-between max-[450px]:flex-col">
          <div>
            <h2>{{ game.name }}</h2>
            <h3>Date of Release: {{ game.released }}</h3>
            <h3>Rating: {{ game.rating }}</h3>
            <div class="mb-[10px]">
              <a
                class="text-blue-500 underline"
                :href="game.website"
                target="_blank"
                >Original Website</a
              >
            </div>
          </div>
          <div>
            <el-button @click="deleteGameFromFavorite(game.id)"
              >Delete</el-button
            >
          </div>
        </div>
      </div>
    </div>
    <div
      v-else-if="!isGamesLoading && !favoriteGamesStore.getFavoriteIds.length"
      class="text-[20px] text-[#cdcdcd] max-[650px]:text-[18px] max-[370px]:text-[16px] max-[350px]:text-[14px]"
    >
      <p class="text-center max-[650px]:text-left">
        You don't have favourite games yet :(
      </p>
    </div>
    <div class="absolute bottom-0">
      <img
        class="m-auto w-full"
        v-if="!isGamesLoading && !favoriteGamesStore.getFavoriteIds.length"
        src="../assets/nothingInLibrary.png"
        alt=""
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { onMounted, ref, watch, markRaw } from "vue";
import { storeToRefs } from "pinia";
import { useFavoriteGames } from "../stores/favoriteGames";
import { api } from "../api/api";
import { ElMessageBox } from "element-plus";
import { Delete } from "@element-plus/icons-vue";
import "animate.css";
const favoriteGames = ref<GAME[]>([]);
const isGamesLoading = ref(true);

const favoriteGamesStore = useFavoriteGames();
const { favoriteGamesIds } = storeToRefs(favoriteGamesStore);
const router = useRouter();
onMounted(async () => {
  window.scrollTo({
    top: 0,
  });
  try {
    console.log("Грузимся");
    isGamesLoading.value = true;
    await favoriteGamesStore.getFavoriteGamesFromDB();
    isGamesLoading.value = false;
  } catch (e) {
    console.log(e);
  } finally {
    console.log("отключаем загрузку");
  }
});

const getGamesForLibrary = async () => {
  const favoriteGamesStores = favoriteGamesStore.getFavoriteIds;
  const gamePromises = favoriteGamesStores.map((id) =>
    api.games.getGameById(id)
  );
  const games = [] as GAME[];
  try {
    // isGamesLoading.value = true;
    const gameResults = await Promise.all(gamePromises);
    gameResults.forEach((result) => {
      console.log("GAME RESULT", result.data);
      const { id, name, website, background_image, rating, released } =
        result.data;
      games.push({
        id,
        website,
        name,
        background_image,
        released,
        rating,
        isDeleting: false,
      });
    });
    favoriteGames.value = games;
  } catch (error) {
    console.error("Error fetching game data:", error);
  } finally {
    // isGamesLoading.value = false;
  }
};

const deleteGameFromFavorite = async (id: number) => {
  try {
    await ElMessageBox.confirm(
      "Are you sure to delete this game from library?",
      "Warning",
      {
        type: "warning",
        icon: markRaw(Delete),
        cancelButtonText: "No",
        confirmButtonText: "Yes",
      }
    );
    const deletingGame = favoriteGames.value.find((game) => game.id === id);
    if (deletingGame) {
      deletingGame.isDeleting = true;
    }
    setTimeout(async () => {
      await favoriteGamesStore.deleteGameFromLibrary(id);
    }, 600);
    // Perform deletion logic here
  } catch (error) {
    return error;
  }
};

interface GAME {
  name: string;
  id: number;
  website: string;
  background_image: string;
  isDeleting: boolean;
  released: string;
  rating: string;
}

const openCardDetails = (id: number) => {
  router.push({
    name: "game-details",
    params: { id },
  });
};

watch(
  () => favoriteGamesIds,
  async (newIds, oldIds) => {
    console.log("favoriteGamesIds Changed");
    await getGamesForLibrary();
  },
  { deep: true }
);

watch(
  () => favoriteGames.value.length > 0,
  (newGames, oldGames) => {
    isGamesLoading.value = false;
  }
);
</script>

<style lang="scss" scoped></style>
