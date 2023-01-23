<template>
  <div
    class="sticky top-0 bg-[#252836] min-[600px]:flex min-[600px]:justify-between min-[600px]:items-center max-[600px]:text-center"
  >
    <h1
      class="text-white text-[30px] font-popins font-semibold max-[1000px]:text-[20px] min-w-[120px]"
    >
      Game store
    </h1>
    <div class="relative w-full max-w-[500px]">
      <input
        placeholder="Search"
        class="h-[40px] rounded-xl outline-none pl-[10px] text-[18px] w-full bg-[#5a5b65] text-white"
        type="text"
      />
      <img
        class="absolute top-[10px] right-[10px] w-[20px] pointer-events-none opacity-70"
        src="../assets/seacrh-ico.png"
        alt="search"
      />
    </div>
    <div class="mr-[100px] max-[600px]:mt-[10px]">
      <div class="flex items-center">
        <BasketComponent />
        <ProfileMenuComponent />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

import { getAuth } from "@firebase/auth";

import BasketComponent from "./BasketComponent.vue";
import ProfileMenuComponent from "./ProfileMenuComponent.vue";
</script>

<style lang="scss" scoped></style>
