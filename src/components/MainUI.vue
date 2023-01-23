<template>
  <div class="max-w-[1400px] m-auto bg-[#252836] min-h-[900px] p-4">
    <Header />
    <div class="mt-[50px] flex">
      <Sidebar />
      <div class="flex flex-col">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from "../components/HeaderUI.vue";
import Sidebar from "../components/SidebarUI.vue";
import StoreComponent from "../views/StoreComponent.vue";
</script>

<style lang="scss" scoped></style>
