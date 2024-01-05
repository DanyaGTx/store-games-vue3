<template>
  <div class="bg-primary min-h-screen font-Inter relative">
    <div>
      <TheHeader />
      <div class="max-w-[1600px] m-auto p-5 pt-0">
        <TheSubHeader
          v-if="$route.meta.header !== 0"
          @search-query="searchQuery"
        />
        <router-view :search-query="searchString"></router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import TheHeader from "../components/TheHeader.vue";
import TheSubHeader from "../components/TheSubHeader.vue";

const searchString = ref("");

const searchQuery = (search: string) => {
  searchString.value = search;
};
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
