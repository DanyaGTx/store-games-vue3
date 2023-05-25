<template>
  <div>
    <h1 class="text-[30px] text-white">News</h1>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

onMounted(() => {
  window.scrollTo({
    top: 0,
  });
});
</script>

<style lang="scss" scoped></style>
