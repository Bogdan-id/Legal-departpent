<template>
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
</template>