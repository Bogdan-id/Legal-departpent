<template>
<!-- 
  ES: https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02014D0145-20201001
  RNBO: https://www.president.gov.ua/documents/822019-26290
  Australia: https://www.dfat.gov.au/international-relations/security/sanctions/consolidated-list
  Canada: https://www.international.gc.ca/world-monde/assets/office_docs/international_relations-relations_internationales/sanctions/sema-lmes.xml
  UNO: https://scsanctions.un.org/resources/xml/ru/consolidated.xml
  DSFMU: https://fiu.gov.ua/assets/userfiles/Terror/zBlackListFull.xml (unTerrorList, UNTerrorPersonSanctions, UNLegalTerrors)
  USA: https://www.treasury.gov/ofac/downloads/sdn.xml
 -->
  <v-dialog
    ref="dialog"
    v-model="innerState"
    :max-width="800"
    :max-height="600">
    <a  
      :href="pageUrl"
      ref="targetLink"
      style="display: none;"
      target="_blank">
    </a>
    <div class="check-wrapper">
      <v-tooltip
        color="grey darken-4"
        bottom>
        <template #activator="{ on }">
          <v-icon 
            @click="innerState = !innerState"
            style="position: absolute; top: 0; right: 2px; cursor: pointer;"
            v-on="on"
            size="22">
            {{ mdiCloseBox }}
          </v-icon>
        </template>
        <span>Закрити</span>
      </v-tooltip>
      <v-card-text class="pl-1 pr-1 pt-5 custom-bg modal-card" elevation="0">
        <!-- EDR -->
        <v-btn @click="makeActive('EDR')" 
          class="d-block white--text section-btn"
          :color="btnActv('EDR') ? 'grey darken-1' : 'grey darken-3'">
          Єдиний державний реєстр&nbsp;-&nbsp;[
          <span :class="{'btn-count': edrListPerson.length}">
            {{ edrListPerson.length }}
          </span>]
          <v-icon 
            :class="btnActv('EDR') ? 'active' : ''" 
            color="white">
            {{ mdiMenuDown }}
          </v-icon>
        </v-btn>
        <v-scroll-x-transition hide-on-leave>
          <v-card v-show="btnActv('EDR')" class="mb-2 item-card">
            <v-card-text v-if="edrListPerson.length">
              <PersonInfo :person="edrListPerson[0].data"></PersonInfo>
            </v-card-text>
            <v-card-text v-show="!edrListPerson.length">
              Данi для вiдображення вiдсутнi
            </v-card-text>
          </v-card>
        </v-scroll-x-transition>
        <!-- Yourscore - foreign sanctions -->
        <v-btn @click="makeActive('yourControlSanctionList')" 
          class="d-block white--text section-btn"
          :color="btnActv('yourControlSanctionList') ? 'grey darken-1' : 'grey darken-3'">
          Закордоннi санкцiї (your-score)&nbsp;-&nbsp;[
          <span :class="{'btn-count': yourControlSanctionList.length}">
            {{ yourControlSanctionList.length }}
          </span>]
          <v-icon 
            :class="btnActv('yourControlSanctionList') ? 'active' : ''" 
            color="white">
            {{ mdiMenuDown }}
          </v-icon>
        </v-btn>
        <v-scroll-x-transition hide-on-leave>
          <v-card v-show="btnActv('yourControlSanctionList')" class="mb-2 item-card">
            <!-- content here -->
            <v-card-text v-show="!yourControlSanctionList.length">
              Данi для вiдображення вiдсутнi
            </v-card-text>
          </v-card>
        </v-scroll-x-transition>
        <!-- Australian person sanctions [australiaSanctionList] -->
        <v-btn @click="makeActive('australiaSanctionList')" 
          class="d-block white--text section-btn"
          :color="btnActv('australiaSanctionList') ? 'grey darken-1' : 'grey darken-3'">
          Санкцiї Австралiї (терористи)&nbsp;-&nbsp;[
          <span :class="{'btn-count': validLength(australiaSanctionList).length}">
            {{ validLength(australiaSanctionList).length }}
          </span>]
          <v-icon 
            :class="btnActv('australiaSanctionList') ? 'active' : ''" 
            color="white">
            {{ mdiMenuDown }}
          </v-icon>
          <span v-show="australiaSanctionList.length" 
            class="result-header">
            {{switchHeader(australiaSanctionList, australiaSanctionList.length - 1)}}
          </span>
          <v-btn @click="$refs.austLink.click()" icon>
            <v-icon color="white" small>
              {{ mdiLinkVariant }}
            </v-icon>
            <a 
              ref="austLink" 
              target="_blank" 
              style="display: none" 
              href="https://www.dfat.gov.au/international-relations/security/sanctions/consolidated-list">
            </a>
          </v-btn>
        </v-btn>
        <v-scroll-x-transition hide-on-leave>
          <v-card v-show="btnActv('australiaSanctionList')" class="mb-2 item-card">
            <v-card-text 
              v-show="australiaSanctionList.length"
              class="person-info pt-4">
              <ul 
                class="mb-3">
                <li
                  class="entity-list"
                  style="padding-bottom: 15px;"
                  v-for="(item, key) in australiaSanctionList.filter(filterCustomMark)"
                  :key="key">
                  <span class="info-label">{{ item.fullName }}&nbsp;</span>
                  <div>
                    <div v-show="item.birthDate">
                      <span class="info-label">Дата народження:</span> 
                      &nbsp;
                      <span>
                        {{ item.birthDate }}
                      </span>
                    </div>
                    <div v-show="item.placeBirth">
                      <span class="info-label">Мicце народження:</span> 
                      &nbsp;
                      <span>{{ item.placeBirth }}</span>
                    </div>
                    <div v-show="item.citizenship">
                      <span class="info-label">Громадянство: </span> <span class="info-text">{{ item.citizenship }}</span>
                    </div>
                    <div v-show="item.additionalInfo">
                      <span class="info-label">Iнфо:</span> <span class="info-text">{{ item.additionalInfo }}</span>
                    </div>
                    <div v-show="item.address">
                      <span class="info-label">Адреса:</span> <span class="info-text">{{ item.address }}</span>
                    </div>
                    <div v-show="item.commitee">
                      <span class="info-label">Органiзацiя:</span> <span class="info-text">{{ item.commitee }}</span>
                    </div>
                    <div v-show="item.listingInfo">
                      <span class="info-label">Дата:</span> <span class="info-text">{{ item.listingInfo }}</span>
                    </div>
                  </div>
                </li>
              </ul>
            </v-card-text>
            <v-card-text v-show="!australiaSanctionList.length">
              Данi для вiдображення вiдсутнi
            </v-card-text>
          </v-card>
        </v-scroll-x-transition>
        <!-- Canadian person sanctions [canadaSanctionList] -->
        <v-btn @click="makeActive('canadaSanctionList')" 
          class="d-block white--text section-btn"
          :color="btnActv('canadaSanctionList') ? 'grey darken-1' : 'grey darken-3'">
          Санкцiї Канади &nbsp;-&nbsp;[
          <span :class="{'btn-count': validLength(canadaSanctionList).length}">
            {{ validLength(canadaSanctionList).length }}
          </span>]
          <v-icon 
            :class="btnActv('canadaSanctionList') ? 'active' : ''" 
            color="white">
            {{ mdiMenuDown }}
          </v-icon>
          <span v-show="canadaSanctionList.length" 
            class="result-header">
            {{switchHeader(canadaSanctionList, canadaSanctionList.length - 1)}}
          </span>
          <v-btn @click="$refs.canadaLink.click()" icon>
            <v-icon color="white" small>
              {{ mdiLinkVariant }}
            </v-icon>
            <a 
              ref="canadaLink" 
              target="_blank" 
              style="display: none" 
              href="https://www.international.gc.ca/world-monde/assets/office_docs/international_relations-relations_internationales/sanctions/sema-lmes.xml">
            </a>
          </v-btn>
        </v-btn>
        <v-scroll-x-transition hide-on-leave>
          <v-card v-show="btnActv('canadaSanctionList')" class="mb-2 item-card">
            <v-card-text 
              v-show="canadaSanctionList.length"
              class="person-info pt-4">
              <ul 
                class="mb-3">
                <li
                  class="entity-list"
                  style="padding-bottom: 15px;"
                  v-for="(item, key) in canadaSanctionList.filter(filterCustomMark)"
                  :key="key">
                  <span class="info-label">{{ item.fullName }}&nbsp;</span>
                  <div>
                    <div v-show="item.Country">
                      <span class="info-label">Країна:</span> 
                      &nbsp;
                      <span>
                        {{ item.Country }}
                      </span>
                    </div>
                  </div>
                </li>
              </ul>
            </v-card-text>
            <v-card-text v-show="!canadaSanctionList.length">
              Данi для вiдображення вiдсутнi
            </v-card-text>
          </v-card>
        </v-scroll-x-transition>
        <!-- Yourscore DSMFU  -->
        <v-btn @click="makeActive('yourControlDsfmuList')" 
          class="d-block white--text section-btn"
          :color="btnActv('yourControlDsfmuList') ? 'grey darken-1' : 'grey darken-3'">
          ДСМФУ - терористи (your-score)&nbsp;-&nbsp;[
          <span :class="{'btn-count': yourControlDsfmuList.length}">
            {{ yourControlDsfmuList.length }}
          </span>]
          <v-icon 
            :class="btnActv('yourControlDsfmuList') ? 'active' : ''" 
            color="white">
            {{ mdiMenuDown }}
          </v-icon>
        </v-btn>
        <v-scroll-x-transition hide-on-leave>
          <v-card v-show="btnActv('yourControlDsfmuList')" class="mb-2 item-card">
            <v-card-text 
              v-show="yourControlDsfmuList.length"
              class="person-info pt-0">
              <ul 
                class="mb-3">
                <li
                  class="entity-list"
                  style="padding-bottom: 15px;"
                  v-for="(item, key) in yourControlDsfmuList"
                  :key="key">
                  <span class="info-label">{{ item.name }}&nbsp;</span>
                  <div>
                    <div v-show="item.birthDates.length">
                      <span class="info-label">Дата народження:</span> 
                      &nbsp;
                      <span 
                        v-for="(date, key) in item.birthDates" 
                        class="info-text"
                        :key="key">
                        {{ date }}
                      </span>
                    </div>
                    <div v-show="item.birthPlaces.length">
                      <span class="info-label">Мicце народження:</span> 
                      &nbsp;
                      <span 
                        v-for="(place, key) in item.birthPlaces" 
                        class="info-text"
                        :key="key">
                        {{ place }}
                      </span>
                    </div>
                    <div v-show="item.citizenShip">
                      <span class="info-label">Громадянство: </span> <span class="info-text">{{ item.citizenShip }}</span>
                    </div>
                    <div v-show="item.nationality">
                      <span class="info-label">Нацiональнiсть: </span> <span class="info-text">{{ item.nationality }}</span>
                    </div>
                    <div v-show="item.comment">
                      <span class="info-label">Опис:</span> <span class="info-text">{{ item.comment }}</span>
                    </div>
                    <div v-show="item.source">
                      <span class="info-label">Джерело Iнформацiї:</span> <span class="info-text">{{ item.source }}</span>
                    </div>
                    <div v-show="item.names.length">
                      <span class="info-label">Також вiдомий як:</span> 
                      <ul>
                        <li 
                          v-for="(name, key) in item.names" 
                          class="info-text"
                          :key="key">
                          {{ name }}
                        </li>
                      </ul>
                    </div>
                    <div v-show="item.passports.length">
                      <span class="info-label">Паспорт:</span> 
                      &nbsp;
                      <span 
                        v-for="(doc, key) in item.passports" 
                        class="info-text"
                        :key="key">
                        {{ doc }}
                      </span>
                    </div>
                  </div>
                </li>
              </ul>
            </v-card-text>
            <v-card-text v-show="!yourControlDsfmuList.length">
              Данi для вiдображення вiдсутнi
            </v-card-text>
          </v-card>
        </v-scroll-x-transition>
        <!-- Yourscore RNBO  -->
        <v-btn @click="makeActive('yourControlRnboList')" 
          class="d-block white--text section-btn"
          :color="btnActv('yourControlRnboList') ? 'grey darken-1' : 'grey darken-3'">
          РНБО санкцiї (your-score)&nbsp;-&nbsp;[
          <span :class="{'btn-count': yourControlRnboList.length}">
            {{ yourControlRnboList.length }}
          </span>]
          <v-icon 
            :class="btnActv('yourControlRnboList') ? 'active' : ''" 
            color="white">
            {{ mdiMenuDown }}
          </v-icon>
        </v-btn>
        <v-scroll-x-transition hide-on-leave>
          <v-card v-show="btnActv('yourControlRnboList')" class="mb-2 item-card">
            <v-card-text 
              v-show="yourControlRnboList.length"
              class="person-info">
              <ul class="mb-3">
                <li
                  class="entity-list"
                  style="padding-bottom: 15px;"
                  v-for="(item, key) in yourControlRnboList"
                  :key="key">
                  <span class="info-label">{{ item.fullName }}&nbsp;</span>
                  <div>
                    <div v-show="item.sanctionsBasis">
                      <span class="info-label">Характеристика:</span> <span class="info-text">{{ item.sanctionsBasis }}</span>
                    </div>
                    <div v-show="item.restrictiveMeasure">
                      <span class="info-label">Обмеження:</span> <span class="info-text">{{ item.restrictiveMeasure }}</span>
                    </div>
                    <div v-show="item.periodOfApplication">
                      <span class="info-label">Термiн дії:</span> <span class="info-text">{{ item.periodOfApplication }}</span>
                    </div>
                    <div v-show="item.note">
                      <span class="info-label">Замiтка:</span> <span class="info-text">{{ item.note }}</span>
                    </div>
                    <div v-show="item.personCategory">
                      <span class="info-label">Категорiя:</span> <span class="info-text">{{ item.personCategory }}</span>
                    </div>
                    <div v-show="item.source">
                      <span class="info-label">Джерело Iнформацiї:</span> <span class="info-text">{{ item.source }}</span>
                    </div>
                    <div v-show="item.documentBasis">
                      <span class="info-label">Юридична постанова:</span> <span class="info-text">{{ item.documentBasis }}</span>
                    </div>
                  </div>
                </li>
              </ul>
            </v-card-text>
            <v-card-text v-show="!yourControlRnboList.length">
              Данi для вiдображення вiдсутнi
            </v-card-text>
          </v-card>
        </v-scroll-x-transition>
        <!-- Declarations -->
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
          <v-btn @click="$refs.declLink.click()" icon>
            <v-icon color="white" small>
              {{ mdiLinkVariant }}
            </v-icon>
            <a 
              ref="declLink" 
              target="_blank" 
              style="display: none" 
              href="https://declarations.com.ua/">
            </a>
          </v-btn>
        </v-btn>
        <v-scroll-x-transition hide-on-leave>
          <v-card v-show="btnActv('ED')" class="mb-2 item-card">
            <v-card-text v-show="eDeclarationList.length">
              <v-data-table
                ref="edthTable"
                :headers="EDTH"
                :items="eDeclarationList"
                :items-per-page="15" 
                :hide-default-footer="eDeclarationList && eDeclarationList.length < 15"
                dense>
                <!-- eslint-disable-next-line -->
                <template #item.action="{ item }">
                  <v-btn x-small @click="goToPage(item.infocard.url)">
                    <v-icon size="18">{{ mdiTextBoxSearchOutline }}</v-icon>
                  </v-btn>
                </template>
                <!-- eslint-disable-next-line -->
                <template #item.infocard.family="{ item }">
                  <span v-if="!item.infocard.family || !item.infocard.family.length">{{ "Нi" }}</span>
                  <v-menu
                    v-if="item.infocard.family && item.infocard.family.length"
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
                </template>
              </v-data-table>
            </v-card-text>
            <v-card-text v-show="!eDeclarationList.length">
              Данi для вiдображення вiдсутнi
            </v-card-text>
          </v-card>
        </v-scroll-x-transition>
        <!-- RNBO - sanctions -->
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
          <v-btn @click="$refs.rnboLink.click()" icon>
            <v-icon color="white" small>
              {{ mdiLinkVariant }}
            </v-icon>
            <a 
              ref="rnboLink" 
              target="_blank" 
              style="display: none" 
              href="https://www.president.gov.ua/documents/822019-26290">
            </a>
          </v-btn>
        </v-btn>
        <v-scroll-x-transition hide-on-leave>
          <v-card v-show="btnActv('RNBO')" class="mb-2 item-card">
            <v-card-text class="person-info" v-show="rnboVariant.length">
              <ul>
                <li 
                  class="entity-list"
                  style="padding-bottom: 15px;"
                  v-for="(item, key) in rnboVariant.filter(filterCustomMark)"
                  :key="key">
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
                </li>
              </ul>
            </v-card-text>
            <v-card-text v-show="!rnboVariant.length">
              Данi для вiдображення вiдсутнi
            </v-card-text>
          </v-card>
        </v-scroll-x-transition>
        <!-- UN - sanctions -->
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
          <v-btn @click="$refs.unoLink.click()" icon>
            <v-icon color="white" small>
              {{ mdiLinkVariant }}
            </v-icon>
            <a 
              ref="unoLink" 
              target="_blank" 
              style="display: none" 
              href="https://scsanctions.un.org/resources/xml/ru/consolidated.xml">
            </a>
          </v-btn>
        </v-btn>
        <v-scroll-x-transition hide-on-leave>
          <v-card v-show="btnActv('UNSanc')" class="mb-2 item-card">
            <v-card-text v-show="unSanctionList.length">
              <v-data-table
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
            </v-card-text>
            <v-card-text v-show="!unSanctionList.length">
              Данi для вiдображення вiдсутнi
            </v-card-text>
          </v-card>
        </v-scroll-x-transition>
        <!-- UN - terrorists -->
        <v-btn @click="makeActive('UNTerror')" 
          class="d-block white--text section-btn"
          :color="btnActv('UNTerror') ? 'grey darken-1' : 'grey darken-3'">
          ДСФМУ. Перелiк терористiв&nbsp;-&nbsp;[
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
          <v-btn @click="$refs.dsfmuLink.click()" icon>
            <v-icon color="white" small>
              {{ mdiLinkVariant }}
            </v-icon>
            <a 
              ref="dsfmuLink" 
              target="_blank" 
              style="display: none" 
              href="https://fiu.gov.ua/assets/userfiles/Terror/zBlackListFull.xml">
            </a>
          </v-btn>
        </v-btn>
        <v-scroll-x-transition hide-on-leave>
          <v-card v-show="btnActv('UNTerror')" class="mb-2 item-card">
            <v-card-text v-show="unTerrorList.length">
              <v-data-table
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
            </v-card-text>
            <v-card-text v-show="!unTerrorList.length">
              Данi для вiдображення вiдсутнi
            </v-card-text>
          </v-card>
        </v-scroll-x-transition>
        <!-- EU - sanctions -->
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
          <v-btn @click="$refs.esLink.click()" icon>
            <v-icon color="white" small>
              {{ mdiLinkVariant }}
            </v-icon>
            <a 
              ref="esLink" 
              target="_blank" 
              style="display: none" 
              href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02014D0145-20201001">
            </a>
          </v-btn>
        </v-btn>
        <v-scroll-x-transition hide-on-leave>
          <v-card v-show="btnActv('EUSanc')" class="mb-2 item-card">
            <v-card-text v-show="esVariant.length > 0">
              <v-card-text 
                class="person-info" 
                v-show="esVariant.length > 0">
                <ul>
                  <li 
                    class="entity-list"
                    style="padding-bottom: 15px;"
                    v-for="(item, key) in esVariant.filter(filterCustomMark)"
                    :key="key">
                    <p>
                      <span class="info-label">ПIБ: </span> <span class="info-text">{{ item.fullName }}</span>
                    </p>
                    <p>
                      <span class="info-label">Iнформацiя: </span> <span class="info-text">{{ item.information }}</span>
                    </p>
                    <p>
                      <span class="info-label">Пiдстави: </span> <span class="info-text">{{ item.reasons }}</span>
                    </p>
                    <p>
                      <span class="info-label">Дата внесення: </span> <span class="info-text">{{ item.dateListing }}</span>
                    </p>
                  </li>
                </ul>
              </v-card-text>
            </v-card-text>
            <v-card-text v-show="!esVariant.length">
              Данi для вiдображення вiдсутнi
            </v-card-text>
          </v-card>
        </v-scroll-x-transition>
        <!-- USA - sanctions -->
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
          <v-btn @click="$refs.usaLink.click()" icon>
            <v-icon color="white" small>
              {{ mdiLinkVariant }}
            </v-icon>
            <a 
              ref="usaLink" 
              target="_blank" 
              style="display: none" 
              href="https://www.treasury.gov/ofac/downloads/sdn.xml">
            </a>
          </v-btn>
        </v-btn>
        <v-scroll-x-transition hide-on-leave>
          <v-card v-show="btnActv('USSanc')" class="mb-2 item-card">
            <v-card-text v-show="usSanctionList.length">
              <v-data-table
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

<script>
import tableHeaders from './table-headers'
import { 
  mdiMenuDown, 
  mdiLinkVariant,
  mdiTextBoxSearchOutline,
  mdiClose,
  mdiCloseBox,
} from '@mdi/js' 

/* Components */
import PersonInfo from './person-info'

export default {
  components: {
    PersonInfo,
  },
  props: {
    /* Data */
    edrListPerson: { type: Array },
    eDeclarationList: { type: Array },
    rnboList: { type: Array },
    unSanctionList: { type: Array },
    unTerrorList: { type: Array },
    esSanctionList: { type: Array },
    usSanctionList: { type: Array },
    yourControlRnboList: { type: Array },
    yourControlDsfmuList: { type: Array },
    yourControlSanctionList: { type: Array },

    australiaSanctionList: { type: Array },
    canadaSanctionList: { type: Array },
    /* Dialog */
    dialog: { type: Boolean },
  },
  data: () => ({
    /* Watcher */
    edrExpanded: [],
    edrPersonExpanded: [],
    pepExpanded: [],
    unSancExpanded: [],
    unTerrorExpanded: [],
    usSanctionExpanded: [],
    currSection: null,
    pageUrl: null,
    /* Booleans */
    edrExpandedW: false,
    edrPersonExpandedW: false,
    pepExpandedW: false,
    unSancExpandedW: false,
    unTerrorExpandedW: false,
    usSanctionExpandedW: false,
    /* Table headers */
    ...tableHeaders,
    /* Icons */
    mdiMenuDown,
    mdiLinkVariant,
    mdiTextBoxSearchOutline,
    mdiClose,
    mdiCloseBox,
    /* Dialog */
    innerState: false,
  }),
  methods: {
    makeActive(section) {
      if (section === this.currSection) {
        this.currSection = null
      } else this.currSection = section
    },
    btnActv(name) {
      return this.currSection === name
    },
    goToPage(url) {
      if(!url) return
      this.pageUrl = url
      setTimeout(() => {
        this.$refs.targetLink.click()
        this.pageUrl = null
        }, 0)
    },
    switchHeader (list, index) {
      switch(list[index]) {
        case 'initials': return 'спiвпадiння за ПIБ';
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
          v => !items.includes(v)
        )
    },
    // eslint-disable-next-line
    filterCustomMark(item, index) {
      const marks = [
        'initials', 
        'lastFirstName', 
        'lastName', 
        'firstName', 
        'patronymic',
      ]
      return !marks.includes(item)
    },
    markSearchedText(val /*, handler */) {
      let copy = JSON.parse(JSON.stringify(val))
      return copy.filter(v => v._id).map(v => v)
    },
  },
  computed: {
    esVariant() {
      if (this.esSanctionList.length > 0) return this.markSearchedText(this.esSanctionList, 'unPersonHandler')
      return []
    },
    closeAbsBtn() {
      return `position: absolute; top: -35px; right: ${this.$vuetify.breakpoint.xs ? '-8px' : '-28px;'}`
    },
    rnboVariant() {
      if (this.rnboList.length > 0) return this.markSearchedText(this.rnboList, 'personHandler')
      return []
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
      this.innerState = val
      !val && (this.currSection = null)
    },
    innerState(val) {
      this.$emit('update:dialog', val)
    }
  },
}
</script>

<style>
.check-wrapper {
  position: relative; 
  max-height: 600px;
  overflow-y: auto;
  overflow-x: hidden;
}
.entity-list:first-child {
  padding-top: 0;
}
.entity-list {
  border-bottom: 1px solid gainsboro;
  padding-top: 29px;
}
</style>