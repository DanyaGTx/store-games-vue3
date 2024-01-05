<template>
  <div class="bg-[#18181C] text-gray-light sticky top-0 z-10">
    <div class="flex justify-between">
      <div class="flex items-center gap-8 p-4">
        <div @click="$router.push('/')" class="logo">
          <img
            class="min-w-[32px] min-h-[36px]"
            src="../assets/logo.png"
            alt="logo"
          />
        </div>
        <ul class="flex items-center">
          <li @click="$router.push('/')" class="mr-2 cursor-pointer">
            <img
              class="min-w-[56px] min-h-[33px]"
              src="../assets/Store.svg"
              alt="Store"
            />
          </li>
          <li class="max-[520px]:hidden">
            <router-link class="links__item" to="/favorite"
              >Favourites</router-link
            >
          </li>
          <li class="max-[520px]:hidden">
            <router-link class="links__item" to="/creators"
              >Creators</router-link
            >
          </li>
        </ul>
      </div>

      <div class="flex items-center">
        <HeaderMenuDropdown />
        <BasketComponent />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BasketComponent from "./BasketComponent.vue";
import HeaderMenuDropdown from "./HeaderMenuDropdown.vue";
const emit = defineEmits<{
  (e: "search-query", search: string): void;
}>();
</script>

<style lang="scss" scoped>
.logo {
  position: relative;
  cursor: pointer;
  max-width: 32px;
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    right: -15px;
    width: 1px;
    height: 80%;
    transform: translate(-50%, -50%);
    background-color: #303034;
  }
}
.links__item {
  position: relative;
  padding: 4px 14px;
  font-size: 14px;
  &.active {
    background-color: #404044;
    border-radius: 8px;
  }

  &:hover {
    background-color: #404044;
    border-radius: 8px;
  }
}
</style>
