<template>
<v-card 
  v-if="legal.code"
  :min-width="750"
  style="position: absolute; top: 250px; z-index: 500">
  <v-card-text class="text-left">
    <strong>{{ "Компанiя: " + legal.name.shortName }}</strong>
    <Legal 
      :legal="legal">
    </Legal>
  </v-card-text>
</v-card>
</template>
<script>
// import Founder from './founder.vue'
import Legal from './legal.vue'
export default {
  components: {
    // Founder,
    Legal,
  },
  props: {legal: Object},
  mounted() {
    console.log('LEGAL', this.legal)
  },
}
</script>