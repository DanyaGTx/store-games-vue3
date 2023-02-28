<template>
  <div class="max-w-[1400px] bg-[#252836] p-4">
    <div v-if="gameDetails">
      <el-button @click="$router.go(-1)" class="mb-[20px]">Back</el-button>
      <div class="flex gap-3 max-[1200px]:block">
        <img
          class="max-w-[600px] h-full w-full"
          :src="gameDetails.background_image"
          alt=""
        />
        <div class="flex flex-col justify-between">
          <div class="text-white">
            <h1 class="text-[30px] font-bold">
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

          <div @click.stop>
            <el-button
              class="w-full max-[1200px]:max-w-[600px]"
              v-if="!isInBasket"
              @click="addGameToCart"
              type="success"
              >Add to cart</el-button
            >
            <el-button
              class="w-full max-[1200px]:max-w-[600px]"
              v-else
              @click="deleteGameFromCart"
              type="info"
              plain
              >Delete from cart</el-button
            >
          </div>
        </div>
      </div>
      <div class="text-white mt-5">
        <p v-html="gameDetails.description"></p>
      </div>
    </div>
    <div v-else class="absolute right-[48%]">
      <img class="w-[100px]" src="../assets/loader.gif" alt="" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { api } from "../api/api";
import { useGamesStoreBasket } from "../stores/gamesBasket";

const route = useRoute();
const router = useRouter();

const gamesStoreBasket = useGamesStoreBasket();

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

const gameDetails = ref<GAME_DETAILS>();

const addGameToCart = () => {
  if (gameDetails.value?.id) {
    gamesStoreBasket.addGame(gameDetails.value.id);
  }
};

const deleteGameFromCart = () => {
  if (gameDetails.value?.id) {
    gamesStoreBasket.deleteGame(gameDetails.value.id);
  }
};

const getGameById = async (id: number) => {
  const { data } = await api.games.getGameById(id);

  gameDetails.value = data;
  console.log(gameDetails.value);
};

const isInBasket = computed(() => {
  return gamesStoreBasket.gamesBasket.find(
    (game) => game.id === gameDetails.value?.id
  );
});

onMounted(() => {
  getGameById(+route.params.id);
  console.log("router: ", route.params.id);
});
</script>

<style lang="scss" scoped></style>
