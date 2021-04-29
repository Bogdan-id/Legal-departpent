<template>
  <ul>
    <!-- Signer -->
    <li 
      v-if="person.hasOwnProperty('appointDate')"
      @click.stop="toggleSignerInfo" 
      class="list-item">
      <div>
        <span>Iнформацiя про пiдписанта</span>
        <span>&nbsp;[{{ showSignerInfo ? "-" : "+" }}]</span>
      </div>
      <div 
        v-show="showSignerInfo"
        @click.prevent="toggleSignerInfo">
        <div v-show="person.appointDate">
          Дата пiдписання: <span class="info-text">{{ person.appointDate }}</span>
        </div>
        <div>
          Роль: <span class="info-text">{{ person.role }}</span>
        </div>
      </div>
    </li>
    <!-- Founder -->
    <li 
      v-if="person.hasOwnProperty('ownershipType')"
      @click.stop="toggleFounderInfo" 
      class="list-item">
      <div>
        <span>Iнформацiя про засновника</span>
        <span>&nbsp;[{{ showFounderInfo ? "-" : "+" }}]</span>
      </div>
      <div 
        v-show="showFounderInfo"
        @click.prevent="toggleFounderInfo">
        <div v-show="person.role">
          Роль: <span class="info-text">{{ person.role }}</span>
        </div>
        <div v-show="person.country">
          Країна: <span class="info-text">{{ person.country }}</span>
        </div>
        <div v-show="person.address">
          Адреса: <span class="info-text">{{ person.address }}</span>
        </div>
        <div v-show="person.type">
          Власник: <span class="info-text">{{ person.type ? "Так" : "Нi" }}</span>
        </div>
        <div v-show="person.type && person.code">
          Власник компанiї: <span class="info-text">{{ person.code }}</span>
        </div>
        <div v-show="person.capital">
          Доля в статутному капiталi (грн): <span class="info-text">{{ person.capital }}</span>
        </div>
        <div v-show="person.ownershipPercent">
          Доля в статутному капiталi (%): <span class="info-text">{{ person.ownershipPercent }}</span>
        </div>
      </div>
    </li>
    <!-- Declarations -->
    <li 
      v-if="person.EDeclarations"
      @click.stop="toggleDeclarations" 
      class="list-item">
      <ListSigns 
        title="Електронні декларації"
        :data="person.EDeclarations.data.results.object_list"
        :state="showDeclarations"
        :config="person.EDeclarations.config"
      />
      <ul 
        v-show="showDeclarations"
        @click.prevent="toggleDeclarations">
        <li
          @click="toggleDescription(EDeclarationsShowedList, key)"
          :class="{active: EDeclarationsShowedList.includes(key)}"
          class="verification-text"
          v-for="(item, key) in person.EDeclarations.data.results.object_list"
          :key="key">
          <span>
            {{ item.infocard.last_name + " " + item.infocard.first_name + " " + item.infocard.patronymic }}
            &nbsp;[{{ EDeclarationsShowedList.includes(key) ? "-" : "+" }}]
          </span>
          <span>Мiсце роботи: <span class="info-text">{{ item.infocard.office }}</span></span>
          <span>Посада: <span class="info-text">{{ item.infocard.position }}</span></span>
          <span>Дата декларації: <span class="info-text">{{ item.infocard.created_date }}</span></span>
          <span>Тип декларації: <span class="info-text">{{ item.infocard.document_type }}</span></span>
          <span>Посилання: <span class="info-text">{{ item.infocard.url }}</span></span>
        </li>
      </ul>
    </li>
    <li 
      v-if="person.YourControlRNBO"
      @click.stop="toggleYourControlRNBO" 
      class="list-item">
      <ListSigns 
        title="РНБО санкції (Your-control)"
        :data="person.YourControlRNBO.data.data"
        :state="showYourControl"
        :config="person.YourControlRNBO.config"
      />
      <ul 
        v-if="showYourControl && person.YourControlRNBO.data"
        @click.prevent="toggleYourControlRNBO">
        <li
          @click="toggleDescription(YourControlShowedList, key)"
          :class="{active: YourControlShowedList.includes(key)}"
          class="verification-text"
          v-for="(item, key) in person.YourControlRNBO.data.data"
          :key="key">
          <span>
            {{ item.fullName }}&nbsp;
            [{{ YourControlShowedList.includes(key) ? "-" : "+" }}]
          </span>
          <div v-show="YourControlShowedList.includes(key)">
            <span v-show="item.sanctionsBasis">
              Характеристика: <span class="info-text">{{ item.sanctionsBasis }}</span>
            </span>
            <span v-show="item.restrictiveMeasure">
              Обмеження: <span class="info-text">{{ item.restrictiveMeasure }}</span>
            </span>
            <span v-show="item.periodOfApplication">
              Термiн дії: <span class="info-text">{{ item.periodOfApplication }}</span>
            </span>
            <span v-show="item.note">
              Замiтка: <span class="info-text">{{ item.note }}</span>
            </span>
            <span v-show="item.personCategory">
              Категорiя: <span class="info-text">{{ item.personCategory }}</span>
            </span>
            <span v-show="item.source">
              Джерело Iнформацiї: <span class="info-text">{{ item.source }}</span>
            </span>
            <span v-show="item.documentBasis">
              Юридична постанова: <span class="info-text">{{ item.documentBasis }}</span>
            </span>
          </div>
        </li>
      </ul>
    </li>
    <li 
      v-if="person.ESPersonSanctions"
      @click.stop="toggleEsSanctions" 
      class="list-item">
      <ListSigns 
        title="ЕС санкцiї"
        :data="person.ESPersonSanctions.data"
        :state="showEsSanctions"
        :config="person.ESPersonSanctions.config"
      />
      <ul 
        v-show="showEsSanctions"
        @click.prevent="toggleEsSanctions">
        <li
          @click="toggleDescription(ESPersonSanctionsShowedList, key)"
          :class="{active: ESPersonSanctionsShowedList.includes(key)}"
          class="verification-text"
          v-for="(item, key) in person.ESPersonSanctions.data.filter(item => !textExceptions.includes(item))"
          :key="key">
          <span>
            {{ getInitials(item.text) }}&nbsp;
            [{{ ESPersonSanctionsShowedList.includes(key) ? "-" : "+" }}]
          </span>
          <div 
            v-show="ESPersonSanctionsShowedList.includes(key)"
            class="info-text">
            {{ getText(item.text, getInitials(item.text)) }}
          </div>
        </li>
      </ul>
    </li>
    <li
      v-if="person.RNBOSanctions"
      @click.stop="toggleRNBOSanctions" 
      class="list-item">
      <ListSigns 
        title="РНБО санкцiї"
        :data="person.RNBOSanctions.data"
        :state="showRnboSunctions"
        :config="person.RNBOSanctions.config"
      />
      <ul 
        v-show="showRnboSunctions"
        @click.prevent="toggleRNBOSanctions">
        <li
          @click="toggleDescription(RNBOSanctionsShowedList, key)"
          :class="{active: RNBOSanctionsShowedList.includes(key)}"
          class="verification-text"
          v-for="(item, key) in person.RNBOSanctions.data.filter(item => !textExceptions.includes(item))"
          :key="key">
          <span>
            {{ getInitials(item.text) }}&nbsp;
            [{{ RNBOSanctionsShowedList.includes(key) ? "-" : "+" }}]
          </span>
          <div class="info-text" v-show="RNBOSanctionsShowedList.includes(key)">
            {{ getText(item.text, getInitials(item.text)) }}
          </div>
        </li>
      </ul>
    </li>
    <li 
      v-if="person.UNPersonSanctions"
      @click.stop="toggleUNPersonSanctions"
      class="list-item">
      <ListSigns 
        title="ООН санкцiї"
        :data="person.UNPersonSanctions.data"
        :state="showUNPersonSanctions"
        :config="person.UNPersonSanctions.config"
      />
      <ul 
        v-show="showUNPersonSanctions"
        @click.prevent="toggleUNPersonSanctions">
        <li
          @click="toggleDescription(UNPersonSanctionsShowedList, key)"
          :class="{active: UNPersonSanctionsShowedList.includes(key)}"
          class="verification-text"
          v-for="(item, key) in person.UNPersonSanctions.data.filter(item => !textExceptions.includes(item))"
          :key="key">
          <span>
            {{ item.fullName }}&nbsp;
            [{{ UNPersonSanctionsShowedList.includes(key) ? "-" : "+" }}]
          </span>
          <span>Дата нородження: <span class="info-text">{{ item.dateOfBirth }}</span></span>
          <span>Нацiональнiсть: <span class="info-text">{{ item.nationality }}</span></span>
          <span>Посада: <span class="info-text">{{ item.designation }}</span></span>
          <span v-if="item['INDIVIDUAL_ALIAS'] && item['INDIVIDUAL_ALIAS'].length">
            <div>Також вiдомий як:</div>
            <ul>
              <li 
                style="display: list-item"
                class="info-text"
                v-for="(item, key) in item['INDIVIDUAL_ALIAS']"
                :key="key">
                {{ item['ALIAS_NAME'] }}
              </li>
            </ul>
          </span>
        </li>
      </ul>
    </li>
    <li 
      v-if="person.UNTerrorPersonSanctions"
      @click.stop="toggleUNTerrorPersonSanctions"
      class="list-item">
      <ListSigns 
        title="ООН терорист"
        :data="person.UNTerrorPersonSanctions.data"
        :state="showUNTerrorPersonSanctions"
        :config="person.UNTerrorPersonSanctions.config"
      />
      <ul 
        v-show="showUNTerrorPersonSanctions"
        @click.prevent="toggleUNTerrorPersonSanctions">
        <li
          @click="toggleDescription(UNTerrorPersonSanctionsShowedList, key)"
          :class="{active: UNTerrorPersonSanctionsShowedList.includes(key)}"
          class="verification-text"
          v-for="(item, key) in person.UNTerrorPersonSanctions.data.filter(item => !textExceptions.includes(item))"
          :key="key">
          <span>
            {{ item.fullName }}&nbsp;
            [{{ UNTerrorPersonSanctionsShowedList.includes(key) ? "-" : "+" }}]
          </span>
          <span>Резолюцiя: <span class="info-text">{{ item['program-entry'] }}</span></span>
          <span v-show="item['date-of-birth-list']">
            Дата народження: <span class="info-text">{{ item['date-of-birth-list'] }}</span>
          </span>
          <span v-show="item['place-of-birth-list']">
            Мiсце народження: <span class="info-text">{{ item['place-of-birth-list'] }}</span>
          </span>
          <span v-show="item['nationality-list']">
            Нацiональнiсть: <span class="info-text">{{ item['nationality-list'] }}</span>
          </span>
          <span v-show="item['comments']">
            Додатково: <span class="info-text">{{ item['comments'] }}</span>
          </span>
        </li>
      </ul>
    </li>
    <li
      v-if="person.USPersonSanctions"
      @click.stop="toggleUSPersonSanctions" 
      class="list-item">
      <ListSigns 
        title="Санкцiї США"
        :data="person.USPersonSanctions.data"
        :state="showUSPersonSanctions"
        :config="person.USPersonSanctions.config"
      />
      <ul 
        v-show="showUSPersonSanctions"
        @click.prevent="toggleUSPersonSanctions">
        <li
          @click="toggleDescription(USPersonSanctionShowedList, key)"
          :class="{active: USPersonSanctionShowedList.includes(key)}"
          class="verification-text"
          v-for="(item, key) in person.USPersonSanctions.data.filter(item => !textExceptions.includes(item))"
          :key="key">
          <span v-if="item.initials">
            {{ item.initials }}
            &nbsp;[{{ USPersonSanctionShowedList.includes(key) ? "-" : "+" }}]
          </span>
          <span v-if="!item.initials && item.lastName">{{ item.lastName }}</span>
          <span>{{ item.title }}</span>
          <span v-if="item.addressList && item.addressList.length">
            <div
              v-for="(item, key) in item.addressList"
              :key="key">
              Країна: 
              <span class="info-text">
                {{ item.country ? item.country : "" + " " + item.city ? item.city : "" }}
              </span>
            </div>
          </span>
          <span v-if="item.akaList && item.akaList.length">
            <div>Також вiдомий як: </div>
            <ul>
              <li 
                class="ml-3 info-text"
                style="display: list-item"
                v-for="(item, key) in item.akaList"
                :key="key">
                {{ item.initials }}
              </li>
            </ul>
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
  getCategoryName } from "./helper"

