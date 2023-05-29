<template>
  <div
    class="sticky top-0 z-10 bg-[#252836] min-[600px]:flex min-[600px]:justify-between min-[600px]:items-center max-[600px]:text-center p-2"
  >
    <div @click="$router.push('/')" class="flex items-center justify-center">
      <h1
        class="text-white text-[30px] font-popins font-semibold min-w-[180px] cursor-pointer ease-in duration-300 hover:text-[#22a1bd] max-[440px]:hidden"
      >
        Game store
      </h1>
    </div>
    <div class="flex justify-center items-center w-full max-[440px]:block">
      <SearchComponent @search-query="searchQuery" />
      <div class="mr-[100px] max-[1150px]:mr-[0px] max-[600px]:mt-[10px]">
        <div class="flex items-center justify-between">
          <h1
            class="text-white text-[30px] font-popins font-semibold cursor-pointer ease-in duration-300 hover:text-[#22a1bd] min-[441px]:hidden max-[360px]:text-[25px] max-[340px]:text-[22px]"
          >
            Game store
          </h1>
          <div class="flex items-center">
            <BasketComponent />
            <HeaderMenuComponent />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BasketComponent from "./BasketComponent.vue";
import HeaderMenuComponent from "./HeaderMenuComponent.vue";
import SearchComponent from "./SearchComponent.vue";

const emit = defineEmits<{
  (e: "search-query", search: string): void;
}>();

const searchQuery = (search: string) => {
  emit("search-query", search);
};
</script>

<style lang="scss" scoped></style>
