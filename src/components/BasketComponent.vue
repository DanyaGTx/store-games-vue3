<template>
  <div class="mr-[10px]">
    <el-dropdown trigger="click">
      <div class="flex items-center relative">
        <img
          class="cursor-pointer mr-[5px] min-w-[60px] max-w-[80px]"
          src="../assets/recycle-bin.svg"
        />
        <div
          class="min-w-[25px] h-[25px] rounded-full bg-blue-400 absolute top-[5px] right-[5px] flex justify-center items-center"
        >
          <span class="text-black">{{ calculatedGamesAmount }}</span>
        </div>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <div class="w-[200px] min-h-[150px] pr-[10px]">
            <template v-if="calculatedGamesAmount">
              <div
                v-for="game in gamesStore.gamesBasket"
                class="border-2 border-red-400 flex gap-2 justify-between items-center p-[10px] ml-[10px] mb-[10px]"
              >
                <div>
                  <h2>{{ game.name }}</h2>
                  <h3>Rating: {{ game.rating }}</h3>
                </div>
                <span
                  @click="deleteGame(game.id)"
                  class="text-red-900 text-[20px] cursor-pointer"
                  >X</span
                >
              </div>
            </template>
            <div class="text-[20px] pt-[30px]" v-else>
              <div class="">
                <img
                  class="w-[50px] opacity-50 m-auto"
                  src="../assets/nothingInCart.png "
                  alt=""
                />
                <h3 class="text-center mt-[10px]">Nothing in cart</h3>
              </div>
            </div>
          </div>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ElDropdown, ElDropdownMenu } from "element-plus";
import { useGamesStoreBasket } from "../stores/gamesBasket";

const gamesStore = useGamesStoreBasket();

const calculatedGamesAmount = computed(() => {
  return gamesStore.gamesBasket.length;
});

const deleteGame = (id: number) => {
  gamesStore.deleteGame(id);
};
</script>
