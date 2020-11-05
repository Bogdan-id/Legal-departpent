<template>
  <v-row class="api-form text-center justify-center">
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn 
          v-show="dialog && !showRequisite"
          @click="showRequisite = !showRequisite"
          v-on="on"
          class="toggle-hint-btn" 
          small>
          <v-icon color="grey darken-3">{{ mdiInformation }}</v-icon>
        </v-btn>
      </template>
      <span>Вiдобразити реквiзити запиту</span>
    </v-tooltip>
    <v-scroll-y-transition>
      <v-card v-show="dialog && showRequisite" class="card-req-info">
        <v-card-text class="req-info-wrapper">
          <!-- temporary mdi-close -->
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn 
                v-show="choosedPerson"
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
          <div v-show="choosedLegal" style="padding-top: 7px;">
            <span style="color: black;">ЄДРПОУ </span>
            <span>{{ edrpou }}</span>
          </div>
        </v-card-text>
      </v-card>
    </v-scroll-y-transition>

    <!-- modal window -->
    <v-dialog
      v-model="dialog"
      :max-width="800">
      <div style="position: relative;">

        <!-- close button -->
        <v-hover #default="{ hover }" >
          <v-btn 
            :style="closeAbsBtn"
            @click="dialog = !dialog" 
            :color="hover 
              ? 'rgba(255, 255, 255, 0.801)' 
              : 'rgba(255, 255, 255, 0.562)'"
            
            icon>
            <v-icon>{{ mdiClose }}</v-icon>
          </v-btn>
        </v-hover>
        <v-card-text class="pl-1 pr-1 pt-3 custom-bg modal-card" elevation="0">
          <v-btn @click="makeActive('EDR')" 
            class="d-block white--text section-btn"
            :color="btnActv('EDR') ? 'grey darken-1' : 'grey darken-3'">
            Єдиний державний реєстр&nbsp;-&nbsp;[<span :style="`color: ${edrList.length > 0 ? '#e57373;' : ''}`">{{ edrList.length }}</span>]
            <v-icon 
              :class="btnActv('EDR') ? 'active' : ''" 
              color="white">{{ mdiMenuDown }}</v-icon>
          </v-btn>
          <v-scroll-x-transition hide-on-leave>
            <v-card v-show="btnActv('EDR')" class="mb-2 item-card">
              <v-card-text v-show="edrList.length">
                <v-data-table
                  :headers="EDRTH"
                  :items="edrList"
                  :items-per-page="10"
                  :expanded.sync="edrExpanded"
                  show-expand
                  :single-expand="true"
                  item-key="_id"
                  dense>
                  <template #expanded-item="{ headers, item }">
                    <v-scroll-y-reverse-transition>
                      <td class="pa-0 custom-td" :colspan="headers.length" v-show="edrExpandedW">
                        <v-simple-table
                          v-if="item.founders.length" 
                          :class="item.beneficialOwners.length ? 'half-table' : ''" 
                          dense>
                          <template #default>
                            <thead>
                              <tr style="background: #f5f5dc!important;">
                                <th class="text-left black--text">
                                  Засновники:
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="(i, k) in item.founders"
                                :key="k">
                                <td class="d-sm-table-cell">{{ k + 1 + ". " + i }}</td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                        <v-simple-table 
                          v-if="item.beneficialOwners.length"
                          :class="item.founders.length ? 'half-table' : ''"  
                          dense>
                          <template #default>
                            <thead>
                              <tr style="background: #f5f5dc!important;">
                                <th class="text-left black--text">
                                  Бенефiцiарнi власники:
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="(i, k) in item.beneficialOwners"
                                :key="k">
                                <td class="d-sm-table-cell">{{ k + 1 + ". " + i }}</td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </td>
                    </v-scroll-y-reverse-transition>
                  </template>
                </v-data-table>
              </v-card-text>
              <v-card-text v-show="!edrList.length">
                Данi для вiдображення вiдсутнi
              </v-card-text>
            </v-card>
          </v-scroll-x-transition>
          <v-btn @click="makeActive('PEP')" 
            class="d-block white--text section-btn"
            :color="btnActv('PEP') ? 'grey darken-1' : 'grey darken-3'">
            Публiчнi особи&nbsp;-&nbsp;[<span :style="`color: ${pepList.length > 0 ? '#e57373;' : ''}`">{{ pepList.length }}</span>]
            <v-icon 
              :class="btnActv('PEP') ? 'active' : ''" 
              color="white">{{ mdiMenuDown }}
            </v-icon>
          </v-btn>
          <v-scroll-x-transition hide-on-leave>
            <v-card v-show="btnActv('PEP')" class="mb-2 item-card">
              <v-card-text v-show="pepList.length">
                <v-data-table
                  :headers="PEPTH"
                  :items="pepList"
                  :items-per-page="10"
                  :expanded.sync="pepExpanded"
                  show-expand
                  single-expand
                  item-key="_id"
                  dense>
                  <template #expanded-item="{ item, headers }">
                    <v-scroll-y-reverse-transition>
                      <td class="pa-0 custom-td" :colspan="headers.length" v-show="pepExpandedW">
                        <div class="font-weight-bold">Зв`язки з юридичними особами</div>
                        <v-data-table 
                          class="nested-table"
                          :headers="pepNestedLegal"
                          :items="item.related_companies"
                          :items-per-page="15"
                          dense>
                        </v-data-table>
                        <div class="font-weight-bold">Зв`язки з фiзичними особами</div>
                        <v-data-table 
                          class="nested-table"
                          :headers="pepNestedPerson"
                          :items="item.related_persons"
                          :items-per-page="15"
                          dense>
                        </v-data-table>
                      </td>
                    </v-scroll-y-reverse-transition>
                  </template>
                  <template #item.action="{ item }">
                    <v-btn small @click="goToPage(item.url)">
                      <v-icon>{{ mdiTextBoxSearchOutline }}</v-icon>
                    </v-btn>
                  </template>
                </v-data-table>
              </v-card-text>
              <v-card-text v-show="!pepList.length">
                Данi для вiдображення вiдсутнi
              </v-card-text>
            </v-card>
          </v-scroll-x-transition>
          <v-btn @click="makeActive('ED')" 
            class="d-block white--text section-btn"
            :color="btnActv('ED') ? 'grey darken-1' : 'grey darken-3'">
            Електронні декларації&nbsp;-&nbsp;[<span :style="`color: ${eDeclarationList.length > 0 ? '#e57373;' : ''}`">{{ eDeclarationList.length }}</span>]
            <v-icon 
              :class="btnActv('ED') ? 'active' : ''" 
              color="white">
              {{ mdiMenuDown }}
            </v-icon>
          </v-btn>
          <v-scroll-x-transition hide-on-leave>
            <v-card v-show="btnActv('ED')" class="mb-2 item-card">
              <v-card-text v-show="eDeclarationList.length">
                <v-data-table
                  :headers="EDTH"
                  :items="eDeclarationList"
                  :items-per-page="10" 
                  dense>
                  <template #item.action="{ item }">
                    <v-btn small @click="goToPage(item.infocard.url)">
                      <v-icon>{{ mdiTextBoxSearchOutline }}</v-icon>
                    </v-btn>
                  </template>
                </v-data-table>
              </v-card-text>
              <v-card-text v-show="!eDeclarationList.length">
                Данi для вiдображення вiдсутнi
              </v-card-text>
            </v-card>
          </v-scroll-x-transition>
          <v-btn @click="makeActive('RNBO')" 
            class="d-block white--text section-btn"
            :color="btnActv('RNBO') ? 'grey darken-1' : 'grey darken-3'">
            РНБО Санкцiї&nbsp;-&nbsp;[<span :style="`color: ${rnboList.length > 0 ? '#e57373;' : ''}`">{{ rnboList.length }}</span>]
            <v-icon 
              :class="btnActv('RNBO') ? 'active' : ''" 
              color="white">
              {{ mdiMenuDown }}
            </v-icon>
          </v-btn>
          <v-scroll-x-transition hide-on-leave>
            <v-card v-show="btnActv('RNBO')" class="mb-2 item-card">
              <v-card-text v-show="rnboVariant.length">
                <p v-for="(item, key) in rnboVariant"
                  :key="key"
                  v-html="item.text"></p>
              </v-card-text>
              <v-card-text v-show="!rnboVariant.length">
                Данi для вiдображення вiдсутнi
              </v-card-text>
            </v-card>
          </v-scroll-x-transition>
          <v-btn @click="makeActive('UNSanc')" 
            class="d-block white--text section-btn"
            :color="btnActv('UNSanc') ? 'grey darken-1' : 'grey darken-3'">
            ООН Санкцiї&nbsp;-&nbsp;[<span :style="`color: ${unSanctionList.length > 0 ? '#e57373;' : ''}`">{{ unSanctionList.length }}</span>]
            <v-icon 
              :class="btnActv('UNSanc') ? 'active' : ''" 
              color="white">
              {{ mdiMenuDown }}
            </v-icon>
          </v-btn>
          <v-scroll-x-transition hide-on-leave>
            <v-card v-show="btnActv('UNSanc')" class="mb-2 item-card">
              <v-card-text v-show="unSanctionList.length">
                <v-data-table
                  color="black"
                  :headers="unSanctionTH"
                  :items="unSanctionList"
                  :expanded.sync="unSancExpanded"
                  show-expand
                  single-expand
                  item-key="fullName"
                  :items-per-page="10" 
                  dense>
                  <template #expanded-item="{ item, headers }">
                    <v-scroll-y-reverse-transition>
                      <td class="pa-0 custom-td" :colspan="headers.length" v-show="unSancExpandedW">
                        <v-data-table 
                          class="nested-table"
                          :headers="unSanctionTHNested"
                          :items="item.INDIVIDUAL_ALIAS"
                          :items-per-page="15"
                          dense>
                        </v-data-table>
                      </td>
                    </v-scroll-y-reverse-transition>
                  </template>
                </v-data-table>
              </v-card-text>
              <v-card-text v-show="!unSanctionList.length">
                Данi для вiдображення вiдсутнi
              </v-card-text>
            </v-card>
          </v-scroll-x-transition>
          <v-btn @click="makeActive('UNTerror')" 
            class="d-block white--text section-btn"
            :color="btnActv('UNTerror') ? 'grey darken-1' : 'grey darken-3'">
            ООН. Перелiк терористiв&nbsp;-&nbsp;[<span :style="`color: ${unTerrorList.length > 0 ? '#e57373;' : ''}`">{{ unTerrorList.length }}</span>]
            <v-icon 
              :class="btnActv('UNTerror') ? 'active' : ''" 
              color="white">
              {{ mdiMenuDown }}
              </v-icon>
          </v-btn>
          <v-scroll-x-transition hide-on-leave>
            <v-card v-show="btnActv('UNTerror')" class="mb-2 item-card">
              <v-card-text v-show="unTerrorList.length">
                <v-data-table
                  color="black"
                  :headers="unTerrorTH"
                  :items="unTerrorList"
                  :expanded.sync="unTerrorExpanded"
                  show-expand
                  single-expand
                  item-key="initials"
                  :items-per-page="10" 
                  dense>
                  <template #expanded-item="{ item, headers }">
                    <v-scroll-y-reverse-transition>
                      <td class="pa-0 custom-td" :colspan="headers.length" v-show="unTerrorExpandedW">
                        <v-simple-table  dense v-if="item.alsoKnown.length">
                          <template #default>
                            <thead>
                              <tr>
                                <th class="text-left black--text">
                                  Також вiдомий як:
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr
                                v-for="(i, k) in item.alsoKnown"
                                :key="k">
                                <td class="d-sm-table-cell">{{ k + 1 + ". " + i }}</td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </td>
                    </v-scroll-y-reverse-transition>
                  </template>
                </v-data-table>
              </v-card-text>
              <v-card-text v-show="!unTerrorList.length">
                Данi для вiдображення вiдсутнi
              </v-card-text>
            </v-card>
          </v-scroll-x-transition>
          <v-btn @click="makeActive('EUSanc')" 
            class="d-block white--text section-btn"
            :color="btnActv('EUSanc') ? 'grey darken-1' : 'grey darken-3'">
            ЄС(Європейський союз) Санкцiї&nbsp;-&nbsp;[<span :style="`color: ${esSanctionList.length > 0 ? '#e57373;' : ''}`">{{esSanctionList.length}}</span>]
            <v-icon
              :class="btnActv('EUSanc') ? 'active' : ''" 
              color="white">{{ mdiMenuDown }}</v-icon>
          </v-btn>
          <v-scroll-x-transition hide-on-leave>
            <v-card v-show="btnActv('EUSanc')" class="mb-2 item-card">
              <v-card-text v-show="esVariant.length > 0">
                <p v-for="(item, key) in esVariant"
                  :key="key"
                  v-html="key + 1 + '. ' + item.text"></p>
              </v-card-text>
              <v-card-text v-show="!esVariant.length">
                Данi для вiдображення вiдсутнi
              </v-card-text>
            </v-card>
          </v-scroll-x-transition>
          <v-btn @click="makeActive('USSanc')" 
            class="d-block white--text section-btn"
            :color="btnActv('USSanc') ? 'grey darken-1' : 'grey darken-3'">
            Санкцiйний перелiк осiб (Юр./фiз.) США&nbsp;-&nbsp;[<span :style="`color: ${usSanctionList.length > 0 ? '#e57373;' : ''}`">{{ usSanctionList.length }}</span>]
            <v-icon :class="btnActv('USSanc') ? 'active' : ''" 
              color="white">{{ mdiMenuDown }}</v-icon>
          </v-btn>
          <v-scroll-x-transition hide-on-leave>
            <v-card v-show="btnActv('USSanc')" class="mb-2 item-card">
              <v-card-text v-show="usSanctionList.length">
                <v-data-table
                  color="black"
                  :headers="usSanctionTH"
                  :items="usSanctionList"
                  :expanded.sync="usSanctionExpanded"
                  show-expand
                  single-expand
                  item-key="_id"
                  :items-per-page="10" 
                  dense>
                  <template #expanded-item="{ item, headers }">
                    <v-scroll-y-reverse-transition>
                      <td class="pa-0 custom-td" :colspan="headers.length" v-show="usSanctionExpandedW">
                        <v-simple-table 
                          v-if="item.akaList.length"
                          class="half-table" 
                          dense 
                          mobile-breakpoint="600" >
                          <template #default>
                            <thead>
                              <tr>
                                <th class="text-left black--text">
                                  Також вiдомий як:
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr
                                v-for="(i, k) in item.akaList"
                                :key="k">
                                <td class="d-sm-table-cell">{{ k + 1 + ". " + i.initials }}</td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                        <div class="half-table">
                          <v-simple-table 
                            v-if="item.dateOfBirthList.length"
                            dense 
                            mobile-breakpoint="600">
                            <template #default>
                              <thead>
                                <tr>
                                  <th class="text-left black--text">
                                    Дата народження
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr
                                  v-for="(i, k) in item.dateOfBirthList"
                                  :key="k">
                                  <td class="d-sm-table-cell">{{ i.dateOfBirth }}</td>
                                </tr>
                              </tbody>
                            </template>
                          </v-simple-table>
                          <v-simple-table 
                            v-if="item.placeOfBirthList.length" 
                            dense 
                            mobile-breakpoint="600">
                            <template #default>
                              <thead>
                                <tr>
                                  <th class="text-left black--text">
                                    Мicце народження
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr
                                  v-for="(i, k) in item.placeOfBirthList"
                                  :key="k">
                                  <td class="d-sm-table-cell">{{ i.placeOfBirth }}</td>
                                </tr>
                              </tbody>
                            </template>
                          </v-simple-table>
                        </div>
                      </td>
                    </v-scroll-y-reverse-transition>
                  </template>
                </v-data-table>
              </v-card-text>
              <v-card-text v-show="!usSanctionList.length">
                Данi для вiдображення вiдсутнi
              </v-card-text>
            </v-card>
          </v-scroll-x-transition>
        </v-card-text>
      </div>
    </v-dialog>

    <!-- form -->
    <v-col cols="12" xl="3" lg="4" md="4"  sm="6" xs="10">
      <v-card class="mt-8 ml-5 mr-5 mb-8">
        <v-col>
          <v-card-text class="pb-0">
            <div style="font-size: 1.05rem; text-align: left;">Оберiть критерiй пошуку</div>
            <v-radio-group dense single-line
              v-model="searchVariant">
              <v-radio
                :value="1"
                color="grey darken-2"
                label="Пошук за ПIБ">
              </v-radio>
              <v-radio
                :value="2"
                color="grey darken-2"
                label="Пошук за ЕДРПОУ">
              </v-radio>
            </v-radio-group>
            <a 
              :href="pageUrl"
              ref="targetLink"
              style="display: none;"
              target="_blank">
            </a>
            <v-fade-transition hide-on-leave>
              <div v-show="searchVariant === 1">
                <v-text-field
                  @input="clearData()"
                  v-model="lastName"
                  label="Прiзвище"
                  color="black">
                </v-text-field>
                <v-text-field
                  @input="clearData()"
                  v-model="firstName"
                  label="Iм`я"
                  color="black">
                </v-text-field>
                <v-text-field
                  @input="clearData()"
                  v-model="patronymic"
                  label="По батьковi"
                  color="black">
                </v-text-field>
              </div>
            </v-fade-transition>
            <v-fade-transition hide-on-leave>
              <div v-show="searchVariant === 2">
                <v-text-field
                  @input="clearData()"
                  v-model="edrpou"
                  :label="'ЄДРПОУ'"
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
                @click="mapResult()"
                color="grey darken-3"
                class="white--text"
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
  </v-row>
