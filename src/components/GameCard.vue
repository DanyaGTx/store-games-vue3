<template>
  <div
    class="min-w-[180px] max-w-[280px] h-[350px] bg-[#49537d] rounded-lg flex flex-col justify-between cursor-pointer max-[500px]:h-[300px]"
  >
    <div class="p-[10px]">
      <div>
        <img
          @load="imageLoading(game.background_image)"
          class="w-full max-h-[150px] rounded-lg fade-in-image"
          :class="imageClass"
          :src="game.background_image"
          alt=""
        />
        <h3>{{ game.name }}</h3>
        <span>Rating: {{ game.rating }}</span>
      </div>
    </div>
    <div @click.stop class="text-right m-[20px]">
      <el-button
        v-if="!isInBasket"
        @click="addGameToCart(game.id)"
        type="success"
        >Add to cart</el-button
      >
      <el-button v-else @click="deleteGameFromCart(game.id)" type="info" plain
        >Delete from cart</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loading } from "@element-plus/icons-vue";
import { computed, onMounted, ref } from "vue";

import { useRouter, useRoute } from "vue-router";

import { useGamesStoreBasket } from "../stores/gamesBasket";

const route = useRoute();
const router = useRouter();

const props = defineProps<{
  game: GAME;
  isLoading: boolean;
}>();

interface GAME {
  name: string;
  id: number;
  rating: number;
  background_image: string;
}

const gamesStoreBasket = useGamesStoreBasket();

const addGameToCart = (id: number) => {
  gamesStoreBasket.addGame(id);
};

const deleteGameFromCart = (id: number) => {
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
  return gamesStoreBasket.gamesBasket.find((game) => game.id === props.game.id);
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