import ListSigns from "./list-sign"

export default {
  components: {ListSigns},
  props: {person: Object},
  data: () => ({
    showDeclarations: false,
    showEsSanctions: false,
    showRnboSunctions: false,
    showUNPersonSanctions: false,
    showUNTerrorPersonSanctions: false,
    showUSPersonSanctions: false,
    showFounderInfo: false,
    showSignerInfo: false,
    showYourControl: false,

    USPersonSanctionShowedList: [],
    UNTerrorPersonSanctionsShowedList: [],
    UNPersonSanctionsShowedList: [],
    RNBOSanctionsShowedList: [],
    ESPersonSanctionsShowedList: [],
    EDeclarationsShowedList: [],
    YourControlShowedList: [],

    textExceptions: [
      'initials',
      'lastFirstName', 
      'lastName', 
      'firstName', 
      'patronymic',
    ],
  }),
  methods: {
    toggleYourControlRNBO() {this.showYourControl = !this.showYourControl},
    toggleSignerInfo() {this.showSignerInfo = !this.showSignerInfo},
    toggleFounderInfo() {this.showFounderInfo = !this.showFounderInfo},
    toggleDeclarations() {this.showDeclarations = !this.showDeclarations},
    toggleEsSanctions() {this.showEsSanctions = !this.showEsSanctions},
    toggleRNBOSanctions() {this.showRnboSunctions = !this.showRnboSunctions},
    toggleUNPersonSanctions() {this.showUNPersonSanctions = !this.showUNPersonSanctions},
    toggleUNTerrorPersonSanctions() {this.showUNTerrorPersonSanctions = !this.showUNTerrorPersonSanctions},
    toggleUSPersonSanctions() {this.showUSPersonSanctions = !this.showUSPersonSanctions},
    getCategoryName,
    toggleDescription, 
    getInitials,
    getText,
  },
}
</script>