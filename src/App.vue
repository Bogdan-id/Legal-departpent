<template>
  <!-- Dom entry component (main) -->
  <v-app>
    <vue-snotify></vue-snotify>
    <router-view></router-view>
  </v-app>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
@import "~vue-snotify/styles/material.css";

.navigation-link {
  padding: 15px;
  display: block;
  text-align: right;
  margin-right: 25px;
  font-size: 0.8rem;
}
#app {
  background: #e85d56;
}
</style>