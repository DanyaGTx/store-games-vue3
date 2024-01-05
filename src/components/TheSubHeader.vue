<template>
  <div class="pb-5 pt-3 sticky top-[68px] z-10 bg-primary">
    <ul class="flex justify-center gap-5 mb-5">
      <li class="hidden text-primary max-[520px]:block">
        <router-link class="links__item" to="/favorite">Favourites</router-link>
      </li>
      <li class="hidden text-primary max-[520px]:block">
        <router-link class="links__item" to="/community">Community</router-link>
      </li>
    </ul>
    <div class="flex items-center gap-10">
      <SearchComponent @search-query="searchQuery" />
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchComponent from "./SearchComponent.vue";

const emit = defineEmits<{
  (e: "search-query", search: string): void;
}>();

const searchQuery = (search: string) => {
  emit("search-query", search);
};
</script>

<style lang="scss" scoped>
.submenu__link {
  color: #c1c0c0;

  &.active {
    color: #f5f5f5;
  }
}
</style>
