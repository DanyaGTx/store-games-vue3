<template>
  <div class="max-w-[1400px] bg-[#252836] p-4">
    <div v-if="gameDetails">
      <el-button @click="goBack" class="mb-[20px]">Back</el-button>
      <div class="flex gap-3 max-[1200px]:block">
        <div>
          <img
            class="max-w-[480px] h-full max-[1200px]:h-[250px] max-[600px]:h-[200px] w-full object-cover"
            :src="gameDetails.background_image"
            alt=""
          />
        </div>

        <div class="flex flex-col justify-between">
          <div class="text-white">
            <h1
              class="text-[30px] font-bold max-[450px]:text-[25px] max-[350px]:text-[20px]"
            >
              {{ gameDetails.name }}
            </h1>
            <div class="flex gap-3 flex-wrap max-w-[500px] mt-1">
              <p
                class="rounded-[8px] bg-gray-500 p-[5px]"
                v-for="genre in gameDetails.genres"
              >
                {{ genre.name }}
              </p>
            </div>
            <div class="mt-1">
              <h2 class="text-[20px] font-bold">
                Rating: {{ gameDetails.rating }}
              </h2>

              <div class="mt-2">
                <h3>Release date: {{ gameDetails.released }}</h3>
                <div class="flex gap-3 flex-wrap">
                  <h2>Developers:</h2>
                  <p v-for="developer in gameDetails.developers">
                    {{ developer.name }}
                  </p>
                </div>
              </div>
              <div class="flex flex-wrap mt-2 text-white">
                <h2 class="mr-[5px]">Stores:</h2>
                <p class="mr-[10px]" v-for="store in gameDetails.stores">
                  {{ store.store.name }};
                </p>
              </div>
            </div>
          </div>

          <div v-if="!isInLibrary" @click.stop>
            <el-button
              class="w-full max-w-[300px]"
              v-if="!isInBasket"
              @click="addGameToCart"
              type="success"
              :disabled="!isAddGameButtonActive && auth.currentUser"
              >Add to cart</el-button
            >
            <el-button
              class="w-full max-w-[300px]"
              v-else
              @click="deleteGameFromCart"
              type="info"
              plain
              >Delete from cart</el-button
            >
          </div>
          <div v-else class="text-green-500 font-bold">In Library</div>
        </div>
      </div>
      <div class="text-white mt-5">
        <p v-html="gameDetails.description"></p>
      </div>
      <div v-if="gameTrailer.results.length" class="text-center m-auto">
        <video
          :poster="gameTrailer.results[0].preview"
          class="w-full text-center m-auto"
          controls
        >
          <source :src="gameTrailer.results[0].data.max" type="video/mp4" />

          Your browser does not support the video tag.
        </video>
      </div>
      <div v-else class="mt-[50px]">
        <div
          v-if="!isScreenShotsLoading && gameScreenShots?.length"
          class="grid grid-cols-3 gap-3 max-[1100px]:grid-cols-2 max-[750px]:grid-cols-1"
        >
          <div
            v-for="screenshot in gameScreenShots"
            :key="screenshot.id"
            class="max-w-[500px] animate__animated animate__fadeIn"
          >
            <img
              @load="lazyLoadScreenShotsAnimation"
              class="h-full w-full object-cover"
              :src="screenshot.image"
              alt=""
            />
          </div>
        </div>
        <div v-else class="absolute left-[50%]">
          <img class="w-[100px]" src="../assets/loader.gif" alt="" />
        </div>
      </div>
    </div>
    <div v-else class="absolute left-[50%]">
      <img class="w-[100px]" src="../assets/loader.gif" alt="" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { api } from "../api/api";
import { useGamesStoreBasket } from "../stores/gamesBasket";
import { useFavoriteGames } from "../stores/favoriteGames";
import { getAuth } from "@firebase/auth";
import { register as SwiperRegister } from "swiper/element/bundle";
import "animate.css";
const favoriteGamesStore = useFavoriteGames();
const route = useRoute();
const router = useRouter();
const auth = getAuth();
const gamesStoreBasket = useGamesStoreBasket();
const isAddGameButtonActive = ref(true);
const isScreenShotsLoading = ref(false);
const gameDetails = ref<GAME_DETAILS>();
const gameScreenShots = ref<SCREENSHOT[]>();
const gameTrailer = ref();

const lazyLoadScreenShotsAnimation = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.classList.add("animate__animated", "animate__fadeIn");
};

const goBack = () => {
  router.go(-1);
};

const addGameToCart = () => {
  isAddGameButtonActive.value = false;
  if (gameDetails.value?.id) {
    gamesStoreBasket.addGame(gameDetails.value.id);
  }
};

const deleteGameFromCart = () => {
  isAddGameButtonActive.value = true;
  if (gameDetails.value?.id) {
    gamesStoreBasket.deleteGame(gameDetails.value.id);
  }
};

const getGameById = async (id: number) => {
  const { data } = await api.games.getGameById(id);
  gameDetails.value = data;
  console.log(gameDetails.value);
};

const getGameTrailer = async (id: number) => {
  try {
    const { data } = await api.games.getGameTrailer(id);
    gameTrailer.value = data;
  } catch (e) {
    console.log(e);
  }
};

const getGameScreenShots = async (id: number) => {
  try {
    isScreenShotsLoading.value = true;
    const { data } = await api.games.getGameScreenShots(id);
    gameScreenShots.value = data.results;
  } catch (e) {
    console.log(e);
  } finally {
    isScreenShotsLoading.value = false;
  }
};

const isInBasket = computed(() => {
  isAddGameButtonActive.value = true;
  return gamesStoreBasket.gamesBasket.find(
    (game) => game.id === gameDetails.value?.id
  );
});

const isInLibrary = computed(() => {
  isAddGameButtonActive.value = true;
  return favoriteGamesStore.getFavoriteIds.find(
    (id) => id === Number(route.params.id)
  );
});

onMounted(() => {
  window.scrollTo({
    top: 0,
  });
  SwiperRegister();

  getGameById(+route.params.id);
  getGameTrailer(+route.params.id);
  getGameScreenShots(+route.params.id);
  console.log("router: ", route.params.id);

  console.log("SCREENSGOTSSS", gameScreenShots.value);
});

// вынести в отдельный файл
type GENRES = {
  games_count: number;
  id: number;
  image_background: string;
  name: string;
  slug: string;
};

type ESRB_RATING = {
  id: number;
  name: string;
  slug: string;
};

type ADDED_BY_STATUS = {
  beaten: number;
  dropped: number;
  owned: number;
  playing: number;
  toplay: number;
  yet: number;
};

type DEVELOEPRS = {
  name: string;
};

type SCREENSHOT = {
  height: number;
  width: number;
  id: number;
  image: string;
};

interface GAME_DETAILS {
  added: number;
  added_by_status: ADDED_BY_STATUS;
  background_image: string;
  clip: null;
  dominant_color: string;
  esrb_rating: ESRB_RATING[];
  genres: GENRES[];
  id: number;
  description: string;
  name: string;
  released: string;
  developers: DEVELOEPRS[];
  rating: string;
  stores: {
    store: {
      name: string;
    };
  }[];
}

interface GAME {
  name: string;
  id: number;
  rating: number;
  background_image: string;
}
</script>

<style>
.swiper-pagination-bullet-active {
  background-color: #000;
}
</style>
