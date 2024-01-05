<template>
  <div class="w-full">
    <div class="text-[30px] text-white">Favorite Games</div>

    <div v-if="!isGamesLoading && filteredFavoriteGames.length">
      <div
        class="text-white mb-[10px] mt-[20px] animate__animated animate__fadeIn"
        v-for="game in filteredFavoriteGames"
      >
        <div
          class="flex justify-between border-b border-gray-700 py-[10px] max-[768px]:block"
        >
          <div
            class="flex gap-2 max-[680px]:block"
            :class="game.isDeleting ? 'animate__animated animate__zoomOut' : ''"
          >
            <div @click="openCardDetails(game.id)" class="zoom-image-container">
              <img
                class="zoom-image cursor-pointer w-full h-full object-cover"
                :src="game.background_image"
                alt="Game Image"
              />
            </div>

            <div class="flex flex-col justify-between max-[680px]:mt-2">
              <div>
                <h2 class="text-2xl max-[680px]:text-lg">{{ game.name }}</h2>
                <h3>Date of Release: {{ game.released }}</h3>
                <div>
                  <div class="flex items-center gap-1">
                    <el-rate
                      v-model="game.rating"
                      disabled-void-color="#EFF2F7"
                      disabled
                    />
                    <p class="text-base">{{ game.rating }}</p>
                  </div>
                </div>
                <div class="mb-[10px]">
                  <a
                    class="text-blue-500 underline"
                    :href="game.website"
                    target="_blank"
                  >
                    Original Website
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="max-[768px]:mt-3">
            <el-button @click="deleteGameFromFavorite(game.id)">
              Delete
            </el-button>
          </div>
        </div>
      </div>
      <div v-if="filteredFavoriteGames.length > 2">
        <el-button type="danger" @click="deleteAllGames">
          Delete All Games
        </el-button>
      </div>
    </div>

    <div
      v-else-if="
        !isGamesLoading &&
        !filteredFavoriteGames.length &&
        props.searchQuery &&
        favoriteGamesStore.getFavoriteIds.length
      "
      class="text-[20px] text-[#cdcdcd] max-[650px]:text-[18px] max-[370px]:text-[16px] max-[350px]:text-[14px]"
    >
      <p class="text-center max-[650px]:text-left">
        Nothing found in your library
      </p>
    </div>

    <div v-if="!isGamesLoading && !favoriteGamesStore.getFavoriteIds.length">
      <h3
        class="text-center max-[650px]:text-left text-[20px] text-[#cdcdcd] max-[650px]:text-[18px] max-[370px]:text-[16px] max-[350px]:text-[14px]"
      >
        You don't have favourite games :(
      </h3>
      <img
        class="m-auto w-full max-w-[200px] absolute bottom-0 max-[600px]:hidden"
        src="../assets/nothingInLibrary.png"
        alt=""
      />
    </div>

    <div v-loading="isGamesLoading"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, markRaw, computed } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { storeToRefs } from "pinia";
import { ElMessageBox } from "element-plus";
import { Delete } from "@element-plus/icons-vue";
import { api } from "../api/api";
import { useFavoriteGames } from "../stores/favoriteGames";
import { GAME_IN_FAVORITE } from "../intrerfaces/types";
import { toastOptions } from "../toast/toastOptions";
import "animate.css";

const favoriteGames = ref<GAME_IN_FAVORITE[]>([]);
const isGamesLoading = ref(true);
const toast = useToast();
const favoriteGamesStore = useFavoriteGames();
const { favoriteGamesIds } = storeToRefs(favoriteGamesStore);

const router = useRouter();

const props = defineProps<{
  searchQuery: string;
}>();

const getGamesForLibrary = async () => {
  const favoriteGamesStores = favoriteGamesStore.getFavoriteIds;
  const gamePromises = favoriteGamesStores.map((id) =>
    api.games.getGameById(id)
  );
  const games = [] as GAME_IN_FAVORITE[];
  try {
    isGamesLoading.value = true;
    const gameResults = await Promise.all(gamePromises);
    gameResults.forEach((result) => {
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
    isGamesLoading.value = false;
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
  } catch (error) {
    return error;
  }
};

const deleteAllGames = async () => {
  try {
    await ElMessageBox.confirm(
      "Are you sure to delete ALL games from library?",
      "Warning",
      {
        type: "warning",
        icon: markRaw(Delete),
        cancelButtonText: "No",
        confirmButtonText: "Yes",
      }
    );

    setTimeout(async () => {
      await favoriteGamesStore.deleteAllGamesFromLibrary();
    }, 600);
  } catch (error) {
    return error;
  }
};

const openCardDetails = (id: number) => {
  router.push({
    name: "game-details",
    params: { id },
  });
};

const filteredFavoriteGames = computed(() => {
  return favoriteGames.value.filter((game) =>
    game.name.toLowerCase().includes(props.searchQuery.toLowerCase())
  );
});

watch(
  () => favoriteGamesIds,
  async (newIds, oldIds) => {
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

onMounted(async () => {
  window.scrollTo({
    top: 0,
  });
  try {
    isGamesLoading.value = true;
    await favoriteGamesStore.getFavoriteGamesFromDB();
  } catch (e) {
    toast.error("Error" + e, toastOptions);
  } finally {
    isGamesLoading.value = false;
  }
});
</script>

<style lang="scss" scoped>
.zoom-image-container {
  position: relative;
  overflow: hidden;
  max-width: 100px;
  min-width: 250px;
  max-height: 220px;
  min-height: 300px;

  @media (max-width: 680px) {
    min-height: auto;
  }
}

.zoom-image {
  transition: transform 0.3s ease;
}

.zoom-image:hover {
  transform: scale(1.1);
}
</style>
