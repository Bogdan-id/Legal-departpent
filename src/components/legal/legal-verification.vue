<template>
  <ul>
    <li 
      @click.stop="toggleEsSanctions" 
      class="list-item">
      <ListSigns 
        title="Санкцiї ЕС"
        :data="legal.ESLegalSanctions.data"
        :state="showESLegalSanctions"
        :config="legal.ESLegalSanctions.config"
      />
      <ul 
        v-show="showESLegalSanctions"
        @click.prevent="toggleEsSanctions">
        <li
          @click="toggleDescription(ESLegalSanctionsShowedList, key)"
          class="verification-text"
          :class="{active: ESLegalSanctionsShowedList.includes(key)}"
          v-for="(item, key) in legal.ESLegalSanctions.data"
          :key="key">
          <span>
            {{ getInitials(item.text) }}&nbsp;
            [{{ ESLegalSanctionsShowedList.includes(key) ? "-" : "+" }}]
          </span>
          <div 
            v-show="ESLegalSanctionsShowedList.includes(key)"
            class="info-text">
            {{ getText(item.text, getInitials(item.text)) }}
          </div>
        </li>
      </ul>
    </li>
    <li 
      @click.stop="toggleYourControlSanctions" 
      class="list-item">
      <ListSigns 
        title="Санкцiї - yourControl (ЕС, США)"
        :data="legal.YourControlSanctions.data"
        :state="showYourControlSanctions"
        :config="legal.YourControlSanctions.config"
      />
      <ul 
        v-show="showYourControlSanctions"
        @click.prevent="toggleYourControlSanctions"
        class="mb-3">
        <li
          @click="toggleDescription(YourControlSanctionsShowedList, key)"
          :class="{active: RNBOLegalsShowedList.includes(key)}"
          v-for="(item, key) in legal.YourControlSanctions.data"
          :key="key">
          <span>
            {{ item.source }}&nbsp;
            [{{ YourControlSanctionsShowedList.includes(key) ? "-" : "+" }}]
          </span>
          <div v-show="YourControlSanctionsShowedList.includes(key)">
            <div>Характеристика: <span class="info-text">{{ item.description }}</span></div>
            <div>Опис: <span class="info-text">{{ item.details }}</span></div>
            <div>Дата: <span class="info-text">{{ item.date }}</span></div>
          </div>
        </li>
      </ul>
    </li>
    <li 
      @click.stop="toggleRNBOLegalSanctions" 
      class="list-item">
      <ListSigns 
        title="Санкцiї РНБО"
        :data="legal.RNBOLegals.data"
        :state="showRNBOLegalSanctions"
        :config="legal.RNBOLegals.config"
      />
      <ul 
        v-show="showRNBOLegalSanctions"
        @click.prevent="toggleRNBOLegalSanctions">
        <li
          @click="toggleDescription(RNBOLegalsShowedList, key)"
          class="verification-text"
          :class="{active: RNBOLegalsShowedList.includes(key)}"
          v-for="(item, key) in legal.RNBOLegals.data"
          :key="key">
          <span>
            {{ getInitials(item.text) }}&nbsp;
            [{{ RNBOLegalsShowedList.includes(key) ? "-" : "+" }}]
          </span>
          <div 
            v-show="RNBOLegalsShowedList.includes(key)"
            class="info-text">
            {{ getText(item.text, getInitials(item.text)) }}
          </div>
        </li>
      </ul>
    </li>
    <li 
      @click.stop="toggleUNLegalSanctions"
      class="list-item">
      <ListSigns 
        title="Санкцiї ООН"
        :data="legal.UNLegalSanctions.data"
        :state="showUNLegalSanctions"
        :config="legal.UNLegalSanctions.config"
      />
      <ul 
        v-show="showUNLegalSanctions"
        @click.prevent="toggleUNLegalSanctions">
        <li
          @click="toggleDescription(UNLegalSanctionsShowedList, key)"
          class="verification-text"
          :class="{active: UNLegalSanctionsShowedList.includes(key)}"
          v-for="(item, key) in legal.UNLegalSanctions.data"
          :key="key">
          <span>
            {{ item.unListType }}&nbsp;
            [{{ UNLegalSanctionsShowedList.includes(key) ? "-" : "+" }}]
          </span>
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
            <ul>
              <li 
                style="display: list-item"
                v-for="(name, key) in item.ENTITY_ALIAS"
                :key="key"
                class="ml-4 info-text">
                {{ name.ALIAS_NAME }}
              </li>
            </ul>
          </span>
          <span>Додаткова iнформацiя: {{ item.comment }}</span>
          <span>В санкцiйному списку з: {{ item.listedOn }}</span>
        </li>
      </ul>
    </li>
    <li 
      @click.stop="toggleUNTerrorLegalSanctions"
      class="list-item">
      <ListSigns 
        title="ООН терористи"
        :data="legal.UNLegalTerrors.data"
        :state="showUNTerrorLegalSanctions"
        :config="legal.UNLegalTerrors.config"
      />
      <ul 
        v-show="showUNTerrorLegalSanctions"
        @click.prevent="toggleUNTerrorLegalSanctions">
        <li
          @click="toggleDescription(UNLegalTerrorsShowedList, key)"
          class="verification-text"
          :class="{active: UNLegalTerrorsShowedList.includes(key)}"
          v-for="(item, key) in legal.UNLegalTerrors.data"
          :key="key">
          <span>
            {{ item.fullName }}&nbsp;
            [{{ UNLegalTerrorsShowedList.includes(key) ? "-" : "+" }}]
          </span>
          <span>Адреса: {{ item['address-list']}}</span>
          <span>Резолюцiя: {{ item['program-entry'] }}</span>
          <span v-if="item.alsoKnown && item.alsoKnown.length">
            <div>Також вiдомий як:</div>
            <ul>
              <li 
                class="ml-4 info-text"
                style="display: list-item"
                v-for="(name, key) in name.alsoKnown"
                :key="key">
                {{ name }}
              </li>
            </ul>
          </span>
        </li>
      </ul>
    </li>
    <li
      @click.stop="toggleUSLegalSanctions" 
      class="list-item">
      <ListSigns 
        title="Санкцiї США"
        :data="legal.USLegalSanctions.data"
        :state="showUSLegalSanctions"
        :config="legal.USLegalSanctions.config"
      />
      <ul 
        v-show="showUSLegalSanctions"
        @click.prevent="toggleUSLegalSanctions">
        <li
          @click="toggleDescription(USLegalSanctionsShowedList, key)"
          class="verification-text"
          :class="{active: USLegalSanctionsShowedList.includes(key)}"
          v-for="(item, key) in legal.USLegalSanctions.data"
          :key="key">
          <span>
            {{ item.lastName }}&nbsp;
            [{{ USLegalSanctionsShowedList.includes(key) ? "-" : "+" }}]
          </span>
          <span v-if="item.akaList && item.akaList.length">
            <div>Також вiомий як</div>
            <ul>
              <li 
                class="ml-4 info-text"
                style="display: list-item"
                v-for="(name, key) in item.akaList"
                :key="key">
                {{ name.fullName }}
              </li>
            </ul>
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
        </li>
      </ul>
    </li>
  </ul>
