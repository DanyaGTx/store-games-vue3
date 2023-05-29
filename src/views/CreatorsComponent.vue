<template>
  <div>
    <h1 class="text-[30px] text-white">Creators</h1>
    <div v-if="!isLoading">
      <div class="m-[20px]" v-for="creator in creators" :key="creator.id">
        <div class="flex gap-4 max-[720px]:block">
          <div class="w-full max-w-[250px]">
            <img
              class="w-full min-w-[250px] max-[420px]:min-w-0"
              :src="creator.image"
              alt=""
            />
          </div>
          <div>
            <div>
              <h2 class="text-white text-[20px]">
                {{ creator.name }}
              </h2>
              <h3 class="text-gray-300 text-[18px] mb-[10px]">
                Games created: {{ creator.games_count }}
              </h3>
              <div class="mb-[10px] flex flex-wrap gap-2">
                <span
                  class="border-2 border-cyan-50 text-black p-[5px] bg-slate-300 text-[14px]"
                  v-for="positions in creator.positions"
                  :key="positions.id"
                  >{{ positions.name }}</span
                >
              </div>

              <div class="text-white flex flex-wrap">
                Games:
                <span
                  class="mr-[10px]"
                  v-for="game in creator.games"
                  :key="game.id"
                  >{{ game.name }}.</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="absolute left-[50%]">
      <img class="w-[100px]" src="../assets/loader.gif" alt="" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { api } from "../api/api";
import { CREATOR } from "../intrerfaces/types";

const creators = ref<CREATOR[]>([]);
const isLoading = ref(false);
const getCreators = async () => {
  try {
    isLoading.value = true;
    const { data } = await api.creators.getCreators();
    creators.value = data.results;
  } catch (e) {
    console.log(e);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  window.scrollTo({
    top: 0,
  });
  await getCreators();
});
</script>

<style lang="scss" scoped></style>
