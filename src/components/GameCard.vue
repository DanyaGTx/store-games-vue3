<template>
  <div
    class="min-w-[180px] max-w-[280px] max-[1100px]:max-w-[380px] max-[750px]:min-h-[350px] min-h-[350px] bg-[#49537d] rounded-lg flex flex-col justify-between cursor-pointer max-[500px]:h-[300px]"
  >
    <div class="p-[10px]">
      <div class="h-[200px] w-full">
        <img
          @load="imageLoading(game.background_image)"
          class="w-full h-full object-cover rounded-lg fade-in-image"
          :class="imageClass"
          :src="game.background_image"
          alt=""
        />
        <h3
          class="text-[18px] text-white max-[750px]:text-[30px] max-[500px]:text-[24px]"
        >
          {{ game.name }}
        </h3>
        <span
          class="text-gray-200 text-[16px] max-[750px]:text-[24px] max-[500px]:text-[16px]"
          >Rating: {{ game.rating }}</span
        >
      </div>
    </div>
    <div v-if="!isInLibrary" @click.stop class="text-right m-[20px]">
      <el-button
        v-if="!isInBasket"
        @click="addGameToCart(game.id)"
        type="success"
        :disabled="!isAddGameButtonActive && auth.currentUser"
        >Add to cart</el-button
      >
      <el-button v-else @click="deleteGameFromCart(game.id)" type="info" plain
        >Delete from cart</el-button
      >
    </div>
    <div
      v-else
      class="text-right m-[20px] text-green-500 font-bold max-[750px]:text-[24px] max-[500px]:text-[20px]"
    >
      In Library
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { getAuth } from "@firebase/auth";
import { useFavoriteGames } from "../stores/favoriteGames";
import { useGamesStoreBasket } from "../stores/gamesBasket";
import { GAME } from "../intrerfaces/types";

const favoriteGamesStore = useFavoriteGames();

const isAddGameButtonActive = ref(true);

const auth = getAuth();

const props = defineProps<{
  game: GAME;
  isLoading: boolean;
}>();

const gamesStoreBasket = useGamesStoreBasket();

const addGameToCart = (id: number) => {
  isAddGameButtonActive.value = false;
  gamesStoreBasket.addGame(id);
};

const deleteGameFromCart = (id: number) => {
  isAddGameButtonActive.value = true;
  gamesStoreBasket.deleteGame(id);
};

const imageClass = ref("fade-in-image");
const imageLoading = (img: string) => {
  const image = new Image();
  image.src = img;
  image.onload = () => {
    imageClass.value = "fade-in-image is-loaded";
  };
};

const isInBasket = computed(() => {
  isAddGameButtonActive.value = true;
  return gamesStoreBasket.gamesBasket.find((game) => game.id === props.game.id);
});

const isInLibrary = computed(() => {
  isAddGameButtonActive.value = true;
  return favoriteGamesStore.getFavoriteIds.find((id) => id === props.game.id);
});
</script>

<style scoped>
.fade-in-image {
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

.fade-in-image.is-loaded {
  opacity: 1;
}
</style>
