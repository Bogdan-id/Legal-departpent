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
    <CompanyInfo :company="person"/>
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
          <div 
            v-if="EDeclarationsShowedList.includes(key)" 
            @click.prevent="toggleDescription(EDeclarationsShowedList, key)">
            <span>Мiсце роботи: <span class="info-text">{{ item.infocard.office }}</span></span>
            <span>Посада: <span class="info-text">{{ item.infocard.position }}</span></span>
            <span>Дата декларації: <span class="info-text">{{ item.infocard.created_date }}</span></span>
            <span>Тип декларації: <span class="info-text">{{ item.infocard.document_type }}</span></span>
            <span>Публiчна особа: <span class="info-text">{{ item.infocard.isPep }}</span></span>
            <span>Зв`язки з ПЭП: 
              <span v-if="item.infocard.family && !item.infocard.family.length" class="info-text">Нi</span>
              <span v-if="item.infocard.family && item.infocard.family.length" class="info-text">
                <v-menu
                  :close-on-content-click="false"
                  top
                  offset-y>
                  <template v-slot:activator="{ on }">
                    <v-btn 
                      v-on="on"
                      color="grey darken-3" 
                      class="white--text"
                      style="text-transform: none"
                      small>
                      Так
                    </v-btn>
                  </template>
                  <v-card 
                    min-width="120" 
                    max-height="400"
                    style="overflow: scroll">
                    <v-card-text style="position: relative" class="pt-6">
                      <div class="text-right">
                        <v-btn 
                          @click="$refs.edthTable.$el.click()"
                          style="position: fixed; right: 10px; top: 5px;"
                          icon 
                          small>
                          <v-icon size="19">
                            {{ mdiClose }}
                          </v-icon>
                        </v-btn>
                      </div>
                      Сiм`я:
                      <pre>{{ JSON.stringify(item.infocard.family, null, 2) }}</pre>
                    </v-card-text>
                  </v-card>
                </v-menu>
              </span>
            </span>
            <span>Посилання: <a @click="openLink(item.infocard.url)" class="info-text">{{ item.infocard.url }}</a></span>
          </div>
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
        v-if="showYourControl && person.YourControlRNBO.data.data"
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
      v-if="person.YourControlDSFMU"
      @click.stop="toggleYourControlDSFMU" 
      class="list-item">
      <ListSigns 
        title="РНБО санкції (Your-control)"
        :data="person.YourControlDSFMU.data.data"
        :state="showYourControlDSFMU"
        :config="person.YourControlDSFMU.config"
      />
      <ul 
        v-if="showYourControlDSFMU && person.YourControlDSFMU.data.data"
        @click.prevent="toggleYourControlDSFMU">
        <li
          @click="toggleDescription(YourControlShowedList, key)"
          :class="{active: YourControlShowedList.includes(key)}"
          class="verification-text"
          v-for="(item, key) in person.YourControlDSFMU.data.data"
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
            {{ item.fullName }}&nbsp;
            [{{ ESPersonSanctionsShowedList.includes(key) ? "-" : "+" }}]
          </span>
          <v-card-text 
            class="person-info" 
            v-show="ESPersonSanctionsShowedList.includes(key)">
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
            {{ item.fullName }}&nbsp;
            [{{ RNBOSanctionsShowedList.includes(key) ? "-" : "+" }}]
          </span>
          <v-card-text 
            class="person-info" 
            v-show="RNBOSanctionsShowedList.includes(key)">
            <p>
              <span class="info-label">ПIБ: </span> <span class="info-text">{{ item.fullName }}</span>
            </p>
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
    <!-- Australia sanctions -->
    <li 
      v-if="person.AustraliaPersonSanctions"
      @click.stop="toggleAustraliaPersonSanctions"
      class="list-item">
      <ListSigns 
        title="Австралiя санкцii"
        :data="person.AustraliaPersonSanctions.data"
        :state="showAustraliaSanctions"
        :config="person.AustraliaPersonSanctions.config"
      />
      <ul 
        v-show="showAustraliaSanctions"
        @click.prevent="toggleAustraliaPersonSanctions">
        <li
          @click="toggleDescription(AustraliaPersonSanctionsShowedList, key)"
          :class="{active: AustraliaPersonSanctionsShowedList.includes(key)}"
          class="verification-text"
          v-for="(item, key) in person.AustraliaPersonSanctions.data.filter(item => !textExceptions.includes(item))"
          :key="key">
          <span>
            {{ item.fullName }}&nbsp;
            [{{ AustraliaPersonSanctionsShowedList.includes(key) ? "-" : "+" }}]
          </span>
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
        </li>
      </ul>
    </li>
    <!-- Canada sanctions [CanadaPersonSanctions]-->
    <li 
      v-if="person.CanadaPersonSanctions"
      @click.stop="toggleCanadaSanctions"
      class="list-item">
      <ListSigns 
        title="Канада санкцiї"
        :data="person.CanadaPersonSanctions.data"
        :state="showCanadaSanctions"
        :config="person.CanadaPersonSanctions.config"
      />
      <ul 
        v-show="showCanadaSanctions"
        @click.prevent="toggleCanadaSanctions">
        <li
          @click="toggleDescription(CanadaPersonSanctionsSshowedList, key)"
          :class="{active: CanadaPersonSanctionsSshowedList.includes(key)}"
          class="verification-text"
          v-for="(item, key) in person.CanadaPersonSanctions.data.filter(item => !textExceptions.includes(item))"
          :key="key">
          <span>
            {{ item.fullName }}&nbsp;
            [{{ CanadaPersonSanctionsSshowedList.includes(key) ? "-" : "+" }}]
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
  getOwnerType,
  getCategoryName } from "./helper"

import ListSigns from "./list-sign.vue"
import CompanyInfo from './company-info.vue'

export default {
  components: { ListSigns, CompanyInfo },
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
    showAustraliaSanctions: false,
    showCanadaSanctions: false,
    showYourControlDSFMU: false,

    USPersonSanctionShowedList: [],
    UNTerrorPersonSanctionsShowedList: [],
    CanadaPersonSanctionsSshowedList: [],
    AustraliaPersonSanctionsShowedList: [],
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
    toggleYourControlDSFMU() {this.showYourControlDSFMU = !this.showYourControlDSFMU},
    toggleYourControlRNBO() {this.showYourControl = !this.showYourControl},
    toggleSignerInfo() {this.showSignerInfo = !this.showSignerInfo},
    toggleFounderInfo() {this.showFounderInfo = !this.showFounderInfo},
    toggleDeclarations() {this.showDeclarations = !this.showDeclarations},
    toggleEsSanctions() {this.showEsSanctions = !this.showEsSanctions},
    toggleRNBOSanctions() {this.showRnboSunctions = !this.showRnboSunctions},
    toggleUNPersonSanctions() {this.showUNPersonSanctions = !this.showUNPersonSanctions},
    toggleUNTerrorPersonSanctions() {this.showUNTerrorPersonSanctions = !this.showUNTerrorPersonSanctions},
    toggleUSPersonSanctions() {this.showUSPersonSanctions = !this.showUSPersonSanctions},
    toggleAustraliaPersonSanctions() {this.showAustraliaSanctions = !this.showAustraliaSanctions},
    toggleCanadaSanctions() {this.showCanadaSanctions = !this.showCanadaSanctions},
    openLink(url) {
      window.open(url, '_blank')
    },
    getCategoryName,
    toggleDescription, 
    getInitials,
    getText,
    getOwnerType,
  },
}
</script>