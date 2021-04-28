<template>
  <ul>
    <li 
      v-if="person.EDeclarations"
      @click.stop="toggleDeclarations" 
      class="list-item">
      <div>
        <a>Електронні декларації:</a>
        <span>&nbsp;[{{person.EDeclarations.data.results.object_list.length}}]</span>
        <span 
          v-show="person.EDeclarations.data.results.object_list.length">
          [{{ showDeclarations ? "-" : "+" }}]
        </span>
      </div>
      <div 
        v-show="showDeclarations"
        @click.prevent="toggleDeclarations">
        <p
          @click="toggleDescription(EDeclarationsShowedList, key)"
          :class="{active: EDeclarationsShowedList.includes(key)}"
          class="verification-text"
          v-for="(item, key) in person.EDeclarations.data.results.object_list"
          :key="key">
          <span>
            {{ item.infocard.last_name + " " + item.infocard.first_name + " " + item.infocard.patronymic }}
          </span>
          <span>Мiсце роботи: {{ item.infocard.office }}</span>
          <span>Посада: {{ item.infocard.position }}</span>
          <span>Дата декларації: {{ item.infocard.created_date }}</span>
          <span>Тип декларації: {{ item.infocard.document_type }}</span>
          <span>Посилання: {{ item.infocard.url }}</span>
        </p>
      </div>
    </li>
    <li 
      v-if="person.ESPersonSanctions"
      @click.stop="toggleEsSanctions" 
      class="list-item">
      <div>
        <a>Санкцiї європейського союзу:</a>
        <span v-show="person.ESPersonSanctions.data.length">&nbsp;
          (Спiвпадiння за {{getCategoryName(person.ESPersonSanctions.data)}} - &nbsp;{{person.ESPersonSanctions.data.length}})
        </span>
        <span 
          v-show="person.ESPersonSanctions.data.length">
          [{{ showEsSanctions ? "-" : "+" }}]
        </span>
      </div>
      <div 
        v-show="showEsSanctions"
        @click.prevent="toggleEsSanctions">
        <p
          @click="toggleDescription(ESPersonSanctionsShowedList, key)"
          :class="{active: ESPersonSanctionsShowedList.includes(key)}"
          class="verification-text"
          v-for="(item, key) in person.ESPersonSanctions.data"
          :key="key"
          v-html="setText(item.text, key)">
        </p>
      </div>
    </li>
    <li
      v-if="person.RNBOSanctions"
      @click.stop="toggleRNBOSanctions" 
      class="list-item">
      <div>
        <a>Санкцiї РНБО:</a>
        <span v-show="person.RNBOSanctions.data.length">&nbsp;
          (Спiвпадiння за {{getCategoryName(person.RNBOSanctions.data)}} - &nbsp;{{person.RNBOSanctions.data.length}})
        </span>
        <span 
          v-show="person.RNBOSanctions.data.length">
          [{{ showRnboSunctions ? "-" : "+" }}]
        </span>
      </div>
      <div 
        v-show="showRnboSunctions"
        @click.prevent="toggleRNBOSanctions">
        <p 
          @click="toggleDescription(RNBOSanctionsShowedList, key)"
          :class="{active: RNBOSanctionsShowedList.includes(key)}"
          class="verification-text"
          v-for="(item, key) in person.RNBOSanctions.data"
          :key="key"
          v-html="setText(item.text, key)">
        </p>
      </div>
    </li>
    <li 
      v-if="person.UNPersonSanctions"
      @click.stop="toggleUNPersonSanctions"
      class="list-item">
      <div>
        <a>Санкцiї ООН:</a>
        <span v-show="person.UNPersonSanctions.data.length">&nbsp;
          (Спiвпадiння за {{getCategoryName(person.UNPersonSanctions.data)}} - &nbsp;{{person.UNPersonSanctions.data.length}})
        </span>
        <span 
          v-show="person.UNPersonSanctions.data.length">
          [{{ showUNPersonSanctions ? "-" : "+" }}]
        </span>
      </div>
      <div 
        v-show="showUNPersonSanctions"
        @click.prevent="toggleUNPersonSanctions">
        <p
          @click="toggleDescription(UNPersonSanctionsShowedList, key)"
          :class="{active: UNPersonSanctionsShowedList.includes(key)}"
          class="verification-text"
          v-for="(item, key) in person.UNPersonSanctions.data"
          :key="key">
          <span>ПIБ: {{ item.fullName }}</span>
          <span>Дата нородження: {{ item.dateOfBirth }}</span>
          <span>Нацiональнiсть: {{ item.nationality }}</span>
          <span>Посада: {{ item.designation }}</span>
          <span v-if="item['INDIVIDUAL_ALIAS'] && item['INDIVIDUAL_ALIAS'].length">
            <div>Також вiдомий як:</div>
            <div 
              v-for="(item, key) in item['INDIVIDUAL_ALIAS']"
              :key="key">
              {{ item['ALIAS_NAME'] }}
            </div>
          </span>
        </p>
      </div>
    </li>
    <li 
      v-if="person.UNTerrorPersonSanctions"
      @click.stop="toggleUNTerrorPersonSanctions"
      class="list-item">
      <div>
        <a>ООН (терористи):</a>
        <span v-show="person.UNTerrorPersonSanctions.data.length">&nbsp;
          (Спiвпадiння за {{getCategoryName(person.UNTerrorPersonSanctions.data)}} - &nbsp;{{person.UNTerrorPersonSanctions.data.length}})
        </span>
        <span>&nbsp;[{{person.UNTerrorPersonSanctions.data.length}}]</span>
        <span 
          v-show="person.UNTerrorPersonSanctions.data.length">
          [{{ showUNTerrorPersonSanctions ? "-" : "+" }}]
        </span>
      </div>
      <div 
        v-show="showUNTerrorPersonSanctions"
        @click.prevent="toggleUNTerrorPersonSanctions">
        <p
          @click="toggleDescription(UNTerrorPersonSanctionsShowedList, key)"
          :class="{active: UNTerrorPersonSanctionsShowedList.includes(key)}"
          class="verification-text"
          v-for="(item, key) in person.UNTerrorPersonSanctions.data"
          :key="key">
          <span>ПIБ: {{ item.fullName }}</span>
          <span>Резолюцiя: {{ item['program-entry'] }}</span>
          <span>Дата народження: {{ item['date-of-birth-list'] }}</span>
          <span>Мiсце народження: {{ item['place-of-birth-list'] }}</span>
          <span>Нацiональнiсть: {{ item['nationality-list'] }}</span>
          <span>Додатково: {{ item['comments'] }}</span>
        </p>
      </div>
    </li>
    <li
      v-if="person.USPersonSanctions"
      @click.stop="toggleUSPersonSanctions" 
      class="list-item">
      <div >
        <a>Санкцiї США:</a>
        <span v-show="person.USPersonSanctions.data.length">&nbsp;
          (Спiвпадiння за {{getCategoryName(person.USPersonSanctions.data)}} - &nbsp;{{person.USPersonSanctions.data.length}})
        </span>
        <span 
          v-show="person.USPersonSanctions.data.length">
          [{{ showUSPersonSanctions ? "-" : "+" }}]
        </span>
      </div>
      <div 
        v-show="showUSPersonSanctions"
        @click.prevent="toggleUSPersonSanctions">
        <p
          @click="toggleDescription(USPersonSanctionShowedList, key)"
          :class="{active: USPersonSanctionShowedList.includes(key)}"
          class="verification-text"
          v-for="(item, key) in person.USPersonSanctions.data"
          :key="key">
          <span v-if="item.initials">{{ item.initials }}</span>
          <span v-if="!item.initials && item.lastName">{{ item.lastName }}</span>
          <span>{{ item.title }}</span>
          <span v-if="item.addressList && item.addressList.length">
            <div 
              v-for="(item, key) in item.addressList"
              :key="key">
              Країна: {{ item.country ? item.country : "" + " " + item.city ? item.city : "" }}
            </div>
          </span>
          <span v-if="item.akaList && item.akaList.length">
            <div>Також вiдомий як: </div>
            <div 
              class="ml-3"
              v-for="(item, key) in item.akaList"
              :key="key">
              {{ item.initials }}
            </div>
          </span>
        </p>
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
import { toggleDescription, setText, getCategoryName } from './helper'

export default {
  props: {person: Object},
  data: () => ({
    showDeclarations: false,
    showEsSanctions: false,
    showRnboSunctions: false,
    showUNPersonSanctions: false,
    showUNTerrorPersonSanctions: false,
    showUSPersonSanctions: false,

    USPersonSanctionShowedList: [],
    UNTerrorPersonSanctionsShowedList: [],
    UNPersonSanctionsShowedList: [],
    RNBOSanctionsShowedList: [],
    ESPersonSanctionsShowedList: [],
    EDeclarationsShowedList: [],
  }),
  methods: {
    toggleDeclarations() {this.showDeclarations = !this.showDeclarations},
    toggleEsSanctions() {this.showEsSanctions = !this.showEsSanctions},
    toggleRNBOSanctions() {this.showRnboSunctions = !this.showRnboSunctions},
    toggleUNPersonSanctions() {this.showUNPersonSanctions = !this.showUNPersonSanctions},
    toggleUNTerrorPersonSanctions() {this.showUNTerrorPersonSanctions = !this.showUNTerrorPersonSanctions},
    toggleUSPersonSanctions() {this.showUSPersonSanctions = !this.showUSPersonSanctions},
    getCategoryName,
    toggleDescription, 
    setText,
  },
}
</script>