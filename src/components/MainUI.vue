<template>
  <div class="max-w-[1800px] m-auto bg-[#252836] h-full min-h-[950px]">
    <div>
      <Header @search-query="searchQuery" />
      <div class="mt-[30px] flex">
        <Sidebar />
        <div class="flex flex-col">
          <router-view :search-query="searchString"></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Header from "../components/HeaderUI.vue";
import Sidebar from "../components/SidebarUI.vue";

const searchString = ref("");

const searchQuery = (search: string) => {
  searchString.value = search;
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
