<template>
  <div
    class="min-h-[650px] min-w-[250px] max-[850px]:min-w-[200px] max-[550px]:min-w-[150px] max-[500px]:min-w-[100px] max-[400px]:min-w-[70px] font-popins text-[#808191]"
  >
    <div class="min-[501px]:hidden sticky top-[160px] pl-[10px] pt-[15px]">
      <h3 class="font-semibold mb-[20px]">MENU</h3>
      <nav class="flex flex-col gap-10">
        <div class="flex items-center">
          <router-link class="text-white ml-[10px]" :to="{ name: 'store' }"
            ><img
              width="32"
              height="32"
              src="../assets/menu/menu-store.svg"
              alt=""
          /></router-link>
        </div>
        <div class="flex items-center">
          <router-link class="text-white ml-[10px]" :to="{ name: 'favorite' }"
            ><img
              width="32"
              height="32"
              src="../assets/menu/menu-library.svg"
              alt=""
          /></router-link>
        </div>
        <div class="flex items-center">
          <router-link class="text-white ml-[10px]" :to="{ name: 'news' }"
            ><img
              width="32"
              height="32"
              src="../assets/menu/menu-community.svg"
              alt=""
          /></router-link>
        </div>
      </nav>
    </div>

    <div
      class="max-[500px]:hidden max-w-[470px]:bg-red sticky top-[150px] pl-[10px]"
    >
      <h3 class="font-semibold min-[500px]:mb-[20px]">MENU</h3>
      <nav class="flex flex-col gap-10">
        <div class="flex items-center">
          <img
            width="32"
            height="32"
            src="../assets/menu/menu-store.svg"
            alt=""
          />
          <router-link class="text-white ml-[10px]" :to="{ name: 'store' }"
            >Store</router-link
          >
        </div>
        <div class="flex items-center">
          <img
            width="32"
            height="32"
            src="../assets/menu/menu-library.svg"
            alt=""
          />
          <router-link class="text-white ml-[10px]" :to="{ name: 'favorite' }"
            >Favorites</router-link
          >
        </div>
        <div class="flex items-center">
          <img
            width="32"
            height="32"
            src="../assets/menu/menu-community.svg"
            alt=""
          />
          <router-link class="text-white ml-[10px]" :to="{ name: 'news' }"
            >Creators</router-link
          >
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped></style>
