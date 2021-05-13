<template>
  <v-row class="api-form text-center justify-center">
    <v-dialog v-model="legalDialog">
      <LegalTree 
        :legal="globalObject"
        :legalDialog.sync="legalDialog">
      </LegalTree>
    </v-dialog>
    <v-dialog 
      v-model="searchConfigDialog"
      :max-width="540">
      <v-card style="position: relative" class="pb-4">
        <v-tooltip 
          bottom
          color="grey darken-3">
          <template #activator="{ on }">
            <v-btn 
              v-on="on"
              @click="searchConfigDialog = !searchConfigDialog"
              style="position: absolute; top: 5px; right: 5px;"
              small
              icon>
              <v-icon :size="21">
                {{ mdiClose }}
              </v-icon>
            </v-btn>
          </template>
          <span>Закрити</span>
        </v-tooltip>
        <v-card-title 
          class="pb-0"
          style="color: #4682b4">
          Налаштування пошуку
        </v-card-title>
        <v-card-title 
          class="body-1 pt-3 pb-0">
          YourScore:
        </v-card-title>
        <v-card-text class="pt-0 pl-7">
          <v-checkbox 
            v-model="yourScoreRNBO"
            label="Пошук фiз. осiб - РНБО"
            color="red lighten-2"
            hide-details
            dense>
          </v-checkbox>
          <v-checkbox 
            v-model="yourScoreDSFMU"
            label="Пошук фiз. осiб - ДСФМУ (терористи)"
            color="red lighten-2"
            hide-details
            dense>
          </v-checkbox>
          <v-checkbox 
            v-model="yourScoreForeignLegalSanctions"
            label="Пошук закордонних санкцiй до юр. особи"
            color="red lighten-2"
            hide-details
            dense>
          </v-checkbox>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-fade-transition hide-on-leave>
          <v-btn 
            v-show="personDialog && !showRequisite"
            @click="showRequisite = !showRequisite"
            v-on="on"
            class="toggle-hint-btn" 
            small>
            <v-icon color="grey darken-3">{{ mdiInformation }}</v-icon>
          </v-btn>
        </v-fade-transition>
      </template>
      <span>Вiдобразити реквiзити запиту</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-scroll-x-transition hide-on-leave>
          <v-btn 
            v-show="!personDialog && !showRule && (choosedPerson || choosedLegal)"
            @click="showRule = !showRule"
            v-on="on"
            class="toggle-hint-btn white--text"
            color="#424242" 
            small>
            <v-icon color="grey lighten-4">{{ mdiSortAlphabeticalAscendingVariant }}</v-icon>
          </v-btn>
        </v-scroll-x-transition>
      </template>
      <span>Переглянути правила за якими здiйснюється транслiтерацiя</span>
    </v-tooltip>
    <v-dialog v-model="showRule"
      :max-width="800">
      <v-card class="alphabet-table-wrapper">
        <v-card-text class="pa-0 pb-9" style="position: relative;">
          <v-btn 
            @click="showRule = !showRule"
            style="position: absolute; right: 2px; top: 0px;" 
            icon><v-icon color="grey lighten-3">{{ mdiClose }}</v-icon></v-btn>
          <v-data-table
            :headers="transliteRuleTH"
            :items="transliteRule"
            :items-per-page="100"
            class="alphabet-table"
            hide-default-footer
            dense>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-scroll-y-transition>
      <v-card v-show="personDialog && showRequisite" class="card-req-info">
        <v-card-text class="req-info-wrapper">
          <!-- temporary mdi-close -->
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn 
                @click="ukVersion = !ukVersion" 
                v-on="on"
                class="change-req-info-btn" 
                x-small icon>
                <v-icon>{{ mdiAxisZRotateClockwise }}</v-icon>
              </v-btn>
            </template>
            <span>{{ ukVersion ? "Вiдобразити iнiцiали EN" : "Вiдобразити iнiцiали UK"}}</span>
          </v-tooltip> 
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn 
                v-on="on"
                @click="showRequisite = !showRequisite"
                class="close-req-info-btn"
                x-small icon>
                <v-icon>{{ mdiWindowMinimize }}</v-icon>
              </v-btn>
            </template>
            <span>Згорнути</span>
          </v-tooltip>
          <v-fade-transition hide-on-leave>
            <table v-show="choosedPerson && ukVersion" class="req-info">
              <tr>
                <th>Прiзвище</th>
                <th>Iм`я</th>
                <th>По батьковi</th>
              </tr>
              <tr>
                <td>{{lastName ? this.capitalize(lastName) : ""}}</td>
                <td>{{firstName ? this.capitalize(firstName) : ""}}</td>
                <td>{{patronymic ? this.capitalize(patronymic) : ""}}</td>
              </tr>
            </table>
          </v-fade-transition>
          <v-fade-transition hide-on-leave>
            <table v-show="choosedPerson && !ukVersion" class="req-info">
              <tr>
                <th>Прiзвище</th>
                <th>Iм`я</th>
                <th>По батьковi</th>
              </tr>
              <tr>
                <td>{{lastName ? this.transliterate(lastName) : ""}}</td>
                <td>{{firstName ? this.transliterate(firstName) : ""}}</td>
                <td>{{patronymic ? this.transliterate(patronymic) : ""}}</td>
              </tr>
            </table>
          </v-fade-transition>
          <v-fade-transition hide-on-leave>
            <table v-show="choosedLegal && ukVersion" class="req-info">
              <tr>
                <th>ЄДРПОУ</th>
                <th>Компанiя</th>
              </tr>
              <tr>
                <td style="text-align: center;">{{ edrpou }}</td>
                <td style="text-align: center;">{{ companyName ? companyName : "--" }}</td>
              </tr>
            </table>
          </v-fade-transition>
          <v-fade-transition hide-on-leave>
            <table v-show="choosedLegal && !ukVersion" class="req-info">
              <tr>
                <th>ЄДРПОУ</th>
                <th>Компанiя</th>
              </tr>
              <tr>
                <td style="text-align: center;">{{ edrpou }}</td>
                <td style="text-align: center;">{{ companyName ? this.transliterate(companyName) : "--" }}</td>
              </tr>
            </table>
          </v-fade-transition>
        </v-card-text>
      </v-card>
    </v-scroll-y-transition>

    <!-- form -->
    <v-col cols="12" xl="3" lg="4" md="4"  sm="6" xs="10">
      <v-card class="mt-8 ml-5 mr-5 mb-8">
        <v-col>
          <v-card-text class="pb-0" style="position: relative;">
            <v-fade-transition hide-on-leave>
              <v-tooltip
                color="grey darken-3" 
                bottom>
                <template #activator="{ on }">
                  <v-btn 
                    v-on="on"
                    v-show="choosedLegal || choosedPerson"
                    @click="searchConfigDialog = !searchConfigDialog"
                    style="position: absolute; top: 0; right: 0;"
                    icon>
                    <v-icon>
                      {{ mdiCog }}
                    </v-icon>
                  </v-btn>
                </template>
                <span>Налаштування пошуку</span>
              </v-tooltip>
            </v-fade-transition>
            <div style="font-size: 1.05rem; text-align: left;">Оберiть критерiй пошуку</div>
            <v-radio-group dense single-line
              v-model="searchVariant">
              <v-radio
                :value="1"
                color="grey darken-2"
                label="Фiзична особа">
              </v-radio>
              <v-radio
                :value="2"
                color="grey darken-2"
                label="Юридична особа">
              </v-radio>
            </v-radio-group>
            <v-fade-transition hide-on-leave>
              <div v-show="choosedPerson">
                <v-radio-group 
                  v-model="searchType"
                  dense 
                  single-line>
                  <v-radio
                    :value="'searchByInitials'"
                    color="grey darken-2"
                    label="Пошук за ПIБ">
                  </v-radio>
                  <v-radio
                    :value="'searchByInn'"
                    color="grey darken-2"
                    label="Пошук за IНН">
                  </v-radio>
                </v-radio-group>
                <div v-if="personInitials">
                  <v-text-field
                    @blur="$v.lastName.$touch()"
                    :error-messages="lastNameErr"
                    v-model="lastName"
                    label="Прiзвище"
                    color="black">
                  </v-text-field>
                  <v-text-field
                    v-model="firstName"
                    @blur="$v.firstName.$touch()"
                    :error-messages="firstNameErr"
                    label="Iм`я"
                    color="black">
                  </v-text-field>
                  <v-text-field
                    @blur="$v.patronymic.$touch()"
                    :error-messages="patronymicErr"
                    v-model="patronymic"
                    label="По батьковi"
                    color="black">
                  </v-text-field>
                </div>
                <div v-if="personInn">
                  <v-text-field
                    @input="trimExceededLength('inn', 10, (value) => value.replace(/[^\d.]/g, ''))"
                    @blur="$v.inn.$touch()"
                    :error-messages="innErr"
                    v-model="inn"
                    id="inn"
                    label="IНН"
                    color="black">
                  </v-text-field>
                </div>
              </div>
            </v-fade-transition>
            <v-fade-transition hide-on-leave>
              <div v-if="choosedLegal">
                <v-text-field
                  v-model="edrpou"
                  :error-messages="edrpouErr"
                  @blur="$v.edrpou.$touch()"
                  @input="trimExceededLength('edrpou', 8, (value) => value.replace(/[^\d.]/g, ''))"
                  :label="'ЄДРПОУ'"
                  id="edrpou"
                  color="black">
                </v-text-field>
              </div>
            </v-fade-transition>
          </v-card-text>
          <v-card-actions 
            class="justify-center">
            <v-slide-x-transition hide-on-leave>
              <v-btn 
                v-show="requisites"
                @click="submit()"
                color="grey darken-3"
                class="white--text sbmt-btn"
                small
                :disabled="searchVariant === null"
                :loading="loading">
                Отримати данi
              </v-btn>
            </v-slide-x-transition>
          </v-card-actions>
        </v-col>
      </v-card>
    </v-col>
    <PersonInfo 
      v-if="choosedPerson"
      :edrListPerson="edrListPerson"
      :yourControlSanctionList="yourControlSanctionList"
      :eDeclarationList="eDeclarationList"
      :rnboList="rnboList"
      :unSanctionList="unSanctionList"
      :canadaSanctionList="canadaSanctionList"
      :australiaSanctionList="australiaSanctionList"
      :unTerrorList="unTerrorList"
      :esSanctionList="esSanctionList"
      :usSanctionList="usSanctionList"
      :yourControlRnboList="yourControlRnboList"
      :yourControlDsfmuList="yourControlDsfmuList"
      :dialog.sync="personDialog">
    </PersonInfo>
  </v-row>
