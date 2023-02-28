<template>
  <router-view></router-view>
</template>

<script setup lang="ts"></script>

<style>
body {
  background-color: #252836;
  /* padding: 10px; */
}
::placeholder {
  /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: black;
  opacity: 1; /* Firefox */
}

:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: black;
}

::-ms-input-placeholder {
  /* Microsoft Edge */
  color: black;
}
</style>
