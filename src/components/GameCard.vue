<template>
  <div
    class="min-w-[180px] max-w-[280px] h-[350px] bg-[#49537d] rounded-lg flex flex-col justify-between"
  >
    <div class="p-[10px]">
      <div>
        <img
          class="w-full max-h-[150px] rounded-lg"
          :src="game.background_image"
          alt=""
        />
        <h3>{{ game.name }}</h3>
        <span>Rating: {{ game.rating }}</span>
      </div>
    </div>
    <div class="text-right m-[20px]">
      <el-button @click="addGameToCart(game)" type="success"
        >Add to cart</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGamesStore } from "../stores/games";

defineProps<{
  game: GAME;
}>();

interface GAME {
  name: string;
  id: number;
  rating: number;
  background_image: string;
}

const gamesStore = useGamesStore();

const addGameToCart = (game: GAME) => {
  gamesStore.addGame(game);
};
</script>

<style lang="scss" scoped></style>