</template>
<script>
import { legal } from "./DeclarationForm.js" 
export default legal
</script>

<style>
.v-data-table.person-table > .v-data-table__wrapper > table > tbody > tr:last-child {
  display: none!important;
}
.v-card.item-card {
  max-height: 330px!important;
  overflow-y: scroll!important;
}

.nested-table .v-data-footer__select {
  display: none!important;
}

.v-data-table .half-table {
  width: 50%; 
  display: inline-block; 
  vertical-align: top;
}

.v-data-table .one-third-table {
  width: 33.33%; 
  display: inline-block; 
  vertical-align: top;
}

.v-data-table .two-third-table {
  width: 66.66%; 
  display: inline-block; 
  vertical-align: top;
}

.v-card.card-req-info {
  position: fixed; 
  left: 15px; 
  top: 10px; 
  z-index: 1000
}

.alphabet-table-wrapper {
  max-height: 600px; 
  overflow-x: hidden; 
  overflow-y: scroll; 
  border-radius: 0px;
}

.v-card__text.req-info-wrapper {
  text-align: left; 
  font-size: 0.8rem; 
  line-height: 0.95rem; 
  padding: 0.8rem;
  position: relative;
}

table.req-info {
  padding-top: 7px;
}

table.req-info td,th {
  padding: 2px 3px!important;
}

