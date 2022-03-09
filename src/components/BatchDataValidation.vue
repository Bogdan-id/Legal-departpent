<template>
<!-- Batch data validation component -->
<v-container fluid>
  <v-dialog 
    v-model="dialog"
    class="ma-12">
    <v-card 
      v-if="Object.keys(global).length"
      style="max-height: 90vh; overflow: auto; position: relative;">
      <span style="position: absolute; top: 15px; right: 15px;">
        <v-btn 
          @click="print"
          class="ma-1"
          icon
          small>
          <v-icon>{{ mdiPrinter }}</v-icon>
        </v-btn>
        <v-btn 
          @click="download"
          class="ma-1"
          icon
          small>
          <v-icon>{{ mdiDownload }}</v-icon>
        </v-btn>
      </span>
      <v-card-title style="font-size: 1.18rem;">
        Результат перевiрки за {{ new Date().toLocaleDateString('RU') }}
      </v-card-title>
      <v-card-text class="pt-4">
        <div v-if="hasRestrictives">
          <v-row v-if="choosedPerson && hasRestrictives">
            <v-col 
              v-for="(item, key) in Object.keys(global).filter(key => rnboOrTerrorPresent(key))" 
              :key="key"
              :cols="12" 
              class="pt-0 mb-4 row-border">
              <h4 class="pb-3">
                {{ setPersonViewName(global[item]) }}
              </h4>
              <div v-if="rnboOrTerrorPresent(item)">
                <div v-if="rnboPresent(item)">
                  <v-data-table
                    :headers="personRnboTHead"
                    :items="global[item].validations.rnbo.filter(v => typeof v === 'object')"
                    class="calc-table batch-result-table"
                    mobileBreakpoint="750"
                    dense
                    :items-per-page="100"
                    :hide-default-footer="true"
                    :hide-default-header="!global[item].validations.rnbo.length">
                  </v-data-table>
                </div>
                <div v-if="terrorPresent(item)">
                  <v-data-table
                    :headers="personTerrorsTHead"
                    :items="global[item].validations.terrors.filter(v => typeof v === 'object')"
                    class="calc-table batch-result-table"
                    mobileBreakpoint="750"
                    dense
                    :items-per-page="100"
                    :hide-default-footer="true"
                    :hide-default-header="!global[item].validations.terrors.length">
                    <template #item.alsoKnown="{ item }">
                      {{ item.alsoKnown.length ? item.alsoKnown.join(', ') : '' }}
                    </template>
                    <template #item.dateEntry="{ item }">
                      {{ getDate(item['date-entry']) }}
                    </template>
                  </v-data-table>
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row v-if="choosedLegal && hasRestrictives">
            <v-col 
              v-for="(item, key) in Object.keys(global).filter(key => rnboOrTerrorPresent(key))" 
              :key="key"
              :cols="12" 
              class="pt-0 mb-4 row-border">
              <h4 class="pb-3">
                {{ setLegalViewName(global[item]) }}
              </h4>
              <div 
                v-if="rnboOrTerrorPresent(item)">
                <div v-if="rnboPresent(item)">
                  <v-data-table
                    :headers="legalRnboTHead"
                    :items="global[item].validations.rnbo.filter(v => typeof v === 'object')"
                    class="calc-table batch-result-table"
                    mobileBreakpoint="750"
                    dense
                    :items-per-page="100"
                    :hide-default-footer="true"
                    :hide-default-header="!global[item].validations.rnbo.length">
                  </v-data-table>
                </div>
                <div v-if="terrorPresent(item)">
                  <v-data-table
                    :headers="legalTerrorsTHead"
                    :items="global[item].validations.terrors.filter(v => typeof v === 'object')"
                    class="calc-table batch-result-table"
                    mobileBreakpoint="750"
                    dense
                    :items-per-page="100"
                    :hide-default-footer="true"
                    :hide-default-header="!global[item].validations.terrors.length">
                    <template #item.dateEntry="{ item }">
                      {{ getDate(item['date-entry']) }}
                    </template>
                  </v-data-table>
                </div>
              </div>
            </v-col>
          </v-row>
        </div>
        <div v-if="!hasRestrictives" >
          {{ emptyMessage() }}
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-row class="d-flex justify-center">
    <v-col cols="12" xl="4" lg="5" md="6"  sm="8" xs="10">
      <v-card class="mt-8 ml-5 mr-5 mb-8">
        <router-link 
          class="navigation-link" 
          :to="'/'">
          {{ `перейти до перевірки Фіз./Юр. особи` }}
        </router-link>
        <v-card-title class="pb-0 pt-0">
          Пакетна перевiрка даних
        </v-card-title>
        <v-card-text class="pb-0">
          <v-radio-group 
            @change="global = {}"
            dense 
            column
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
            <div 
              v-if="choosedPerson"
              class="person-fields-wrapper">
              <v-textarea
                v-model="personStr"
                label="Вкажiть значення"
                placeholder="ФИО:IНН"
                :rows="10"
                color="grey darken-3"
                outlined>
              </v-textarea>
            </div>
          </v-fade-transition>
          <v-fade-transition hide-on-leave>
            <div 
              v-if="choosedLegal"
              class="legal-fields-wrapper">
              <v-textarea
                v-model="legalStr"
                label="Вкажiть значення"
                placeholder="Назва компанii:ЕДРПОУ"
                :rows="10"
                color="grey darken-3"
                outlined>
              </v-textarea>
            </div>
          </v-fade-transition>
        </v-card-text>
        <v-card-actions class="d-flex justify-center pb-4">
          <v-btn 
            v-show="searchVariant"
            @click="submit"
            class="white--text"
            color="grey darken-3"
            small
            :loading="loading"
            :disabled="!searchVariant || (!personStr && !legalStr)">
            Отримати данi
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</v-container>
</template>
<script>
import { transliterate, emptyMessage, setPersonViewName, setLegalViewName, getDate } from '../utils/utils'
import { mdiPrinter, mdiDownload } from '@mdi/js' 
import { download as dwn, print as prnt } from './Pdf-make'
export default {
  data: () => ({
    baseURL: null,
    searchVariant: null,
    personStr: null,
    legalStr: null,
    global: {},
    loading: false,
    dialog: false,
    personTerrorsTHead: [
      { text: 'ПIБ', value: 'fullName', align: 'start', sortable: false }, 
      { text: 'Також вiдомий як', value: 'alsoKnown', align: 'center', sortable: false },
      { text: 'Додаткова iнформацiя', value: 'comments', align: 'center', sortable: false },
      { text: 'Документ', value: 'program-entry', align: 'center', sortable: false },
      { text: 'Нацiональнiсть', value: 'nationality-list', align: 'center', sortable: false },
      { text: 'Дата внесення', value: 'dateEntry', align: 'center', sortable: false }, // date-entry: 20180316 split to yyyy.mm.dd
    ],
    personRnboTHead: [
      { text: 'ПIБ', value: 'name_ukr', align: 'start', sortable: false }, 
      { text: 'Обмеження', value: 'restriction_type', align: 'center', sortable: false },
      { text: 'Термiн дiї', value: 'restriction_period', align: 'center', sortable: false },
      { text: 'Дата завершення дії обмежень', value: 'restriction_end_date', align: 'center', sortable: false }, 
      { text: 'Номер указу', value: 'ukaz_id', align: 'center', sortable: false },
      { text: 'Дата указу', value: 'ukaz_date', align: 'end', sortable: false },
      { text: 'Додаткова iнформацiя', value: 'additional', align: 'center', sortable: false },
    ],
    // date-entry: 20180316 split to yyyy.mm.dd
    legalTerrorsTHead: [ 
      { text: 'Органiзацiя', value: 'fullName', align: 'start', sortable: false }, 
      { text: 'Вiдомi назви', value: 'alsoKnown', align: 'center', sortable: false },
      { text: 'Додаткова iнформацiя', value: 'comments', align: 'center', sortable: false },
      { text: 'Документ', value: 'program-entry', align: 'center', sortable: false },
      { text: 'Дата внесення', value: 'dateEntry', align: 'center', sortable: false },
    ],
    legalRnboTHead: [
      { text: 'Органiзацiя', value: 'name_ukr', align: 'start', sortable: false }, 
      { text: 'Обмеження', value: 'restriction_type', align: 'center', sortable: false },
      { text: 'Термiн дiї', value: 'restriction_period', align: 'center', sortable: false },
      { text: 'Дата завершення дії обмежень', value: 'restriction_end_date', align: 'center', sortable: false }, 
      { text: 'Номер указу', value: 'ukaz_id', align: 'center', sortable: false },
      { text: 'Дата указу', value: 'ukaz_date', align: 'end', sortable: false },
    ],
    mdiPrinter, 
    mdiDownload,
  }),
  computed: {
    choosedPerson() {
      return this.searchVariant === 1
    },
    choosedLegal() {
      return this.searchVariant === 2
    },
    entity() {
      return this.choosedPerson ? 'person' : this.choosedLegal ? 'legal' : ''
    },
    hasRestrictives() {
      const keys = Object.keys(this.global)
      if (!keys.length) return
      let count = 0
      keys.forEach(key => {
        if (this.global[key]?.validations?.rnbo?.length || this.global[key]?.validations?.terrors?.length) {
          count ++
        }
      })
      return count
    },
  },
  methods: {
    dwn,
    prnt,
    getDate,
    emptyMessage,
    transliterate,
    setPersonViewName, 
    setLegalViewName,
    submit() {
      this.global = {}
      this.loading = true
      this.runController()
        .then(() => {
          this.loading = false
          this.dialog = true
        })
        .catch(err => {
          this.$snotify.simple(err)
          this.loading = false
          throw err
        })
      
    },
    runController() {
      switch (this.searchVariant) {
        case 1: return this.handlePerson()
        case 2: return this.handleLegal()
      }
    },
    handleLegal() {
      const arr = this.getValues(this.legalStr)
      const legals = this.getLegals(arr)
      const legalTerrorRequests = legals
        .filter(company => company.companyName)
        .map(company => {
          let object = {...company}
          object.companyName = this.transliterate(object.companyName)
          return this.getLegalTerrors(object)
            .then(res => {
              const key = this.setCompanyName(company)
              if (!this.global[key]?.validations) {
                this.$set(this.global, key, { validations: {} })
                this.$set(this.global[key], 'company', company )
              }
              this.$set(this.global[key].validations, 'terrors', res.data )
            })
            .catch(this.handleErr)
        })

      const legalRnboRequests = legals
        .map(company => {
          return this.getLegalRNBO(company)
            .then(res => {
              const key = this.setCompanyName(company)
              if (!this.global[key]?.validations) {
                this.$set(this.global, key, { validations: {} })
                this.$set(this.global[key], 'company', company )
              }
              this.$set(this.global[key].validations, 'rnbo', res.data)
            })
        })

      return Promise.all([...legalRnboRequests, ...legalTerrorRequests])
    },
    setCompanyName(company) {
      const c = company
      let str = `${c.companyName || ''}-${c.edrpou || ''}`
      return this.transliterate(str).replace(/\s+/g, '-')
    },
    setPersonName(person) {
      const p = person
      let str = `${p.lastName || ''}-${p.firstName || ''}-${p.patronymic || ''}-${p.inn || ''}`
      return this.transliterate(str)
    },
    handlePerson() {
      const arr = this.getValues(this.personStr)
      const persons = this.getPersons(arr)
      const personTerrorRequests = persons
        .filter(v => v.firstName && v.lastName)
        .map(person => {
          const engPerson = {}
          Object.keys(person).forEach(v => {
            engPerson[v] = this.transliterate(person[v])
          })
          return this.getPersonTerrors(engPerson)
            .then(res => {
              const key = this.setPersonName(person)
              if (!this.global[key]?.validations) {
                this.$set(this.global, key, { validations: {} })
                this.$set(this.global[key], 'person', person )
              }
              this.$set(this.global[key].validations, 'terrors', res.data)
            })
        })

      const personRNBORequests = persons
        .filter(v => v.firstName && v.lastName)
        .map(person => {
          return this.getPersonRNBO(person)
            .then(res => {
              const key = this.setPersonName(person)
              if (!this.global[key]?.validations) {
                this.$set(this.global, key, { validations: {} })
                this.$set(this.global[key], 'person', person )
              }
              this.$set(this.global[key].validations, 'rnbo', res.data)
            })
        })

      return Promise.all([...personRNBORequests, ...personTerrorRequests])
    },
    getValues(str) {
      const onlyValues = v => v
      const prepareValue = (value) => {
        if (!str.includes(':')) {
          const error = new Error('[setSeparator] Вiдсутнiй роздiловий знак ":" ' + value)
          this.loading = false
          this.$snotify.simple(error)
          throw error
        }
        return value.replace(/:+/g, ':').split(':')
      }

      const values = str.split(/\n/).filter(onlyValues).map(prepareValue)
      return values
    },
    getPersons(arr) {
      const filterEmpty = v => v.inn || Object.keys(v).length >= 2
      return arr.map(v => {
        const obj = {}
        const [lastName, firstName, patronymic] = v[0].split(' ')
        const inn = v[1]
        lastName && (obj.lastName = lastName)
        firstName && (obj.firstName = firstName)
        patronymic && (obj.patronymic = patronymic)
        if (!obj.lastName || !obj.firstName) {
          const error = new Error('Прiзвище та iм`я обов`язковi для фiзичноi особи: ' + obj?.lastName + ", " + obj?.firstName)
          this.$snotify.simple(error)
          this.loading = false
          throw error
        }
        if (inn && !isNaN(+inn) && inn.length >= 10) {
          obj.inn = parseInt(inn)
        }
        return obj
      })
      .filter(filterEmpty)
    },
    getLegals(arr) {
      const filterEmpty = v => v.edrpou || v.companyName
      return arr.map(v => {
        const obj = {}
        const companyName = v[0]
        const edrpou = v[1]
        if (edrpou && !isNaN(edrpou) && edrpou.length === 8) {
          obj.edrpou = edrpou
        }
        if (companyName.length) {
          obj.companyName = companyName.toUpperCase()
        }
        return obj
      })
      .filter(filterEmpty)
    },
    getLegalTerrors(company) {
      return this.$axios
        .post(this.baseURL + 'un-legal-terrors/', company)
        .catch(this.getRejectedKey)
    },
    getLegalRNBO(company) {
      return this.$axios
        .post(this.baseURL + 'get-legal-sanctions/', company)
        .catch(this.getRejectedKey)
    },
    getPersonTerrors(person) {
      return this.$axios
        .post(this.baseURL + 'un-person-terror/', person)
        .catch(this.getRejectedKey)
    },
    getPersonRNBO(person) {
      return this.$axios
        .post(this.baseURL + 'get-person-sanctions/', person)
        .catch(this.getRejectedKey)
    },
    handleErr(err) {
      this.$snotify.simple(err)
      throw err
    },
    getRejectedKey (cancel) {
      // @ts-ignore
      if (cancel instanceof Error) throw cancel
      if (! cancel) Promise.reject(new Error ('"getRejectedKey": "cancel"/"object" parameter required '))
      if (! cancel?.message) Promise.reject(cancel)
      if (cancel?.message) {
        const key = cancel.message
        return Promise.resolve(this.$store.state[key])
      }
    },
    rnboOrTerrorPresent(key) {
      return this.global[key]?.validations?.rnbo?.length || this.global[key]?.validations?.terrors?.length
    },
    rnboPresent(key) {
      return this.global[key]?.validations?.rnbo?.length
    },
    terrorPresent(key) {
      return this.global[key]?.validations?.terrors?.length
    },
    print() {
      this.prnt(this.global, { entity: this.entity })
    },
    download() {
      this.dwn(this.global, { entity: this.entity })
    },
    setBaseUrl() {
      this.baseURL = process.env.NODE_ENV === "development" 
        ? 'http://127.0.0.1:4000/'
        : 'http://94.131.243.7:4000/'
    },
  },
  mounted() {
    this.setBaseUrl()
  }
}
</script>
<style>
.v-data-table.batch-result-table {
  font-size: 0.68rem!important;
  padding-top: 13px!important;
  color: white!important;
  background: indianred!important;
  padding: 8px 15px!important;
}
.v-data-table.batch-result-table th {
  vertical-align: initial!important;
  color: white!important;
  font-size: 0.72rem!important;
}
.v-data-table.batch-result-table td {
  font-size: 0.85rem!important;
}
.row-border {
  border-bottom: 1px solid gainsboro; 
  border-radius: 0;
}
</style>