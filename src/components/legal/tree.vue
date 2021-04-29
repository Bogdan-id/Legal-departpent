<template>
<v-card 
  v-if="legal.code"
  :min-width="750"
  style="background: ghostwhite">
  <v-card-text 
    class="text-left pt-5"
    style="position: relative">
    <v-card-title 
      id="company-title"
      class="pt-0 pb-1">
      {{ legal.name.shortName }}
    </v-card-title>
    <v-btn 
      @click="$emit('update:legalDialog', false)"
      style="position: absolute; right: 4px; top: 3px;"
      icon
      small>
      <v-icon small>{{ mdiClose }}</v-icon>
    </v-btn>
    <Legal 
      :legal="legal">
    </Legal>
  </v-card-text>
</v-card>
</template>
<script>
import {mdiClose} from '@mdi/js'
import Legal from './legal.vue'
export default {
  components: {Legal},
  props: {
    legal: {type: Object},
    legalDialog: {type: Boolean},
  },
  data: () => ({mdiClose})
}
</script>