</template>

<script>
  import { 
      mdiClose, 
      mdiAccountSearch,
      mdiMenuDown,
      mdiInformation,
      mdiAxisZRotateClockwise,
      mdiWindowMinimize,
      mdiTextBoxSearchOutline
    } from '@mdi/js'

  import { letters } from '@/utils/utils'

  export default {
    name: 'DeclarationForm',
    data: () => ({
      controller: new AbortController(),
      // https:***//pacific-dawn-21711.herokuapp.com
      // http:***//localhost:8000
      edrByInitials: {
        text: 'Публiчнi особи (Фiз)', 
        desc: 'edrByInitials',
        url: 'https://pacific-dawn-21711.herokuapp.com/get-edr-persons'
      },
      edrByEdrpou: {
        text: 'Публiчнi особи (Фiз)', 
        desc: 'edrByEdrpou',
        url: 'https://pacific-dawn-21711.herokuapp.com/get-edr-legal'
      },
      pepByInitials: {
        text: 'Публiчнi особи (Фiз)', 
        desc: 'pepByInitials',
        url: 'https://pacific-dawn-21711.herokuapp.com/get-public-person'
      },
      pepByEdrpou: {
        text: 'Публiчнi особи за ЄДРПОУ (Фiз)',
        desc: 'pepByEdrpou',
        url: 'https://pacific-dawn-21711.herokuapp.com/get-related-persons'
      },
      eDeclarations: { 
        text: 'E-декларації (Фiз)', 
        desc: 'eDeclarations',
        url: 'https://pacific-dawn-21711.herokuapp.com/get-declarations'
      },
      rnboLegals: {
        text: 'Санкцiї до юридичних осiб (Юр)', 
        desc: 'rnboLegals',
        url: 'https://pacific-dawn-21711.herokuapp.com/get-legal-sanctions'
      },
      rnboPersons: {
        text: 'Санкцiї до фiзичних осiб (Фiз)', 
        desc: 'rnboList',
        url: 'https://pacific-dawn-21711.herokuapp.com/get-person-sanctions'
      },
      unSanctions: {
        text: 'Cанкцiйний перелiк ООН (Фiз. особи)',
        desc: 'unSanctions',
        url: 'https://pacific-dawn-21711.herokuapp.com/un-person-sanctions'
      },
      unTerrors: {
        text: 'База терористiв (Фiз. особи)',
        desc: 'unTerrors',
        url: 'https://pacific-dawn-21711.herokuapp.com/un-person-terror'   
      },
      usPersonSunctions: {
        text: 'USA individual Sunction list',
        desc: 'USSancions',
        url: 'https://pacific-dawn-21711.herokuapp.com/get-us-person-sanctions/'
      },
      esPersonSunctions: { 
        text: 'Europe individual Sunction list',
        desc: 'EUSunctions',
        url: 'https://pacific-dawn-21711.herokuapp.com/get-eu-person-sanctions/'
      },
      esLegalSunctions: {
        text: 'Europe entity Sunction list',
        desc: 'EUSunctions',
        url: 'https://pacific-dawn-21711.herokuapp.com/get-eu-legal-sanctions/'
      },

      EDRTH: [
        { text: 'Назва', value: 'name', align: 'start', sortable: false},
        { text: 'Керiвник', value: 'boss', align: 'center', sortable: false },
        { text: 'Статус', value: 'condition', align: 'center', sortable: false },
        { text: 'ЄДРПОУ', value: 'edrpou', align: 'center', sortable: false },
      ],

      EDTH: [
        { text: 'Прiзвище', value: 'infocard.last_name', align: 'start', sortable: false},
        { text: 'Iм`я', value: 'infocard.first_name', align: 'center', sortable: false },
        { text: 'По батьковi', value: 'infocard.patronymic', align: 'center', sortable: false },
        { text: 'Посада', value: 'infocard.position', align: 'center', sortable: false },
        { text: 'Рiк', value: 'infocard.declaration_year', align: 'center', sortable: false},
        { text: 'Тип', value: 'infocard.document_type', align: 'center', sortable: false },
        { text: "Детально", value: 'action', align: 'center', sortable: false}
      ],

      PEPTH: [
        { text: 'ПIБ', value: 'full_name', align: 'start', sortable: false },
        { text: 'Дата нар-ння', value: 'date_of_birth', align: 'center', sortable: false},
        { text: 'Посада', value: 'last_job_title', align: 'center', sortable: false },
        { text: 'Оф. тип.', value: 'type_of_official', align: 'center', sortable: false },
        { text: "Детально", value: 'action', align: 'center', sortable: false}
      ],
      pepNestedLegal: [
        { text: "Юр. особа", value: 'to_company_uk', align: 'start', sortable: false},
        { text: "Тип зв`язку", value: 'relationship_type_uk', align: 'start', sortable: false},
        { text: "ЄДРПОУ", value: 'to_company_edrpou', align: 'start', sortable: false},
      ],
      pepNestedPerson: [
        { text: "ПIБ", value: 'person_uk', align: 'start', sortable: false},
        { text: "Тип зв`язку", value: 'relationship_type', align: 'start', sortable: false},
      ],

      unSanctionTH: [
        { text: 'ПIБ', value: 'fullName', align: 'start', sortable: false},
        { text: 'Нацiональнiсть', value: 'nationality', align: 'center', sortable: false },
        { text: 'Д.Н.', value: 'dateOfBirth', align: 'center', sortable: false },
        { text: 'Посада', value: 'designation', align: 'center', sortable: false },
      ],
      unSanctionTHNested: [
        { text: 'Також вiдомий як', value: 'ALIAS_NAME', align: 'start', sortable: false},
      ],

      unTerrorTH: [
        { text: 'ПIБ', value: 'initials', align: 'start', sortable: false},
        { text: 'Мiсце народження', value: 'place-of-birth-list', align: 'center', sortable: false },
        { text: 'Мiсце проживання', value: 'address-list.address', align: 'center', sortable: false },
        { text: 'Дата народження', value: 'date-of-birth-list', align: 'center', sortable: false },
      ],

      usSanctionTH: [
        { text: 'ПIБ', value: 'initials', align: 'start', sortable: false},
        { text: 'Дiяльнiсть', value: 'title', align: 'center', sortable: false },
      ],
      usSanctionNested: [
        { text: 'Також вiдомий як', value: 'ALIAS_NAME', align: 'start', sortable: false},
      ],

      letters: letters,
      currSection: null,
      ukVersion: true,
      showRequisite: false,

      edrExpanded: [],
      pepExpanded: [],
      unSancExpanded: [],
      unTerrorExpanded: [],
      usSanctionExpanded: [],
      edrExpandedW: false,
      pepExpandedW: false,
      unSancExpandedW: false,
      unTerrorExpandedW: false,
      usSanctionExpandedW: false,

      
      edrList: [],
      pepList: [],
      eDeclarationList: [],
      rnboList: [],
      unSanctionList: [],
      unTerrorList: [],
      esSanctionList: [],
      usSanctionList: [],

      edrInitials: [],

      lastName: null,
      firstName: null,
      patronymic: null,
      edrpou: null,

      /* Data */
      pageUrl: null,
      searchVariant: null,

      /* Booleans */
      loading: false,
      dialog: false,

      /* Icons */
      mdiClose,
      mdiAccountSearch,
      mdiMenuDown,
      mdiInformation,
      mdiAxisZRotateClockwise,
      mdiWindowMinimize,
      mdiTextBoxSearchOutline
    }),


    methods: {
      viewDetail(item) {
        console.log(item)
      },
      makeActive(e) {
        if(e === this.currSection) this.currSection = null 
        else this.currSection = e
      },
      btnActv(name) {
        return this.currSection === name
      },
      async checkEntity() {
        return Promise.all(this.objectUrlsController.map(async reqObj => {
            let obj = await this.startRequest(
              reqObj.url,
              this.reqOption(this.objectController(reqObj.desc), 'POST'),
              /* If you provide callback you should always retun res object or modified res object */
              res => reqObj.desc !== 'eDeclarations' 
                ? res 
                : reqObj.desc === 'eDeclarations' 
                  && res?.results?.object_list.length ? res.results.object_list : []
            )
            // console.log({[reqObj.desc]:obj})
            let prop = reqObj.desc
            return Array.isArray(obj) ? [[prop], obj || []] : [[prop], [obj] || []]
          })
        )
        .then(arr => arr.filter(v =>  v[1].length))
        .then(arr => Object.fromEntries(arr))
      },


      async getInitials() {
        return await this.startRequest(
          this.requestController.edrUrl,
          this.reqOption(this.objectController(), 'POST'),
          res => {
            this.clearData()
            return res
          }
        ).then(res => {
          let arr = Array.isArray(res) ? res : [res]
          return {
            edrList: this.filterEdrPerson(arr),
            edrInitials: this.choosedPerson 
              ? this.initialArr.edrInitials 
              : this.uniqArr(res)
          }
        })
      },

      filterEdrPerson(arr) {
        console.log({FILTEREDPERSON: arr})
        return arr
      },

      uniqArr(res) {
        if(!res || !res.length) return []
        res = res[0]
        return [
          ...new Set(res.beneficialOwners.concat(res.founders, [res.boss]))
        ]
        
      },

      async mapResult() {
        this.loading = true
        this.clearData()
        
        try {
          let {edrList = [], edrInitials = []} = await this.getInitials()
          let {eDeclarations = [], 
            rnboList = [], 
            unSanctions = [], 
            unTerrors = [],
            USSancions = [], 
            EUSunctions = []} = await this.checkEntity()
          this.edrInitials = edrInitials
          this.edrList = edrList
          let pepList = await this.getPepList()

          this.pepList.push(...pepList)
          this.eDeclarationList.push(...eDeclarations)
          this.rnboList.push(...rnboList)
          this.unSanctionList.push(...unSanctions)
          this.unTerrorList.push(...unTerrors)
          this.esSanctionList.push(...EUSunctions)
          this.usSanctionList.push(...USSancions)

          this.consoleObjects // console result
          this.dialog = true
          this.loading = false

        } catch(err) {
          this.loading = false
          this.notify(this.err(err))
        }
      },

      getPepList() {
        this.choosedLegal 
          ? Promise.all(this.getPersonFromLegal())
            .then(arr => Object.fromEntries(arr))
            .then(arr => {
              this.eDeclarationList.push(...arr.eDeclarations)
              this.rnboList.push(...arr.rnboList)
              this.unSanctionList.push(...arr.unSanctions)
              this.unTerrorList.push(...arr.unTerrors)
              this.esSanctionList.push(...arr.USSancions)
              this.usSanctionList.push(...arr.EUSunctions)
            })
          : false

        return Promise.all(this.edrInitials.map(this.postInitials))
          .then(obj => this.objectFilter(obj))
      },


      getPersonFromLegal() {
        return this.personUrls.map(async obj => {
          let urlRes = await Promise.all(this.edrInitials.map(initial => {
            let cpzList = [
              "unSanctions",
              "unTerrors",
              "USSancions",
              "EUSunctions"
            ]
            let [
              lastName = '', 
              firstName = '', 
              patronymic = ''
            ] = this.formatInitials(initial)

            // in case if parsed initials is not correct abort req
            if(lastName.length  < 2 || firstName.length  < 2) return Promise.resolve([])

            let ch = cpzList.includes(obj.desc)

            return this.startRequest(
              obj.url,
              this.reqOption({
                lastName: ch ? this.transliterate(lastName) : this.capitalize(lastName),
                firstName: ch ? this.transliterate(firstName) : this.capitalize(firstName),
                patronymic: ch ? this.transliterate(patronymic) : this.capitalize(patronymic)
              }, 'POST'),
              res => obj.desc !== 'eDeclarations' 
                ? res 
                : obj.desc === 'eDeclarations' 
                  && res?.results?.object_list.length ? res.results.object_list : []
            )
          }))
          return [[obj.desc], [].concat(...urlRes)]
        })
      },

      objectFilter(obj) {
        return obj.filter(k => k instanceof Object)
      },

      formatInitials(initials) {
        let person = this.choosedPerson
        return person 
          ? initials.replace(/\s/g, '').split('*') 
          : initials.replace(/\*/g, '').split(' ')
      },

      async postInitials(initials) {
        let [lastName = '', 
          firstName = '', 
          patronymic = ''] = this.formatInitials(initials)
        
        // in case if parsed initials is not correct abort req
        if(lastName.length < 2 || firstName.length < 2) return Promise.resolve()

        try {
          return await this.startRequest(
            this.pepByInitials.url,
            this.reqOption({
              lastName: lastName,
              firstName: firstName,
              patronymic: patronymic
            }, 'POST'),
          ).then(v => v[0])
        } catch(err) {
          this.notify(this.err(err))
        }
      },

      initRequest(url, obj) {
        return fetch(url, obj)
      },

      resHandler(url, obj) {
        return this.initRequest(url, obj)
          .then(res => {
            if(res.ok) {
              return res.json()
            } else {
              // this.controller.abort()
              this.notify(this.err(res))
              throw new Error('Network response was not ok')
            }
          })
      },

      err(res) {
        console.log(res)
        if(res && res.status) return  (res.status, res.statusText)
        else return res
      },

      resController(url, obj, callback) {
        return this.resHandler(url, obj)
          .then(res => {
            if(typeof callback === 'function') return callback(res)
            else return res
          })
      },

      startRequest(url, obj, resCallback) {
        return this.resController(url, obj, resCallback)
          .catch(err => {
            this.loading = false
            this.notify(this.err(err))
          })
      },

      reqOption(obj, method) {
        return {
          method: method,
          headers: {
            "Content-Type": "application/json"
          },
          mode: 'cors',
          body: JSON.stringify(obj),
          signal: this.controller.signal
        }
      },

      objectController(desc) {
        let obj
        let person = this.choosedPerson
        let legal = this.choosedLegal
        let translite = (
          person && desc === "unSanctions" ||
          person && desc === "unTerrors" ||
          person && desc === "USSancions" ||
          person && desc === "EUSunctions"
        )
        let noTraslite = person && !translite
        
        if (noTraslite) obj = {
          firstName: this.capitalize(this.firstName),
          lastName: this.capitalize(this.lastName),
          patronymic: (this.patronymic ? this.capitalize(this.patronymic) : '')
        } 

        else if (translite) obj = {
          firstName: this.transliterate(this.firstName),
          lastName: this.transliterate(this.lastName),
          patronymic: (this.patronymic ? this.transliterate(this.patronymic) : '')
        }

        else if (legal) obj = { 
          edrpou: this.edrpou 
        }
        return obj
      },

      capitalize(str) {
        str = str
          .trim()
          .replace(/\s+/g, ' ')
          .split(' ')
        return str.map(text => {
          return (text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()).trim()
        }).join(' ')
      },

      transliterate(str) {
        if(!str) return
        let fI = {"Є": "IE", "Ї": "I", "Й": "I", "Ю": "IU", "Я": "IA"}
        str = str.toUpperCase().split("")
        str.forEach((v, i) => {
          if(Object.keys(fI).includes(v) && i !== 0) str.splice(i, 1, fI[v])
        })
        return str.join("")
          .trim()
          .replace(/\s+/g, ' ')
          .split('')
          .map(char => { 
            return this.letters[char] || char
          }).join("")
          .replace(/[^a-zA-Z-`\s]/gu, '')
      },
      
      notify(title, text) {
        this.$snotify.simple(text, title, {
          timeout: 2000,
          showProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true
        })
      },

      /* Data clearing */
      clearData() {
        this.pepList.length = 0
        this.eDeclarationList.length = 0
        this.rnboList.length = 0
        this.unSanctionList.length = 0
        this.unTerrorList.length = 0
        this.esSanctionList.length = 0
        this.usSanctionList.length = 0
      },


      /* Action handlers */
      goToPage(url) {
        if(!url) return
        this.pageUrl = url
        setTimeout(() => {
          this.$refs.targetLink.click()
          this.pageUrl = null
          }, 0)
      },

      /* Controllers */
      markText(handler, text) {
        let range

        switch(handler) {
          case 'legalHandler': range = [
              text.indexOf(this.edrpou), 
              text.indexOf(this.edrpou) + this.edrpou.length
            ]
            break;
          case 'personHandler': range = [
              text.indexOf(this.lastName), 
              this.patronymic 
                ? text.indexOf(this.patronymic) + this.patronymic.length
                : text.indexOf(this.firstName) + this.firstName.length 
            ]
            break;
          case 'unLegalHandler': range = [
              text.indexOf(this.edrpou), 
              text.indexOf(this.edrpou) + this.edrpou.length
            ]
            break;
          case 'unPersonHandler': range = [
              text.indexOf(this.transliterate(this.firstName)), 
              this.patronymic 
                ? text.indexOf(this.transliterate(this.patronymic)) + this.patronymic.length
                : text.indexOf(this.transliterate(this.lastName)) + this.lastName.length 
            ]
            break;
        }
        return range
      },

      markSearchedText(val, handler) {
        let copy = JSON.parse(JSON.stringify(val))
        let arr = []
        return copy.map(v => {
          let text = v.text
          let [start, end] = this.markText(handler, text)

          arr.push(text.substring(0, start))
          arr.push('<span class="search-text">' + text.substring(start, end) + '</span>')
          arr.push(text.substring(end, text.length))

          v.text = arr.join('')
          return v
        })
      },
    },


    computed: {
      /* Objects */
      initialArr() {
        return  {
          edrList: [], 
          edrInitials: [
            // mark string below with * to split further in "Initials"
            this.capitalize(
              `
                ${this.lastName?.replace(/\s+/g, ' ').trim()}*
                ${this.firstName?.replace(/\s+/g, ' ').trim()}*
                ${this.patronymic ? (this.patronymic.replace(/\s+/g, ' ')).trim() : ''}
              `
            )
          ]
        }
      },
      personUrls() {
        return [
          this.eDeclarations,
          this.rnboPersons,
          this.unSanctions,
          this.unTerrors,
          this.usPersonSunctions,
          this.esPersonSunctions
        ]
      },

      legalUrls() {
        return [
          this.rnboLegals,
          this.esLegalSunctions,
        ]
      },

      objectUrlsController() {
        let obj
        if (this.choosedPerson) { obj = this.personUrls }
        else if (this.choosedLegal) { obj = this.legalUrls }
        return obj
      },

      requestController() {
        let obj
        if (this.choosedPerson) obj = {
          edrUrl: this.edrByInitials.url
        } 
        else if (this.choosedLegal) obj = { 
          edrUrl: this.edrByEdrpou.url
        }
        return obj
      },

      rnboVariant() {
        let arr
        this.choosedPerson && this.rnboList.length > 0
          ? arr = this.markSearchedText(this.rnboList, 'personHandler')
          : this.choosedLegal && this.rnboList.length > 0
            ? arr =  this.markSearchedText(this.rnboList, 'legalHandler')
            : arr = []
        return arr
      },
      esVariant() {
        let arr
        this.choosedPerson && this.esSanctionList.length > 0
          ? arr = this.markSearchedText(this.esSanctionList, 'unPersonHandler')
          : this.choosedLegal && this.esSanctionList.length > 0
            ? arr =  this.markSearchedText(this.esSanctionList, 'unLegalHandler')
            : arr = []
        return arr
      },

      requisites() {
        return this.choosedPerson 
          ? this.firstName && this.lastName
          : this.choosedLegal 
            ? this.edrpou
            : false
      },

      choosedPerson() {
        return this.searchVariant === 1
      },

      choosedLegal() {
        return this.searchVariant === 2
      },

      /* Styles */
      cardOverflow() {
        return `
          position: relative; overflow-x: hidden; 
          overflow-y: scroll; background: #f5f0f0`
      },

      closeAbsBtn() {
        return `
          position: absolute; top: -35px; 
          right: ${this.$vuetify.breakpoint.xs ? '-8px' : '-28px;'}`
      },

      maxCardHeight() {
        return this.$vuetify.breakpoint.height / 10 * 9
      },

      consoleObjects() {
        return (
          console.log(this.choosedLegal ? 'EDRPOU': 'INITIALS'),
          console.log({initials: this.edrInitials}),
          console.log({edr: this.edrList}),
          console.log({pep: this.pepList}),
          console.log({eDeclarations: this.eDeclarationList}),
          console.log({rnboList: this.rnboList}),
          console.log({unSanctions: this.unSanctionList}),
          console.log({unTerrorList: this.unTerrorList}),
          console.log({esSanctionList: this.esSanctionList}),
          console.log({usSanctionList: this.usSanctionList})
        )
      },
    },
    watch: {
      searchVariant(val) {
        console.log(val)
      },
      edrExpanded(val) {
        setTimeout(() => {
          if(val.length) this.edrExpandedW = true
          else this.edrExpandedW = false
        }, 0)
      },
      pepExpanded(val) {
        setTimeout(() => {
          if(val.length) this.pepExpandedW = true
          else this.pepExpandedW = false
        }, 0)
      },
      unSancExpanded(val) {
        console.log(val)
        setTimeout(() => {
          if(val.length) this.unSancExpandedW = true
          else this.unSancExpandedW = false
        }, 0)
      },
      unTerrorExpanded(val) {
        setTimeout(() => {
          if(val.length) this.unTerrorExpandedW = true
          else this.unTerrorExpandedW = false
        }, 0)
      },
      usSanctionExpanded(val) {
        setTimeout(() => {
          if(val.length) this.usSanctionExpandedW = true
          else this.usSanctionExpandedW = false
        }, 0)
      },
      dialog(val) {
        if(!val) {
          this.currSection = null
          this.ukVersion = true
          this.showRequisite = false
        }
      }
    }
  }
</script>

<style>

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

.v-card.card-req-info {
  position: fixed; 
  left: 15px; 
  top: 10px; 
  z-index: 1000
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
  margin: 1px 0!important;
  /* border-bottom: 2px solid black!important; */
  /* text-transform: none; */
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

tr.v-data-table__expanded.v-data-table__expanded__content {
  box-shadow: none!important;
}

::-webkit-scrollbar-track {
  border-radius: 10px;
  background-color: #F5F5F5;
}

::-webkit-scrollbar {
  width: 6px;
  height: 8px;
  background-color: #F5F5F5;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: rgba(85, 85, 85, 0.836);
}
</style>