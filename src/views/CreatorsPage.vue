<template>
  <div class="py-5">
    <h1 class="text-[30px] text-white">Creators</h1>
    <div v-if="!isLoading">
      <div class="m-[20px]" v-for="creator in creators" :key="creator.id">
        <div class="flex gap-4 max-[720px]:block">
          <div class="w-full max-w-[250px]">
            <img
              @load="imageLoading(creator.image)"
              class="w-full min-w-[250px] max-[420px]:min-w-0 fade-in-image"
              :class="imageClass"
              :src="creator.image"
              alt="Creator Image"
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
                  class="flex items-center justify-center text-center rounded-md p-2 text-white bg-[#2A2A2A] text-xs max-w-[200px]"
                  v-for="positions in creator.positions"
                  :key="positions.id"
                >
                  {{ positions.name }}
                </span>
              </div>
              <div class="text-white flex flex-wrap">
                <p class="mr-1">Games:</p>
                <span
                  class="mr-[10px]"
                  v-for="game in creator.games"
                  :key="game.id"
                >
                  {{ game.name }}.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="absolute left-[50%]">
      <div v-loading="true"></div>
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

const imageClass = ref("fade-in-image");
const imageLoading = (img: string) => {
  const image = new Image();
  image.src = img;
  image.onload = () => {
    imageClass.value = "fade-in-image is-loaded";
  };
};

onMounted(async () => {
  window.scrollTo({
    top: 0,
  });
  await getCreators();
});
</script>

<style lang="scss" scoped></style>
