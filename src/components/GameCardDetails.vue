<template>
  <div class="p-4">
    <div class="text-white" v-if="gameDetails">
      <h1 class="text-5xl max-[450px]:text-[25px] max-[350px]:text-[20px]">
        {{ gameDetails.name }}
      </h1>
      <div class="flex items-center gap-1">
        <el-rate v-model="gameDetails.rating" disabled />
        <p class="text-base">{{ gameDetails.rating }}</p>
      </div>
      <div class="flex justify-between gap-16 mt-2 max-[1600px]:block">
        <div class="swiper__container">
          <div>
            <swiper
              :loop="true"
              :spaceBetween="10"
              :navigation="true"
              :thumbs="{ swiper: thumbsSwiper }"
              :modules="modules"
              :initial-slide="gameTrailer.results.length ? 0 : 1"
            >
              <swiper-slide v-if="gameTrailer.results.length">
                <div class="text-center">
                  <video
                    :poster="gameTrailer.results[0].preview"
                    class="w-full text-center m-auto"
                    controls
                    autoplay
                    muted
                  >
                    <source
                      :src="gameTrailer.results[0].data.max"
                      type="video/mp4"
                    />

                    Your browser does not support the video tag.
                  </video>
                </div>
              </swiper-slide>

              <swiper-slide
                :key="screenshot.id"
                v-for="screenshot in gameScreenShots"
              >
                <div class="animate__animated animate__fadeIn select-none">
                  <img
                    class="h-full w-full object-cover"
                    :src="screenshot.image"
                    alt=""
                  />
                </div>
              </swiper-slide>
            </swiper>
            <swiper
              @swiper="setThumbsSwiper"
              :spaceBetween="10"
              :slidesPerView="4"
              :watchSlidesProgress="true"
              :modules="modules"
              class="mySwiper mt-5"
            >
              <swiper-slide v-if="gameTrailer.results.length">
                <div class="text-center cursor-pointer">
                  <video
                    :poster="gameTrailer.results[0].preview"
                    class="w-full text-center m-auto"
                    muted
                  >
                    <source
                      :src="gameTrailer.results[0].data.max"
                      type="video/mp4"
                    />

                    Your browser does not support the video tag.
                  </video>
                </div>
              </swiper-slide>
              <swiper-slide
                :key="screenshot.id"
                v-for="screenshot in gameScreenShots"
              >
                <div
                  class="cursor-pointer animate__animated animate__fadeIn select-none"
                >
                  <img
                    class="h-full w-full object-cover"
                    :src="screenshot.image"
                    alt=""
                  />
                </div>
              </swiper-slide>
            </swiper>
          </div>
        </div>
        <div>
          <img
            class="max-w-[280px] select-none rounded-sm max-[1600px]:hidden"
            :src="gameDetails.background_image"
            alt="game image"
          />
          <div class="grid grid-cols-3 gap-2 max-[1600px]:flex flex-wrap mt-3">
            <p
              class="flex items-center justify-center text-center rounded-md p-2 bg-[#2A2A2A] text-xs max-w-[200px]"
              v-for="genre in gameDetails.genres"
            >
              {{ genre.name }}
            </p>
          </div>

          <div>
            <ul>
              <li class="flex justify-between py-3 border-b border-[#2A2A2A]">
                <p>Release date</p>
                <p>
                  {{ gameDetails.released }}
                </p>
              </li>
            </ul>
          </div>

          <div class="mt-4 max-w-[450px]">
            <div v-if="!isInLibrary" @click.stop>
              <el-button
                class="w-full"
                v-if="!isInBasket"
                @click="addGameToCart"
                type="success"
                :disabled="isAllowedToAdd"
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
      </div>
      <div class="text-white mt-5">
        <p v-html="gameDetails.description"></p>
      </div>
    </div>
    <div v-else class="absolute left-[50%]">
      <div v-loading="true"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import { register as SwiperRegister } from "swiper/element/bundle";
import { useGamesStoreBasket } from "../stores/gamesBasket";
import { useFavoriteGames } from "../stores/favoriteGames";
import { GAME_DETAILS, SCREENSHOT } from "../intrerfaces/types";
import { ElRate } from "element-plus";
import { api } from "../api/api";
import "animate.css";

import { Swiper, SwiperSlide } from "swiper/vue";
import { FreeMode, Navigation, Thumbs } from "swiper";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

const thumbsSwiper = ref(null);

const setThumbsSwiper = (swiper: any) => {
  thumbsSwiper.value = swiper;
};

const modules = [FreeMode, Navigation, Thumbs];

const favoriteGamesStore = useFavoriteGames();
const gamesStoreBasket = useGamesStoreBasket();

const route = useRoute();

const isAddGameButtonActive = ref(true);
const isScreenShotsLoading = ref(false);

const gameTrailer = ref();
const gameDetails = ref<GAME_DETAILS>();
const gameScreenShots = ref<SCREENSHOT[]>();

const addGameToCart = () => {
  isAddGameButtonActive.value = false;
  gamesStoreBasket.addGame(gameDetails.value?.id as number);
};

const deleteGameFromCart = () => {
  isAddGameButtonActive.value = true;
  gamesStoreBasket.deleteGame(gameDetails.value?.id as number);
};

const getGameById = async (id: number) => {
  const { data } = await api.games.getGameById(id);
  gameDetails.value = data;
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
  return gamesStoreBasket.hasInCart(gameDetails.value?.id as number);
});

const isInLibrary = computed(() => {
  return favoriteGamesStore.getFavoriteIds.find(
    (id) => id === Number(route.params.id)
  );
});

const isAllowedToAdd = computed(() => {
  return (
    !gamesStoreBasket.isAddGameButtonActive || !isAddGameButtonActive.value
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
});
</script>

<style lang="scss">
.swiper-pagination-bullet-active {
  background-color: #000;
}

.swiper__container {
  --swiper-navigation-color: #fff;
  --swiper-pagination-color: #fff;

  max-width: 1200px;

  @media (max-width: 1600px) {
    max-width: 100%;
  }
}
</style>