</template>

<script lang="ts">
import {
  toggleDescription, 
  getInitials,
  getText, 
  getCategoryName} from './helper'

import ListSigns from "./list-sign"

export default {
  components: {ListSigns},
  props: {legal: Object},
  data: () => ({
    showDeclarations: false,
    showESLegalSanctions: false,
    showRNBOLegalSanctions: false,
    showUNLegalSanctions: false,
    showUNTerrorLegalSanctions: false,
    showUSLegalSanctions: false,
    showYourControlSanctions: false,

    ESLegalSanctionsShowedList: [],
    RNBOLegalsShowedList: [],
    UNLegalSanctionsShowedList: [],
    UNLegalTerrorsShowedList: [],
    USLegalSanctionsShowedList: [],
    YourControlSanctionsShowedList: [],

    textExceptions: [
      'initials',
      'lastFirstName', 
      'lastName', 
      'firstName', 
      'patronymic',
    ],
  }),
  methods: {
    toggleEsSanctions() {this.showESLegalSanctions = !this.showESLegalSanctions},
    toggleRNBOLegalSanctions() {this.showRNBOLegalSanctions = !this.showRNBOLegalSanctions},
    toggleUNLegalSanctions() {this.showUNLegalSanctions = !this.showUNLegalSanctions},
    toggleUNTerrorLegalSanctions() {this.showUNTerrorLegalSanctions = !this.showUNTerrorLegalSanctions},
    toggleUSLegalSanctions() {this.showUSLegalSanctions = !this.showUSLegalSanctions},
    toggleYourControlSanctions() {this.showYourControlSanctions = !this.showYourControlSanctions},
    toggleDescription, 
    getCategoryName,
    getInitials,
    getText,
  },
}
</script>