<template>
  <div
    class="relative w-full max-w-[500px] max-[1000px]:max-w-[300px] m-auto translate-y-1"
  >
    <input
      v-model="searchQuery"
      placeholder="Search"
      class="h-[40px] rounded-xl outline-none pl-[10px] text-[18px] w-full bg-[#5a5b65] text-white"
      type="text"
    />

    <div
      @mouseenter="onSearchIconHover = true"
      @mouseleave="onSearchIconHover = false"
    >
      <img
        v-if="!onSearchIconHover"
        class="absolute top-[10px] right-[10px] w-[20px] opacity-70 cursor-pointer"
        src="../assets/seacrh-ico.png"
        alt="search"
      />
      <img
        v-else="onSearchIconHover"
        @click="clearSearch"
        class="absolute top-[10px] right-[10px] w-[20px] opacity-70 cursor-pointer"
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
