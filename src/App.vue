<template>
  <v-app>
    <vue-snotify></vue-snotify>
    <declaration-form></declaration-form>
  </v-app>
</template>

<script>
import DeclarationForm from './components/DeclarationForm'

export default {
  name: 'App',

  components: {
    DeclarationForm,
  },

  data: () => ({
  }),
};
</script>

<style>
@import "~vue-snotify/styles/material.css";

#app {
  background: #e85d56;
}
</style>