td.custom-td {
  background: beige!important;
}

.nested-table {
  /* border: 2px solid!important; */
  border-radius: 5px!important;
  margin-top: 7px!important;
}

button.change-req-info-btn {
  position: absolute; 
  right: 26px; 
  top: 2px;
}

button.close-req-info-btn {
  position: absolute;
  right: 5px; 
  top: 2px;
}

button.toggle-hint-btn {
  z-index: 1000; 
  position: fixed; 
  top: 15px; 
  left: 15px;
}

button.sbmt-btn.v-btn {
  border-radius: 2px;
}

.v-card__text.custom-bg {
  background: rosybrown!important; 
  border-radius: 3px!important;
  /* linear-gradient(45deg, black, transparent); */
  /* Favorites: rosybrown, tan */
}
.api-form .v-card, .v-dialog {
  overflow: visible!important;
  /* overflow-x: hidden!important; */
}

.api-form .v-dialog {
  margin: 34px!important;
}

.search-text {
  color: #fff;
  background: #e85d56;
  border-radius: 0.1rem;
  padding: 0 2px;
}

.custom-table tr th {
  padding: 1rem!important;
}

.custom-table table {
  table-layout: fixed;
}

.custom-table tr:hover {
  background: #fff!important;
}

.custom-table .custom-header-row .custom-header {
  /* color: #34495d!important;  */
  font-size: 1rem;
  border-bottom: none!important;
}

