<template>
  <div>
    <v-menu
      top
      offset-y
      :close-on-content-click="false">
      <template v-slot:activator="{ on, attrs }">
        <a style="position: relative" icon>
          {{ title.trim() }} {{ (data && data.length ? data.length : "") || true ? getCategoryName(data) : "[" + data && data.length ? data.length : 0 + "]" }}
          <v-icon 
            style="vertical-align: top;"
            v-bind="attrs"
            v-on="on"
            :size="11">
            {{ mdiInformation }}
          </v-icon>
        </a>
      </template>
      <v-card>
        <v-card-text class="config-info pt-6">
          <v-card-title 
            class="subtitle-1 pl-1 pt-0 pb-2"
            style="font-weight: bold">
            {{ title }}
          </v-card-title>
          <v-btn 
            @click="clickOutside"
            style="position: absolute; top: 2px; right: 2px"
            icon small>
            <v-icon color="grey lighten-4" small>{{ mdiClose }}</v-icon>
          </v-btn>
          <div>
            <span class="info-label">Дата запиту:&nbsp;&nbsp;</span> 
            <span class="info-data">{{ config.clientDate }}</span>
          </div> 
          <div>
            <span class="info-label">Тiло запиту:&nbsp;&nbsp;</span> 
            <span class="info-data">{{ config.data || config.url }}</span>
          </div> 
          <div>
            <span class="info-label">Метод:&nbsp;&nbsp;</span> 
            <span class="info-data">{{ config.method }}</span>
          </div> 
          <div>
            <span class="info-label">URL:&nbsp;&nbsp;</span> 
            <span class="info-data">{{ config.url }}</span>
          </div> 
          <div v-if="source">
            <span class="info-label">Джерело:&nbsp;&nbsp;</span> 
            <a class="list-sign-link" target="_blank" :href="source">{{ host }}</a>
          </div> 
        </v-card-text>
      </v-card>
    </v-menu>
    <span v-show="data && data.length">&nbsp;[{{ state ? "-" : "+" }}]</span>
  </div>
</template>
<script>
import { getCategoryName } from "./helper"
import { mdiClose, mdiInformation } from '@mdi/js'
export default {
  name: "list-signs",
  props: {
    data: { type: Array },
    title: { type: String },
    state: { type: Boolean },
    config: { type: Object },
    source: { type: String },
  },
  data: () => ({ mdiClose, mdiInformation }),
  computed: {
    host() {
      if (!this.source) return 
      return new URL(this.source).host
    }
  },
  methods: {
    getCategoryName,
    clickOutside() {
      document.getElementById('company-title').click()
    }  
  },
}
</script>
<style>
.config-info {
  color: white!important; 
  background: steelblue; 
  position: relative;
}
</style>
<style scoped>
.info-label {
  font-weight: 700;
}
.info-data {
  /*  */
}
.list-sign-link {
  color: white!important;
}
</style>