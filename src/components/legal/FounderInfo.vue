<template>
  <!-- Founder info component -->
  <li 
    v-if="founder.hasOwnProperty('ownershipType')"
    @click.stop="toggleFounderInfo" 
    class="list-item">
    <div>
      <span>Iнформацiя про засновника</span>
      <span 
        v-show="
          founder.role
          || founder.country
          || founder.address
          || founder.type
          || founder.type && founder.code
          || founder.capital
          || founder.ownershipPercent">
        &nbsp;[{{ showFounderInfo ? "-" : "+" }}]
      </span>
    </div>
    <div v-if="showFounderInfo">
      <div v-if="founder.role">
        Роль: <span class="info-text">{{ founder.role }}</span>
      </div>
      <div v-if="founder.country">
        Країна: <span class="info-text">{{ founder.country }}</span>
      </div>
      <div v-if="founder.address">
        Адреса: <span class="info-text">{{ founder.address }}</span>
      </div>
      <div v-if="founder.type && founder.code">
        Власник компанiї: <span class="info-text">{{ founder.code }}</span>
      </div>
      <div v-if="founder.capital">
        Доля в статутному капiталi (грн): <span class="info-text">{{ founder.capital }}</span>
      </div>
      <div v-if="founder.ownershipPercent">
        Доля в статутному капiталi (%): <span class="info-text">{{ founder.ownershipPercent }}</span>
      </div>
      <div>
        Тип володiння: <span class="info-text">{{ getOwnerType(founder.type) }}</span>
      </div>
    </div>
  </li>
</template>
<script>
import { getOwnerType } from './helper'
export default {
  props: {
    founder: { type: Object },
  },
  data: () => ({
    showFounderInfo: false,
  }),
  methods: {
    getOwnerType,
    toggleFounderInfo() {this.showFounderInfo = !this.showFounderInfo},
  }
}
</script>