.custom-table tbody tr td:first-child {
  font-weight: bold;
  color: rgba(0, 0, 0, 0.637);
}
.d-block.section-btn {
  width: 100%; 
  justify-content: start;
  background: #424242!important;
  border-radius: 0!important;
  margin: 2px 0!important;
  /* border-bottom: 2px solid black!important; */
  /* text-transform: none; */
}
.d-block.section-btn .btn-count {
  color: #e57373;
}

.modal-card .v-icon {
  transition: transform 0.3s ease-out;
}

.modal-card .active.v-icon {
  transform: rotate(180deg)!important;
}

.v-list.v-select-list .v-list-item--active {
  color:#e85d56!important;
}
.v-data-footer__select .v-input--is-label-active.v-input--is-dirty.v-input--is-focused {
  color:#e85d56!important;
}

.v-data-footer__select .v-input--is-label-active.v-input--is-dirty.v-input--is-focused .v-icon {
  color:#e85d56!important;
}

.v-data-table tr:hover:not(.v-data-table__expanded__content) {
  background: transparent!important;
}
.v-data-table th {
  text-transform: uppercase!important;
}

.v-data-table thead {
  vertical-align: middle!important;
}

.alphabet-table.v-data-table thead {
  background: beige!important;
}

.alphabet-table.v-data-table thead th {
  height: 55px!important;
  padding: 2px 13px!important;
  background: #424242;
  color: #f5f5f5!important;
  /* text-transform: capitalize!important; */
}

.alphabet-table.v-data-table tbody {
  background: #f5f5f5!important;
  color: #424242!important;
}

.table-title {
  color: black; 
  background: rgb(245, 245, 220); 
  font-weight: bold; 
  padding: 3px 4px;
}

.alphabet-table.v-data-table tbody td {
  border-bottom: 0!important;
}

tr.v-data-table__expanded.v-data-table__expanded__content {
  box-shadow: none!important;
}

::-webkit-scrollbar-track {
  border-radius: 10px;
  background-color: #F5F5F5;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background-color: #F5F5F5;
}

::-webkit-scrollbar-thumb {
  border-radius: 0px;
  background-color: rgba(85, 85, 85, 0.836);
}
.result-header {
  text-transform: none;
  font-size: 0.8rem;
  font-weight: normal;
  padding-bottom: 0.9rem;
  padding-left: 0.5rem;
  color: floralwhite;
}
  .v-card__text > .node-tree {
    max-height: 80vh;
    overflow: hidden;
    overflow-y: auto;
  }
  .list-item {
    font-weight: bold;
    cursor: pointer;
  }
  .node-tree {
    font-family: Menlo, Consolas, monospace;
  }
  .node-tree p {
    margin-bottom: 8px!important;
  }
  .verification-text span {
    display: none;
  }
  .verification-text span:first-child {
    display: inline;
  }
  .verification-text.active :not(span:first-child) {
    display: block;
  }
  .verification-text.active {
    white-space: normal;
    width: 100%;
    text-decoration: none;
  }
  .verification-text.active span {
    display: inline;
  }
  .info-text {
    font-weight: 500;
  }
  .person-info .info-label {
    font-weight: bold;
  }
</style>