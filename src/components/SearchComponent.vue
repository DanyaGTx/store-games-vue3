<template>
  <div class="relative max-w-[230px] w-full max-[520px]:max-w-none">
    <input
      v-model="searchQuery"
      placeholder="Search store"
      class="placeholder:text-sm placeholder:text-primary h-[40px] rounded-3xl text-base outline-none pl-10 pr-4 text-[18px] w-full bg-gray-lighter text-white focus:bg-[#2A2A2A]"
      type="text"
    />

    <div
      @mouseenter="onSearchIconHover = true"
      @mouseleave="onSearchIconHover = false"
    >
      <img
        v-if="!onSearchIconHover"
        class="absolute top-1/2 -translate-y-1/2 left-[15px] w-[13px] opacity-70 cursor-pointer invert"
        src="../assets/seacrh-ico.png"
        alt="search"
      />

      <img
        v-else="onSearchIconHover"
        @click="clearSearch"
        class="absolute top-1/2 -translate-y-1/2 left-[15px] w-[13px] opacity-70 cursor-pointer invert"
        src="../assets/search-clear-ico.svg"
        alt="search"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";

const onSearchIconHover = ref(false);

const searchQuery = ref("");

const clearSearch = () => {
  searchQuery.value = "";
};

const emit = defineEmits<{
  (e: "search-query", search: string): void;
}>();

watch(searchQuery, () => {
  emit("search-query", searchQuery.value);
});
</script>

<style lang="scss" scoped></style>
