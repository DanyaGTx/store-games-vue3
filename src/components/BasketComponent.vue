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
          <div
            class="w-[200px] min-h-[150px] max-h-[400px] overflow-auto p-[5px]"
          >
            <template v-if="calculatedGamesAmount">
              <div class="flex flex-col justify-between">
                <div
                  v-for="game in gamesStore.getAllGamesInCart"
                  class="border-2 border-red-400 flex gap-2 justify-between items-center p-[10px] mb-[10px]"
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
        <div class="m-[5px]">
          <el-button
            v-show="calculatedGamesAmount"
            style="border-radius: 0px"
            class="w-full m-auto text-center rounded-none"
            type="success"
            plain
            @click="addToFavorite"
            >Add to favourite</el-button
          >
        </div>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ElDropdown, ElDropdownMenu } from "element-plus";
import { useGamesStoreBasket } from "../stores/gamesBasket";
import { useFavoriteGames } from "../stores/favoriteGames";
import { useToast } from "vue-toastification";
import { toastOptions } from "../toast/toastOptions";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteField,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
const toast = useToast();
const gamesStore = useGamesStoreBasket();
const favoriteGames = useFavoriteGames();

const calculatedGamesAmount = computed(() => {
  return gamesStore.gamesBasket.length;
});

const deleteGame = (id: number) => {
  gamesStore.deleteGame(id);
};
const auth = getAuth();
const addToFavorite = async () => {
  let favouriteGames = [] as number[];
  gamesStore.getAllGamesInCart.forEach((game) => {
    favouriteGames.push(game.id);
  });
  favoriteGames.setFavoriteGames(favouriteGames);
  gamesStore.clearGamesInCart();
  toast.success("Your games in library :)", toastOptions);
  if (auth.currentUser?.email) {
    const usersRef = collection(db, "users");
    await updateDoc(doc(usersRef, auth.currentUser.email), {
      gamesInCart: [],
    });
  }
};
</script>
