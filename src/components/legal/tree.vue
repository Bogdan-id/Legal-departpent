<template>
<v-card 
  v-if="legal.code"
  :min-width="750"
  style="background: ghostwhite">
  <v-card-text 
    class="text-left pt-8"
    style="position: relative">
    <v-btn 
      @click="$emit('update:legalDialog', false)"
      style="position: absolute; right: 4px; top: 3px;"
      icon
      small>
      <v-icon small>{{ mdiClose }}</v-icon>
    </v-btn>
    <!-- <strong>{{ "Компанiя: " + legal.name.shortName }}</strong> -->
    <Legal 
      :legal="legal">
    </Legal>
  </v-card-text>
</v-card>
</template>
<script>
import { 
  mdiClose, 
} from '@mdi/js'

// import Founder from './founder.vue'
import Legal from './legal.vue'
export default {
  components: {
    // Founder,
    Legal,
  },
  props: {
    legal: {type: Object},
    legalDialog: {type: Boolean},
  },
  data: () => ({
    mdiClose,
  })
}
</script>