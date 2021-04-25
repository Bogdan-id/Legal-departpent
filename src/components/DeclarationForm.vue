<template>
  <v-row class="api-form text-center justify-center">
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-fade-transition hide-on-leave>
          <v-btn 
            v-show="dialog && !showRequisite"
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
            v-show="!dialog && !showRule && (choosedPerson || choosedLegal)"
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
      <v-card v-show="dialog && showRequisite" class="card-req-info">
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
            Єдиний державний реєстр&nbsp;-&nbsp;[
            <span :class="{'btn-count': edrList.length}">
              {{ edrList.length || edrListPerson.length }}
            </span>]
            <v-icon 
              :class="btnActv('EDR') ? 'active' : ''" 
              color="white">{{ mdiMenuDown }}</v-icon>
          </v-btn>
          <v-scroll-x-transition hide-on-leave>
            <v-card v-show="btnActv('EDR')" class="mb-2 item-card">
              <v-card-text v-show="edrList.length || edrListPerson.length">
                <div 
                  v-if="edrList.length" 
                  class="table-title">
                  {{ 'Юридичнi особи'.toUpperCase() }}
                </div>
                <v-data-table
                  v-if="edrList.length"
                  :headers="EDRTH"
                  :items="edrList"
                  :items-per-page="15"
                  :hide-default-footer="edrList && edrList.length < 15"
                  :expanded.sync="edrExpanded"
                  show-expand
                  :single-expand="true"
                  item-key="_id"
                  dense>
                  <template #expanded-item="{ headers, item }">
                    <v-scroll-y-reverse-transition>
                      <td class="pa-0 custom-td" :colspan="headers.length" v-show="edrExpandedW">
                        <v-simple-table 
                          v-if="item.signers && item.signers.length"
                          dense>
                          <template #default>
                            <thead>
                              <tr style="background: #f5f5dc!important;">
                                <th class="text-left black--text">
                                  Пiдписант:
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="(i, k) in item.signers"
                                :key="k">
                                <td class="d-sm-table-cell">{{ k + 1 + ". " + i.description +  ": " + i.name }}</td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                        <v-simple-table
                          v-if="item.founders && item.founders.length" 
                          dense>
                          <template #default>
                            <thead>
                              <tr style="background: #f5f5dc!important;">
                                <th class="text-left black--text">
                                  Засновник:
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="(i, k) in item.founders"
                                :key="k">
                                <td class="d-sm-table-cell">{{ k + 1 + ". " + i.name }}</td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                        <v-simple-table
                          v-if="item.economicActivities" 
                          dense>
                          <template #default>
                            <thead>
                              <tr style="background: #f5f5dc!important;">
                                <th class="text-left black--text">
                                  Дiяльнiсть
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr 
                                v-for="(item, key) in item.economicActivities" 
                                :key="key">
                                <td class="d-sm-table-cell">
                                  {{ key + 1 + ". " + item.code + " - " + item.description }}
                                </td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                        <v-simple-table
                          v-if="item.address" 
                          dense>
                          <template #default>
                            <thead>
                              <tr style="background: #f5f5dc!important;">
                                <th class="text-left black--text">
                                  Адреса
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td class="d-sm-table-cell">{{ item.address }}</td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </td>
                    </v-scroll-y-reverse-transition>
                  </template>
                </v-data-table>
                <div 
                  v-if="edrListPerson.length" 
                  class="table-title">
                  {{ 'Фiзичнi особи'.toUpperCase() }}
                </div>
                <v-data-table
                  v-if="edrListPerson.length"
                  :headers="EDRTHperson"
                  :items="edrListPerson"
                  :items-per-page="15"
                  :hide-default-footer="edrListPerson && edrListPerson.length < 15"
                  :expanded.sync="edrPersonExpanded"
                  show-expand
                  :single-expand="true"
                  item-key="_id"
                  dense>
                  <template #expanded-item="{ headers, item }">
                    <v-scroll-y-reverse-transition>
                      <td class="pa-0 custom-td" :colspan="headers.length" v-show="edrPersonExpandedW">
                        <v-simple-table
                          v-if="item.activity" 
                          dense>
                          <template #default>
                            <thead>
                              <tr style="background: #f5f5dc!important;">
                                <th class="text-left black--text">
                                  Дiяльнiсть
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td class="d-sm-table-cell">{{ item.activity }}</td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                        <v-simple-table
                          v-if="item.address" 
                          dense>
                          <template #default>
                            <thead>
                              <tr style="background: #f5f5dc!important;">
                                <th class="text-left black--text">
                                  Адреса
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td class="d-sm-table-cell">{{ item.address }}</td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </td>
                    </v-scroll-y-reverse-transition>
                  </template>
                </v-data-table>

              </v-card-text>
              <v-card-text v-show="!edrList.length && !edrListPerson.length">
                Данi для вiдображення вiдсутнi
              </v-card-text>
            </v-card>
          </v-scroll-x-transition>
          <v-btn @click="makeActive('PEP')" 
            class="d-block white--text section-btn"
            :color="btnActv('PEP') ? 'grey darken-1' : 'grey darken-3'">
            Публiчнi особи&nbsp;-&nbsp;[
            <span :class="{'btn-count': pepList.length}">
              {{ pepList.length }}
            </span>]
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
                  :items-per-page="15"
                  :hide-default-footer="pepList && pepList.length < 15"
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
                          :hide-default-footer="item.related_companies && item.related_companies.length < 15"
                          dense>
                        </v-data-table>
                        <div class="font-weight-bold">Зв`язки з фiзичними особами</div>
                        <v-data-table 
                          class="nested-table"
                          :headers="pepNestedPerson"
                          :items="item.related_persons"
                          :items-per-page="15"
                          :hide-default-footer="item.related_persons && item.related_persons.length < 15"
                          dense>
                        </v-data-table>
                      </td>
                    </v-scroll-y-reverse-transition>
                  </template>
                  <!-- eslint-disable-next-line -->
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
            Електронні декларації&nbsp;-&nbsp;[
            <span :class="{'btn-count': eDeclarationList.length}">
              {{ eDeclarationList.length }}
            </span>]
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
                  :items-per-page="15" 
                  :hide-default-footer="eDeclarationList && eDeclarationList.length < 15"
                  dense>
                  <!-- eslint-disable-next-line -->
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
            РНБО Санкцiї&nbsp;-&nbsp;[
            <span :class="{'btn-count': rnboVariant.length}">
              {{ rnboVariant.length }}
            </span>]
            <v-icon 
              :class="btnActv('RNBO') ? 'active' : ''" 
              color="white">
              {{ mdiMenuDown }}
            </v-icon>
            <span v-show="rnboList.length" 
              class="result-header">
              {{switchHeader(rnboList, rnboList.length - 1)}}
            </span>
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
            ООН Санкцiї&nbsp;-&nbsp;[
            <span :class="{'btn-count': validLength(unSanctionList).length}">
              {{ validLength(unSanctionList).length }}
            </span>]
            <v-icon 
              :class="btnActv('UNSanc') ? 'active' : ''" 
              color="white">
              {{ mdiMenuDown }}
            </v-icon>
            <span v-show="unSanctionList.length" 
              class="result-header">
              {{switchHeader(unSanctionList, unSanctionList.length - 1)}}
            </span>
          </v-btn>
          <v-scroll-x-transition hide-on-leave>
            <v-card v-show="btnActv('UNSanc')" class="mb-2 item-card">
              <v-card-text v-show="unSanctionList.length">
                <v-data-table
                  v-if="choosedPerson"
                  color="black"
                  class="person-table"
                  :headers="UNOsancPerson"
                  :items="unSanctionList"
                  :expanded.sync="unSancExpanded"
                  show-expand
                  single-expand
                  item-key="fullName"
                  :items-per-page="15"
                  :hide-default-footer="unSanctionList && unSanctionList.length < 15"
                  dense>
                  <!-- eslint-disable-next-line -->
                  <template #item.designation="{ item }">
                    <span>{{ item.designation || '--' }}</span>
                  </template>
                  <template #expanded-item="{ item, headers }">
                    <v-scroll-y-reverse-transition>
                      <td class="pa-0 custom-td" :colspan="headers.length" v-show="unSancExpandedW">
                        <v-simple-table
                          v-if="item.INDIVIDUAL_ALIAS && item.INDIVIDUAL_ALIAS.length" 
                          dense>
                          <template #default>
                            <thead>
                              <tr style="background: #f5f5dc!important;">
                                <th class="text-left black--text">
                                  Також вiдомий як:
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="(i, k) in item.INDIVIDUAL_ALIAS"
                                :key="k">
                                <td class="d-sm-table-cell">{{ k + 1 + '. ' + i.ALIAS_NAME }}</td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                        <v-simple-table 
                          v-if="item.comment"
                          dense>
                          <template #default>
                            <thead>
                              <tr style="background: #f5f5dc!important;">
                                <th class="text-left black--text">
                                  Додаткова iнформацiя
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td class="d-sm-table-cell">{{ item.comment }}</td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </td>
                    </v-scroll-y-reverse-transition>
                  </template>
                </v-data-table>
                <v-data-table 
                  v-if="choosedLegal"
                  :headers="UNOsancLegal"
                  :items="unSanctionList"
                  :expanded.sync="unSancExpanded"
                  show-expand
                  single-expand
                  item-key="_id"
                  :items-per-page="15"
                  :hide-default-footer="unSanctionList && unSanctionList.length < 15"
                  dense>
                  <template #expanded-item="{ headers, item }">
                    <v-scroll-y-reverse-transition>
                      <td class="pa-0 custom-td" :colspan="headers.length" v-show="unSancExpandedW">
                        <v-simple-table
                          v-if="item.ENTITY_ADDRESS && item.ENTITY_ADDRESS.length" 
                          dense>
                          <template #default>
                            <thead>
                              <tr style="background: #f5f5dc!important;">
                                <th class="text-left black--text">
                                  Країна
                                </th>
                                <th class="text-left black--text">
                                  Провiнцiя
                                </th>
                                <th class="text-left black--text">
                                  Мiсто
                                </th>
                                <th class="text-left black--text">
                                  Вулиця
                                </th>
                                <th class="text-left black--text">
                                  Причетний до
                                </th>
                                <!-- <th class="text-left black--text">
                                  ZIP_CODE
                                </th> -->
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="(i, k) in item.ENTITY_ADDRESS"
                                :key="k">
                                <td class="d-sm-table-cell">{{ (i.COUNTRY || '--') }}</td>
                                <td class="d-sm-table-cell">{{ (i.STATE_PROVINCE || '--') }}</td>
                                <td class="d-sm-table-cell">{{ (i.CITY || '--') }}</td>
                                <td class="d-sm-table-cell">{{ (i.STREET || '--') }}</td>
                                <td class="d-sm-table-cell">{{ (i.NOTE || '--') }}</td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                        <v-simple-table 
                          v-if="item.ENTITY_ALIAS && item.ENTITY_ALIAS.length"
                          dense>
                          <template #default>
                            <thead>
                              <tr style="background: #f5f5dc!important;">
                                <th class="text-left black--text">
                                  Також вiдомий як:
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="(i, k) in item.ENTITY_ALIAS"
                                :key="k">
                                <td class="d-sm-table-cell">{{ k + 1 + ". " + i.ALIAS_NAME }}</td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                        <v-simple-table 
                          v-if="item.comment"
                          dense>
                          <template #default>
                            <thead>
                              <tr style="background: #f5f5dc!important;">
                                <th class="text-left black--text">
                                  Додаткова iнформацiя
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td class="d-sm-table-cell">{{ item.comment }}</td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
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
            ООН. Перелiк терористiв&nbsp;-&nbsp;[
            <span :class="{'btn-count': validLength(unTerrorList).length}">
              {{ validLength(unTerrorList).length }}
            </span>]
            <v-icon 
              :class="btnActv('UNTerror') ? 'active' : ''" 
              color="white">
              {{ mdiMenuDown }}
              </v-icon>
              <span v-show="unTerrorList.length" 
                class="result-header">
                {{switchHeader(unTerrorList, unTerrorList.length - 1)}}
              </span>
          </v-btn>
          <v-scroll-x-transition hide-on-leave>
            <v-card v-show="btnActv('UNTerror')" class="mb-2 item-card">
              <v-card-text v-show="unTerrorList.length">
                <v-data-table
                  v-if="choosedPerson"
                  color="black"
                  class="person-table"
                  :headers="UNOterrorPersonTH"
                  :items="unTerrorList"
                  :expanded.sync="unTerrorExpanded"
                  show-expand
                  single-expand
                  item-key="initials"
                  :items-per-page="15" 
                  :hide-default-footer="unTerrorList && unTerrorList.length < 15"
                  dense>
                  <template #expanded-item="{ item, headers }">
                    <v-scroll-y-reverse-transition>
                      <td class="pa-0 custom-td" :colspan="headers.length" v-show="unTerrorExpandedW">
                        <v-simple-table dense v-if="item && item.fullName">
                          <template #default>
                            <thead>
                              <tr style="background: #f5f5dc!important;">
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
                        <v-simple-table 
                          v-if="item.comments"
                          dense>
                          <template #default>
                            <thead>
                              <tr style="background: #f5f5dc!important;">
                                <th class="text-left black--text">
                                  Додаткова iнформацiя
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td class="d-sm-table-cell">{{ item.comments }}</td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </td>
                    </v-scroll-y-reverse-transition>
                  </template>
                </v-data-table>
                <v-data-table
                  v-if="choosedLegal"
                  color="black"
                  :headers="UNOterrorLegalTH"
                  :items="unTerrorList"
                  :expanded.sync="unTerrorExpanded"
                  show-expand
                  single-expand
                  item-key="initials"
                  :items-per-page="15" 
                  :hide-default-footer="unTerrorList && unTerrorList.length < 15"
                  dense>
                  <template #expanded-item="{ item, headers }">
                    <v-scroll-y-reverse-transition>
                      <td class="pa-0 custom-td" :colspan="headers.length" v-show="unTerrorExpandedW">
                        <v-simple-table dense v-if="item && item.fullName">
                          <template #default>
                            <thead>
                              <tr style="background: #f5f5dc!important;">
                                <th class="text-left black--text">
                                  Псевдонiм:
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
                        <v-simple-table 
                          v-if="item.comments"
                          dense>
                          <template #default>
                            <thead>
                              <tr style="background: #f5f5dc!important;">
                                <th class="text-left black--text">
                                  Додаткова iнформацiя
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td class="d-sm-table-cell">{{ item.comments }}</td>
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
            ЄС(Європейський союз) Санкцiї&nbsp;-&nbsp;[
            <span :class="{'btn-count': esVariant.length}">
              {{esVariant.length}}
            </span>]
            <v-icon
              :class="btnActv('EUSanc') ? 'active' : ''" 
              color="white">
              {{ mdiMenuDown }}
            </v-icon>
            <span v-show="esSanctionList.length" 
              class="result-header">
              {{switchHeader(esSanctionList, esSanctionList.length - 1)}}
            </span>
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
            Санкцiйний перелiк осiб (Юр./фiз.) США&nbsp;-&nbsp;[
            <span :class="{'btn-count': validLength(usSanctionList).length}">
              {{ validLength(usSanctionList).length }}
            </span>]
            <v-icon :class="btnActv('USSanc') ? 'active' : ''" 
              color="white">
              {{ mdiMenuDown }}
            </v-icon>
            <span v-show="usSanctionList.length" 
              class="result-header">
              {{switchHeader(usSanctionList, usSanctionList.length - 1)}}
            </span>
          </v-btn>
          <v-scroll-x-transition hide-on-leave>
            <v-card v-show="btnActv('USSanc')" class="mb-2 item-card">
              <v-card-text v-show="usSanctionList.length">
                <v-data-table
                  v-if="choosedPerson"
                  color="black"
                  class="person-table"
                  :headers="usSanctionPersonTH"
                  :items="usSanctionList"
                  :expanded.sync="usSanctionExpanded"
                  show-expand
                  single-expand
                  item-key="_id"
                  :items-per-page="15"
                  :hide-default-footer="usSanctionList && usSanctionList.length < 15"
                  dense>
                  <!-- eslint-disable-next-line -->
                  <template #item.title="{ item }">
                    <span>{{ item.title || '--' }}</span>
                  </template>
                  <template #expanded-item="{ item, headers }">
                    <v-scroll-y-reverse-transition>
                      <td class="pa-0 custom-td" :colspan="headers.length" v-show="usSanctionExpandedW">
                        <v-simple-table 
                          v-if="item.akaList && item.akaList.length"
                          dense 
                          mobile-breakpoint="600" >
                          <template #default>
                            <thead>
                              <tr style="background: #f5f5dc!important;">
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
                        <v-simple-table 
                          v-if="item.dateOfBirthList && item.dateOfBirthList.length"
                          dense 
                          mobile-breakpoint="600">
                          <template #default>
                            <thead>
                              <tr style="background: #f5f5dc!important;">
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
                          v-if="item.placeOfBirthList && item.placeOfBirthList.length" 
                          dense 
                          mobile-breakpoint="600">
                          <template #default>
                            <thead>
                              <tr style="background: #f5f5dc!important;">
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
                        <v-simple-table 
                          v-if="item.addressList && item.addressList.length"
                          dense>
                          <template #default>
                            <thead>
                              <tr style="background: #f5f5dc!important;">
                                <th class="text-left black--text">
                                  Країна
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="(item, k) in item.addressList"
                                :key="k">
                                <td class="d-sm-table-cell">{{ k + 1 + '. ' + item.country }}</td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </td>
                    </v-scroll-y-reverse-transition>
                  </template>
                </v-data-table>
                <v-data-table
                  v-if="choosedLegal"
                  color="black"
                  :headers="usSanctionLegalTH"
                  :items="usSanctionList"
                  :expanded.sync="usSanctionExpanded"
                  show-expand
                  single-expand
                  item-key="_id"
                  :items-per-page="15"
                  :hide-default-footer="usSanctionList && usSanctionList.length < 15"
                  dense>
                  <!-- eslint-disable-next-line -->
                  <template #item.remarks="{ item }">
                    <span>{{ item.remarks || '--' }}</span>
                  </template>
                  <template #expanded-item="{ item, headers }">
                    <v-scroll-y-reverse-transition>
                      <td class="pa-0 custom-td" :colspan="headers.length" v-show="usSanctionExpandedW">
                        <v-simple-table 
                          v-if="item.akaList && item.akaList.length"
                          dense 
                          mobile-breakpoint="600" >
                          <template #default>
                            <thead>
                              <tr style="background: #f5f5dc!important;">
                                <th class="text-left black--text">
                                  Псевдонiм:
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr
                                v-for="(i, k) in item.akaList"
                                :key="k">
                                <td class="d-sm-table-cell">{{ k + 1 + ". " + i.fullName }}</td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                        <v-simple-table 
                          v-if="item.addressList && item.addressList.length"
                          dense 
                          mobile-breakpoint="600">
                          <template #default>
                            <thead>
                              <tr style="background: #f5f5dc!important;">
                                <th class="text-left black--text">Країна</th>
                                <th class="text-left black--text">Мiсто</th>
                                <th class="text-left black--text">Пошт. iндекс</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr
                                v-for="(i, k) in item.addressList"
                                :key="k">
                                <td class="d-sm-table-cell">{{ i.country || '--'}}</td>
                                <td class="d-sm-table-cell">{{ i.city || '--' }}</td>
                                <td class="d-sm-table-cell">{{ i.postalCode || '--' }}</td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                        <v-simple-table 
                          v-if="item.placeOfBirthList && item.placeOfBirthList.length" 
                          dense 
                          mobile-breakpoint="600">
                          <template #default>
                            <thead>
                              <tr style="background: #f5f5dc!important;">
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
                <v-text-field
                  @input="clearData()"
                  v-model="companyName"
                  :label="'Назва компанiї'"
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
                @click="mapResult(/* clearData */ true, globalObject, edrpou)"
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
  mdiTextBoxSearchOutline,
  mdiSortAlphabeticalAscendingVariant
  } from '@mdi/js'
import {
  // eslint-disable-next-line
  urlGetEdrLegalByEdrpou,
  // eslint-disable-next-line
  urlGetEdrLegalByInitials,
  // eslint-disable-next-line
  urlGetEdrPersonByINN,
  } from '../urls'
/* Temporary yourcontrol request */
import { yourControlEdrByEdrpouRes, yourControlEdrByInitialsRes } from '../utils/utils'

import { letters } from '@/utils/utils'
import { transliteRule } from './translite'
import axios from 'axios'

export default {
  name: 'DeclarationForm',
  data: () => ({
    apiKey: 'b00b0000a013607c3bc0acb76917a9f022f2b908',
    baseUrl: null,
    EDRTH: [
      { text: 'Назва', value: 'name.shortName', align: 'start', sortable: false},
      // { text: 'Керiвник', value: 'boss', align: 'center', sortable: false },
      { text: 'Статус', value: 'status', align: 'center', sortable: false },
      { text: 'ЄДРПОУ', value: 'code', align: 'center', sortable: false },
    ],
    EDRTHperson: [
      { text: 'ФОП', value: 'initials', align: 'start', sortable: false},
      { text: 'Статус', value: 'condition', align: 'center', sortable: false },
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

    UNOsancPerson: [
      { text: 'ПIБ', value: 'fullName', align: 'start', sortable: false},
      { text: 'Нацiональнiсть', value: 'nationality', align: 'center', sortable: false },
      { text: 'День н-ння', value: 'dateOfBirth', align: 'center', sortable: false },
      { text: 'Посада', value: 'designation', align: 'center', sortable: false },
    ],
    UNOsancLegal: [
      { text: 'Пiдроздiл', value: 'firstName', align: 'start', sortable: false},
      { text: 'Органiзацiя', value: 'unListType', align: 'center', sortable: false },
    ],
    UNOsancPersonNested: [
      { text: 'Також вiдомий як', value: 'ALIAS_NAME', align: 'start', sortable: false},
    ],

    UNOterrorPersonTH: [
      { text: 'ПIБ', value: 'fullName', align: 'start', sortable: false},
      { text: 'Мiсце народження', value: 'place-of-birth-list', align: 'center', sortable: false },
      { text: 'Мiсце проживання', value: 'address-list.address', align: 'center', sortable: false },
      { text: 'Дата народження', value: 'date-of-birth-list', align: 'center', sortable: false },
    ],
    UNOterrorLegalTH: [
      { text: 'Назва органiзації', value: 'fullName', align: 'start', sortable: false},
      { text: 'Адреса', value: 'address-list.address', align: 'center', sortable: false },
    ],

    usSanctionPersonTH: [
      { text: 'ПIБ', value: 'initials', align: 'start', sortable: false},
      { text: 'Дiяльнiсть', value: 'title', align: 'center', sortable: false },
    ],
    usSanctionLegalTH: [
      { text: 'Назва компанiї', value: 'lastName', align: 'start', sortable: false},
      { text: 'Контакти', value: 'remarks', align: 'center', sortable: false },
    ],
    usSanctionNested: [
      { text: 'Також вiдомий як', value: 'ALIAS_NAME', align: 'start', sortable: false},
    ],
    transliteRuleTH: [
      {text: "Українська", value: "ua", sortable: false, align: "start"},
      {text: "Початок слова (EN)", value: "en", sortable: false, align: "center"},
      {text: "В iнших поз-iях (EN)", value: "position", sortable: false, align: "center"},
      {text: "Приклад UK", value: "exampleUK", sortable: false, align: "center"},
      {text: "Приклад EN", value: "exampleEN", sortable: false, align: "center"},
    ],

    letters: letters,
    currSection: null,
    ukVersion: true,
    showRequisite: false,
    showRule: false,

    edrExpanded: [],
    edrPersonExpanded: [],
    pepExpanded: [],
    unSancExpanded: [],
    unTerrorExpanded: [],
    usSanctionExpanded: [],
    edrExpandedW: false,
    edrPersonExpandedW: false,
    pepExpandedW: false,
    unSancExpandedW: false,
    unTerrorExpandedW: false,
    usSanctionExpandedW: false,

    
    edrList: [],
    edrListPerson: [],
    pepList: [],
    eDeclarationList: [],
    rnboList: [],
    unSanctionList: [],
    unTerrorList: [],
    esSanctionList: [],
    usSanctionList: [],

    edrInitials: [],
    edrLegals: [],

    lastName: null,
    firstName: null,
    patronymic: null,
    edrpou: null,
    companyName: null,

    globalObject: {},

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
    mdiTextBoxSearchOutline,
    mdiSortAlphabeticalAscendingVariant,

    edrCodes: [],
    /** @param { array } handledEdrpous - List of "edrpou" codes that have already been checked */
    handledEdrpous: [],
  }),
  methods: {
    /** @param {{companyName: string}} object */
    checkUsLegalSanctions(object) {
      const url = this.baseUrl + '/us-legal-sanctions'
      console.log('URL', url)
      return axios.post(url, object).then(res => res)
    },
    /** @param {{companyName: string}} object */
    checkUnLegalTerrors(object) {
      const url = this.baseUrl + '/un-legal-terrors'
      return axios.post(url, object).then(res => res)
    },
    /** @param {{companyName: string}} object */
    checkUnLegalSanctions(object) {
      const url = this.baseUrl + '/un-legal-sanctions'
      return axios.post(url, object).then(res => res)
    },
    /** @param {{edrpou: string|number, companyName: string}} object */
    checkEsLegalSanctions(object) { 
      const url = this.baseUrl + '/get-eu-legal-sanctions'
      return axios.post(url, object).then(res => res)
    },
    /** @param {{edrpou: string}} object */
    checkRnboLegals(object) {
      const url = this.baseUrl + '/get-legal-sanctions'
      return axios.post(url, object).then(res => res)
    },
    /** 
     * @function checkEDeclarations - Post capitalized person object
     * @param {{lastName: string, firstName: string, patronymic: string}} object */
    checkEDeclarations(object) { 
      const url = this.baseUrl + '/get-declarations'
      return axios.post(url, object).then(res => res)
    },
    /** 
     * @function checkRnboPersons - Post capitalized person object
     * @param {{lastName: string, firstName: string, patronymic: string}} object */
    checkRnboPersons(object) {
      const url = this.baseUrl + '/get-person-sanctions'
      return axios.post(url, object).then(res => res)
    },
    /** 
     * @function checkUnPersSanctions - Post transliterated person object
     * @param {{lastName: string, firstName: string, patronymic: string}} object */
    checkUnPersSanctions(object) {
      const url = this.baseUrl + '/un-person-sanctions'
      return axios.post(url, object).then(res => res)
    },
    /** 
     * @function checkUsPersonSunctions - Post transliterated person object
     * @param {{lastName: string, firstName: string, patronymic: string}} object */
    checkUsPersonSunctions(object) {
      const url = this.baseUrl + '/us-person-sanctions'
      return axios.post(url, object).then(res => res)
    },
    /** 
     * @function checkEsPersonSunctions - Post transliterated person object
     * @param {{lastName: string, firstName: string, patronymic: string}} object */
    checkEsPersonSunctions(object) {
      const url = this.baseUrl + '/get-eu-person-sanctions'
      return axios.post(url, object).then(res => res)
    },
    /** 
     * @function checkUnTerrors - Post transliterated person object
     * @param {{lastName: string, firstName: string, patronymic: string}} object */
    checkUnTerrors(object) {
      const url = this.baseUrl + '/un-person-terror'
      return axios.post(url, object).then(res => res)
    },
    /**
     * @function getEdrData
     * @param {{}} mapedObject - Object on wich nested request triggered
     * @param { string | number } code - EDRPOU code */
    getEdrData(mapedObject, code) {
      return this.getEdrLegalByEdrpou(code)
        .then(res => {
          Object.assign(mapedObject, JSON.parse(JSON.stringify(res.data)))
          const legalFounders = mapedObject?.founders.filter(founder => founder.type === 0)
          const personFounders = mapedObject?.founders.filter(founder => founder.type === 1)
          const legalEnName = mapedObject?.nameInEnglish?.shortName?.split('"')[1]
          const legalUaName = mapedObject?.name?.shortName.split('"')[1]
          const requisites = {nameEn: legalEnName, nameUa: legalUaName}

          this.checkLegal(mapedObject, requisites)

          if (legalFounders?.length) {
            legalFounders.map(founder => {
              const founderName = founder?.name?.split('"')[1]
              this.checkLegalFounder(founder, founderName)
            })
          }
          if (personFounders?.length) {
            personFounders.map(founder => {
              this.checkLegalPerson(founder, founder.name)
            })
          }
          if (mapedObject.signers?.length) {
            mapedObject.signers.map(signer => {
              this.checkLegalPerson(signer, signer.name)
            })
          }
        })
    },
    /**
     * @param { boolean } clearData - Specifies whether the method should pre-clear the data
     * @param {{}} mapedObject - Object on wich nested request triggered
     * @param { string | number } code - EDRPOU code */
    async mapResult(clearData, mapedObject, code) {
      try {
        if (code && this.handledEdrpous.includes(code)) return
        if (clearData) this.clearData()
        this.loading = true
        await this.getEdrData(mapedObject, code)
        this.dialog = true
        this.loading = false
        console.log(this.globalObject)
        return
      } catch(err) {
        this.loading = false
        console.log(err)
      }
    },
    /**
     * @param {string} person
     * @param {object} config
     * @param {boolean} [config.capitalize]
     * @param {boolean} [config.transliterate]  */
    getPersonInitials(person, config) {
      const { capitalize, transliterate } = config
      const [ lastName, firstName, patronymic ] = person.split(' ')
      
      if (!lastName || !firstName || lastName.length <= 1 || firstName.length <= 1) {
        throw new Error('Initials not valid: ' + `${lastName} ${firstName} ${patronymic}`)
      }

      let personObject = {
        firstName: firstName,
        lastName: lastName,
        patronymic: patronymic,
      }

      /** @param {function} handler */
      function modifyPerson(handler) {
        Object.keys(personObject).forEach(initial => {
          return personObject[initial] = handler(personObject[initial])
        })
        return personObject
      }

      switch (true) {
        case capitalize: return modifyPerson(this.capitalize)
        case transliterate: return modifyPerson(this.transliterate)
        default: return personObject
      }
    },
    /** @param {{mapedObject: {{}}, person: string}} */
    checkLegalPerson(mapedObject, person) {
      const capitalizedPersonObj = this.getPersonInitials(person, {capitalize: true})
      const transliteratedPersonObj = this.getPersonInitials(person, {transliterate: true})

      this.checkEDeclarations(capitalizedPersonObj)
        .then(res => Object.assign(mapedObject, {eDeclarations: res}))
        .catch(err => console.log(err))
      this.checkRnboPersons(capitalizedPersonObj)
        .then(res => Object.assign(mapedObject, {rnboSanction: res}))
        .catch(err => console.log(err))
      this.checkUnPersSanctions(transliteratedPersonObj) 
        .then(res => Object.assign(mapedObject, {UNPersonSanctions: res}))
        .catch(err => console.log(err))
      this.checkUsPersonSunctions(transliteratedPersonObj) 
        .then(res => Object.assign(mapedObject, {USPersonSanctions: res}))
        .catch(err => console.log(err))
      this.checkEsPersonSunctions(transliteratedPersonObj)
        .then(res => Object.assign(mapedObject, {ESPersonSanctions: res}))
        .catch(err => console.log(err))
      this.checkUnTerrors(transliteratedPersonObj)
        .then(res => Object.assign(mapedObject, {UNTerrorPersonSanctions: res}))
        .catch(err => console.log(err))
    },
    /**
     * @param {{}} founder
     * @param {string} founderName */
    checkLegalFounder(founder, founderName) {
      this.mapResult(false, founder, founder.code)
      this.checkEsLegalSanctions({ edrpou: founder.code, companyName: this.transliterate(founderName) })
        .then(res => Object.assign(founder, {ESLegalSanctions: res}))
        .catch(err => console.log(err))
      this.checkUsLegalSanctions({ companyName: this.transliterate(founderName) })
        .then(res => Object.assign(founder, {USLegalSanctions: res}))
        .catch(err => console.log(err))
      this.checkUnLegalTerrors({ companyName: this.transliterate(founderName) })
        .then(res => Object.assign(founder, {UNLegalTerrors: res}))
        .catch(err => console.log(err))
      this.checkUnLegalSanctions({ companyName: this.transliterate(founderName) })
        .then(res => Object.assign(founder, {UNLegalSanctions: res}))
        .catch(err => console.log(err))
      this.checkRnboLegals({ edrpou: founder.code })
        .then(res => Object.assign(founder, {RNBOLegals: res}))
        .catch(err => console.log(err))
    },
    /**
     * @param {{}} legal
     * @param {object} requisites - En/Ua
     * @param {string} requisites.nameUa
     * @param {string} requisites.nameEn */
    checkLegal(legal, requisites) {
      this.checkEsLegalSanctions({ edrpou: legal.code, companyName: requisites.nameEn })
        .then(res => Object.assign(legal, {ESLegalSanctions: res}))
        .catch(err => console.log(err))
      this.checkUsLegalSanctions({ companyName: requisites.nameEn })
        .then(res => Object.assign(legal, {USLegalSanctions: res}))
        .catch(err => console.log(err))
      this.checkUnLegalTerrors({ companyName: requisites.nameEn })
        .then(res => Object.assign(legal, {UNLegalTerrors: res}))
        .catch(err => console.log(err))
      this.checkUnLegalSanctions({ companyName: requisites.nameEn })
        .then(res => Object.assign(legal, {UNLegalSanctions: res}))
        .catch(err => console.log(err))
      this.checkRnboLegals({ edrpou: legal.code })
        .then(res => Object.assign(legal, {RNBOLegals: res}))
        .catch(err => console.log(err))
    },
    /** @param { string | number } code - edrpou code  */
    getEdrLegalByEdrpou(code) {
      /* this request should start from node.js */
      this.handledEdrpous.push(code)
      // return axios
      //   .get(this.urlGetEdrLegalByEdrpou(code, this.apiKey))
      //   .then(res => console.log(res))
      //   .catch(err => console.log(err))

      // below temporary emulation of request to yourcontrol
      let response = {}
      response.data = yourControlEdrByEdrpouRes
      response.data.requestClientDate = new Date().toString()
      console.log('yourControlEdrByEdrpouRes', response)
      return Promise.resolve(response)
    },
    getEdrLegalByInn() {
      /* this request should start from node.js */
      if (!this.choosedPerson) return Promise.resolve([])
      // return axios
      //   .get(this.urlGetEdrLegalByInitials(this.lastName, this.firstName, this.patronymic))
      //   .then(res => console.log(res))
      //   .catch(err => console.log(err))
      return Promise.resolve([yourControlEdrByInitialsRes])
    },
    switchHeader(list, index) {
      // initials lastFirstName lastName firstName patronymic
      switch(list[index]) {
        case 'initials': return 'спiвпадiння за ПIП';
        case 'lastFirstName': return 'спiвпадiння за Прiзвищем та Iм`ям';
        case 'lastName' : return 'спiвпадiння за Прiзвищем'; 
        case 'firstName': return 'спiвпадiння за Iм`ям'; 
        case 'patronymic': return 'спiвпадiння По батьковi'; 
      }
    },
    validLength(arr) {
      let items = [
        'initials',
        'lastFirstName',
        'lastName',
        'firstName',
        'patronymic'
      ]
      return arr
        .filter(
          v => items.includes(v)
        )
    },
    makeActive(e) {
      if(e === this.currSection) this.currSection = null 
      else this.currSection = e
    },
    btnActv(name) {
      return this.currSection === name
    },

    capitalize(str) {
      if(!str) return ''
      str = str.trim().replace(/\s+/g, ' ').split(' ')
      return str.map(text => {
        return (text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()).trim()
      }).join(' ')
    },

    /** @return {string} */
    transliterate(str) {
      if(!str) return
      let fI = {"Є": "IE", "Ї": "I", "Й": "I", "Ю": "IU", "Я": "IA"}
      str = str.toUpperCase().split("")
      str.forEach((v, i) => {
        if(Object.keys(fI).includes(v) && i !== 0) str.splice(i, 1, fI[v])
      })
      return str.join("")
        .replace(/зг/g, 'ZGH')
        .trim()
        .replace(/\s+/g, ' ')
        .split('')
        .map(char => { 
          return this.letters[char] || char
        }).join("")
        .replace(/[^a-zA-Z-`\s0-9().,]/gu, '')
    },

    /* Data clearing */
    clearData() {
      this.handledEdrpous.length = 0
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
      switch(handler) {
        case 'legalHandler': return [
            this.edrpou ? text.indexOf(this.edrpou) : 0, 
            this.edrpou ? text.indexOf(this.edrpou) + this.edrpou.length : 0
          ]
        case 'personHandler': return [
            text.indexOf(this.lastName), 
            this.patronymic 
              ? text.indexOf(this.patronymic) + this.patronymic.length
              : this.firstName ? text.indexOf(this.firstName) + this.firstName.length : 0 
          ]
        case 'unLegalHandler': return [
            this.edrpou ? text.indexOf(this.edrpou) : 0, 
            this.edrpou ? text.indexOf(this.edrpou) + this.edrpou.length : 0
          ]
        case 'unPersonHandler': return [
            text.indexOf(this.transliterate(this.firstName)), 
            this.patronymic 
              ? text.indexOf(this.transliterate(this.patronymic)) + this.patronymic.length
              : this.lastName ? text.indexOf(this.transliterate(this.lastName)) + this.lastName.length : 0 
          ]
      }
    },

    markSearchedText(val /*, handler */) {
      let copy = JSON.parse(JSON.stringify(val))
      
      return copy.filter(v => v._id)
        .map(v => {
          // let arr = []
          // let text = v.text
          // let [start, end] = this.markText(handler, text)

          // arr.push(text.substring(0, start))
          // arr.push('<span class="search-text">' + text.substring(start, end) + '</span>')
          // arr.push(text.substring(end, text.length))
          // v.text = arr.join('')

          return v
        })
    },

    // listenPressKey(e) {
    //   if (e.keyCode === 13) {
    //     this.mapResult(/* clearData */ true)
    //   } else if (e.keyCode === 27) {
    //     this.dialog = false
    //   }
    // },
    setBaseUrl() {
      this.baseUrl = process.env.NODE_ENV === "development" 
        ? 'http://127.0.0.1:4000' 
        : 'http://94.131.243.7:4000'
    }
  },

  computed: {
    transliteRule() { return transliteRule },
    rnboVariant() {
      if (this.choosedPerson && this.rnboList.length > 0) return this.markSearchedText(this.rnboList, 'personHandler')
      if (this.choosedLegal && this.rnboList.length > 0) return this.markSearchedText(this.rnboList, 'legalHandler')
      return []
    },
    esVariant() {
      if (this.choosedPerson && this.esSanctionList.length > 0) return this.markSearchedText(this.esSanctionList, 'unPersonHandler')
      if (this.choosedLegal && this.esSanctionList.length > 0) return this.markSearchedText(this.esSanctionList, 'unLegalHandler')
      return []
    },

    requisites() {
      return this.choosedPerson 
        ? this.firstName && this.lastName
        : this.choosedLegal 
          ? this.edrpou || this.companyName
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
  }, 
  watch: {
    edrExpanded(val) {
      setTimeout(() => {
        if(val.length) this.edrExpandedW = true
        else this.edrExpandedW = false
      }, 0)
    },
    edrPersonExpanded(val) {
      setTimeout(() => {
        if(val.length) this.edrPersonExpandedW = true
        else this.edrPersonExpandedW = false
      }, 0)
    },
    pepExpanded(val) {
      setTimeout(() => {
        if(val.length) this.pepExpandedW = true
        else this.pepExpandedW = false
      }, 0)
    },
    unSancExpanded(val) {
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
  },
  mounted() {
    window.addEventListener('keydown', this.listenPressKey)
    this.setBaseUrl()
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.listenPressKey)
  }
}
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
  width: 6px;
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
</style>