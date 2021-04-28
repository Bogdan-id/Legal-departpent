<template>
  <ul>
    <li 
      @click.stop="toggleEsSanctions" 
      class="list-item">
      <div>
        <a>Санкцiї європейського союзу:</a>
        <span>&nbsp;[{{legal.ESLegalSanctions.data.length}}]</span>
      </div>
      <div 
        v-show="showESLegalSanctions"
        @click.prevent="toggleEsSanctions">
        <p
          @click="toggleDescription(ESLegalSanctionsShowedList, key)"
          :class="{active: ESLegalSanctionsShowedList.includes(key)}"
          v-for="(item, key) in legal.ESLegalSanctions.data"
          :key="key"
          v-html="setText(item.text, key)">
        </p>
      </div>
    </li>
    <li 
      @click.stop="toggleRNBOLegalSanctions" 
      class="list-item">
      <div>
        <a>Санкцiї РНБО:</a>
        <span>&nbsp;[{{legal.RNBOLegals.data.length}}]</span>
        <span 
          v-show="legal.RNBOLegals.data.length">
          [{{ showRNBOLegalSanctions ? "-" : "+" }}]
        </span>
      </div>
      <div 
        v-show="showRNBOLegalSanctions"
        @click.prevent="toggleRNBOLegalSanctions">
        <p
          @click="toggleDescription(RNBOLegalsShowedList, key)"
          :class="{active: RNBOLegalsShowedList.includes(key)}"
          v-for="(item, key) in legal.RNBOLegals.data"
          :key="key"
          v-html="setText(item.text, key)">
          {{ item.text }}
        </p>
      </div>
    </li>
    <li 
      @click.stop="toggleUNLegalSanctions"
      class="list-item">
      <div>
        <a>Санкцiї ООН:</a>
        <span>&nbsp;[{{legal.UNLegalSanctions.data.length}}]</span>
        <span 
          v-show="legal.UNLegalSanctions.data.length">
          [{{ showUNLegalSanctions ? "-" : "+" }}]
        </span>
      </div>
      <div 
        v-show="showUNLegalSanctions"
        @click.prevent="toggleUNLegalSanctions">
        <p
          @click="toggleDescription(UNLegalSanctionsShowedList, key)"
          :class="{active: UNLegalSanctionsShowedList.includes(key)}"
          v-for="(item, key) in legal.UNLegalSanctions.data"
          :key="key">
          <span>організація: {{ item.unListType }}</span>
          <span>Пiдроздiл: {{ item.firstName }}</span>
          <span v-if="item.ENTITY_ADDRESS && item.ENTITY_ADDRESS.length">
            <div>Адреси: </div>
            <div 
              class="ml-4"
              v-for="(address, key) in item.ENTITY_ADDRESS"
              :key="key">
              {{ address.COUNTRY ? address.COUNTRY + " " : "" + address.CITY ? address.CITY + " " : ""}}
            </div>
          </span>
          <span v-if="item.ENTITY_ALIAS && item.ENTITY_ALIAS.length">
            <div>Також вiдомий як: </div>
            <div 
              v-for="(name, key) in item.ENTITY_ALIAS"
              :key="key"
              class="ml-4">
              {{ name.ALIAS_NAME }}
            </div>
          </span>
          <span>Додаткова iнформацiя: {{ item.comment }}</span>
          <span>В санкцiйному списку з: {{ item.listedOn }}</span>
        </p>
      </div>
    </li>
    <li 
      @click.stop="toggleUNTerrorLegalSanctions"
      class="list-item">
      <div>
        <a>ООН терористичнi організації:</a>
        <span>&nbsp;[{{legal.UNLegalTerrors.data.length}}]</span>
        <span 
          v-show="legal.UNLegalTerrors.data.length">
          [{{ showUNTerrorLegalSanctions ? "-" : "+" }}]
        </span>
      </div>
      <div 
        v-show="showUNTerrorLegalSanctions"
        @click.prevent="toggleUNTerrorLegalSanctions">
        <p
          @click="toggleDescription(UNLegalTerrorsShowedList, key)"
          :class="{active: UNLegalTerrorsShowedList.includes(key)}"
          v-for="(item, key) in legal.UNLegalTerrors.data"
          :key="key">
          <span>Назва організації: {{ item.fullName }}</span>
          <span>Адреса: {{ item['address-list']}}</span>
          <span>Резолюцiя: {{ item['program-entry'] }}</span>
          <span v-if="item.alsoKnown && item.alsoKnown.length">
            <div>Також вiдомий як:</div>
            <div 
              class="ml-4"
              v-for="(name, key) in name.alsoKnown"
              :key="key">
              {{ name }}
            </div>
          </span>
        </p>
      </div>
    </li>
    <li
      @click.stop="toggleUSLegalSanctions" 
      class="list-item">
      <div >
        <a>Санкцiї США:</a>
        <span>&nbsp;[{{legal.USLegalSanctions.data.length}}]</span>
        <span 
          v-show="legal.USLegalSanctions.data.length">
          [{{ showUSLegalSanctions ? "-" : "+" }}]
        </span>
      </div>
      <div 
        v-show="showUSLegalSanctions"
        @click.prevent="toggleUSLegalSanctions">
        <p
          @click="toggleDescription(USLegalSanctionsShowedList, key)"
          :class="{active: USLegalSanctionsShowedList.includes(key)}"
          v-for="(item, key) in legal.USLegalSanctions.data"
          :key="key">
          <span>Назва організації: {{ item.lastName }}</span>
          <span v-if="item.akaList && item.akaList.length">
            <div>Також вiомий як</div>
            <div 
              class="ml-4"
              v-for="(name, key) in item.akaList"
              :key="key">
              {{ name.fullName }}
            </div>
          </span>
          <span v-if="item.addressList && item.addressList.length">
            <div>Адреси: </div>
            <div 
              class="ml-4"
              v-for="(address, key) in item.addressList"
              :key="key">
              {{ address.country ? address.country  + " " : "" + address.city ? address.city : "" }}
            </div>
          </span>
        </p>
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
import { toggleDescription, setText, getCategoryName} from './helper'

export default {
  props: {legal: Object},
  data: () => ({
    showDeclarations: false,
    showESLegalSanctions: false,
    showRNBOLegalSanctions: false,
    showUNLegalSanctions: false,
    showUNTerrorLegalSanctions: false,
    showUSLegalSanctions: false,

    ESLegalSanctionsShowedList: [],
    RNBOLegalsShowedList: [],
    UNLegalSanctionsShowedList: [],
    UNLegalTerrorsShowedList: [],
    USLegalSanctionsShowedList: [],
  }),
  methods: {
    toggleEsSanctions() {this.showESLegalSanctions = !this.showESLegalSanctions},
    toggleRNBOLegalSanctions() {this.showRNBOLegalSanctions = !this.showRNBOLegalSanctions},
    toggleUNLegalSanctions() {this.showUNLegalSanctions = !this.showUNLegalSanctions},
    toggleUNTerrorLegalSanctions() {this.showUNTerrorLegalSanctions = !this.showUNTerrorLegalSanctions},
    toggleUSLegalSanctions() {this.showUSLegalSanctions = !this.showUSLegalSanctions},
    toggleDescription, 
    getCategoryName,
    setText,
  },
}
</script>