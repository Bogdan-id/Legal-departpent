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
            {{ item.fullName }}&nbsp;
            [{{ ESLegalSanctionsShowedList.includes(key) ? "-" : "+" }}]
          </span>
          <v-card-text 
            class="person-info" 
            v-show="ESLegalSanctionsShowedList.includes(key)">
            <p>
              <span class="info-label">Iнформацiя: </span> <span class="info-text">{{ item.information }}</span>
            </p>
            <p>
              <span class="info-label">Пiдстави: </span> <span class="info-text">{{ item.reasons }}</span>
            </p>
            <p>
              <span class="info-label">Дата внесення: </span> <span class="info-text">{{ item.dateListing }}</span>
            </p>
          </v-card-text>
        </li>
      </ul>
    </li>
    <li 
      v-if="legal.YourControlSanctions && legal.YourControlSanctions.data"
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
            {{ item.fullName }}&nbsp;
            [{{ RNBOLegalsShowedList.includes(key) ? "-" : "+" }}]
          </span>
          <v-card-text 
            class="person-info" 
            v-show="RNBOLegalsShowedList.includes(key)">
            <p>
              <span class="info-label">Характеристика: </span> <span class="info-text">{{ item.description }}</span>
            </p>
            <p>
              <span class="info-label">Обмеження: </span> <span class="info-text">{{ item.restrictiveMeasures }}</span>
            </p>
            <p>
              <span class="info-label">Термiн дiї: </span> <span class="info-text">{{ item.periodOfApplication }}</span>
            </p>
            <p>
              <span class="info-label">Документ: </span> <span class="info-text">{{ item.documentBasis }}</span>
            </p>
            <p>
              <span class="info-label">Дата внесення: </span> <span class="info-text">{{ item.dateApproval }}</span>
            </p>
          </v-card-text>
        </li>
      </ul>
    </li>
    <!-- Canada sanctions -->
    <li 
      @click.stop="toggleCanadaSanctions"  
      class="list-item">
      <ListSigns 
        title="Канада санкцiї"
        :data="legal.CanadaLegalSanctions.data"
        :state="showCanadaSanctions"
        :config="legal.CanadaLegalSanctions.config"
      />
      <ul 
        v-show="showCanadaSanctions"
        @click.prevent="toggleCanadaSanctions">
        <li
          @click="toggleDescription(CanadaLegalsShowedList, key)"
          class="verification-text"
          :class="{active: CanadaLegalsShowedList.includes(key)}"
          v-for="(item, key) in legal.CanadaLegalSanctions.data"
          :key="key">
          <span>
            {{ item.Entity }}&nbsp;
            [{{ CanadaLegalsShowedList.includes(key) ? "-" : "+" }}]
          </span>
          <v-card-text 
            class="person-info" 
            v-show="CanadaLegalsShowedList.includes(key)">
            <span v-show="item.Country">
              Країна: <span class="info-text">{{ item.Country }}</span>
            </span>
            <span v-show="item.Aliases">
              Також вiдомий як: <span class="info-text">{{ item.Aliases }}</span>
            </span>
          </v-card-text>
        </li>
      </ul>
    </li>
    <!-- Australia sanctions -->
    <li 
      @click.stop="toggleAustraliaSanctions"
      class="list-item">
      <ListSigns 
        title="Австралiя санкцiї"
        :data="legal.AustraliaLegalSanctions.data"
        :state="showAustraliaSanctions"
        :config="legal.AustraliaLegalSanctions.config"
      />
      <ul 
        v-show="showAustraliaSanctions"
        @click.prevent="toggleAustraliaSanctions">
        <li
          @click="toggleDescription(AustraliaLegalShowedList, key)" 
          class="verification-text"
          :class="{active: AustraliaLegalShowedList.includes(key)}"
          v-for="(item, key) in legal.AustraliaLegalSanctions.data"
          :key="key">
          <span>
            {{ item.fullName }}&nbsp;
            [{{ AustraliaLegalShowedList.includes(key) ? "-" : "+" }}]
          </span>
          <v-card-text 
            class="person-info" 
            v-show="AustraliaLegalShowedList.includes(key)">
            <span v-show="item.birthDate">
              Дата народження: <span class="info-text">{{ item.birthDate }}</span>
            </span>
            <span v-show="item.placeBirth">
              Мicце народження: <span class="info-text">{{ item.placeBirth }}</span>
            </span>
            <span v-show="item.citizenship">
              Громадянство: <span class="info-text">{{ item.citizenship }}</span>
            </span>
            <span v-show="item.additionalInfo">
              Iнфо: <span class="info-text">{{ item.additionalInfo }}</span>
            </span>
            <span v-show="item.address">
              Адреса: <span class="info-text">{{ item.address }}</span>
            </span>
            <span v-show="item.commitee">
              Органiзацiя: <span class="info-text">{{ item.commitee }}</span>
            </span>
            <span v-show="item.listingInfo">
              Дата: <span class="info-text">{{ item.listingInfo }}</span>
            </span>
          </v-card-text>
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

import ListSigns from "./list-sign.vue"

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
    showCanadaSanctions: false,
    showAustraliaSanctions: false,

    ESLegalSanctionsShowedList: [],
    RNBOLegalsShowedList: [],
    CanadaLegalsShowedList: [],
    AustraliaLegalShowedList: [],
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
    toggleCanadaSanctions() {this.showCanadaSanctions = !this.showCanadaSanctions},
    toggleAustraliaSanctions() {this.showAustraliaSanctions = !this.showAustraliaSanctions},
    toggleDescription, 
    getCategoryName,
    getInitials,
    getText,
  },
}
</script>