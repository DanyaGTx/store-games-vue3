<template>
  <div class="game-card relative max-w-[215px] max-[480px]:max-w-full">
    <div class="cursor-pointer hover:contrast-125">
      <img
        @load="imageLoading(game.background_image)"
        class="game-card__img h-[290px] w-full object-cover rounded-sm fade-in-image"
        :class="imageClass"
        :src="game.background_image"
      />
      <h3 class="text-[18px] mt-1 text-white">
        {{ game.name }}
      </h3>
      <p v-if="isInLibrary" class="text-green-500 font-bold">In Library</p>

      <div
        v-if="!isInLibrary"
        class="absolute top-2 right-2 select-none max-[768px]:hidden"
      >
        <div
          v-if="
            gamesStoreBasket.isAddGameButtonActive &&
            !isInBasket &&
            isAddGameButtonActive
          "
          @click.stop="addGameToCart(game.id)"
          class="addToCart-icon h-7 w-7 rounded-full text-2xl bg-black text-white relative border-2"
        >
          <span class="addToCart-icon__plus">+</span>
        </div>
        <div v-else-if="gamesStoreBasket.isAddGameButtonActive">
          <img width="30" src="../assets/recycle-bin.svg" alt="In cart" />
        </div>
      </div>
    </div>
    <div class="hidden max-[768px]:block">
      <div
        v-if="!isInLibrary && gamesStoreBasket.isAddGameButtonActive"
        @click.stop
        class="mt-2"
      >
        <el-button
          v-if="!isInBasket"
          @click="addGameToCart(game.id)"
          type="success"
          :disabled="!isAddGameButtonActive"
        >
          Add to cart
        </el-button>
        <el-button
          v-else
          @click="deleteGameFromCart(game.id)"
          type="info"
          plain
        >
          Delete from cart
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useFavoriteGames } from "../stores/favoriteGames";
import { useGamesStoreBasket } from "../stores/gamesBasket";
import { GAME } from "../intrerfaces/types";

const favoriteGamesStore = useFavoriteGames();

const isAddGameButtonActive = ref(true);

const props = defineProps<{
  game: GAME;
  isLoading: boolean;
  isAddGameButtonActive: boolean;
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
  return gamesStoreBasket.hasInCart(props.game.id);
});

const isInLibrary = computed(() => {
  return favoriteGamesStore.getFavoriteIds.find((id) => id === props.game.id);
});
</script>

<style lang="scss">
.fade-in-image {
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

.fade-in-image.is-loaded {
  opacity: 1;
}

.game-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.game-card:hover .addToCart-icon {
  display: block;
}

.addToCart-icon {
  display: none;
}

.addToCart-icon__plus {
  position: absolute;
  top: calc(50% - 1px);
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
