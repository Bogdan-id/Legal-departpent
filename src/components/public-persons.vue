<template>
<div class="pep-table-wrapper">
  <v-simple-table class="custom-table">
    <template #default>
      <thead>
        <tr class="custom-header-row">
          <th class="custom-header">
            {{ `${item.full_name.toUpperCase()}` }}
          </th>
          <th class="black--text text-right custom-header">
            <v-tooltip bottom :open-delay="0">
              <template #activator="{ on }">
              <v-btn 
                :href="item.url" 
                v-on="on" 
                target="_blank" 
                icon dark color="#e85d56">
                <v-icon>{{ searchIcon }}</v-icon>
              </v-btn>
              </template>
              <span>Переглянути в реєстрi</span>
            </v-tooltip>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>ПУБЛIЧНА ДIЯЛЬНIСТЬ</td>
          <td>{{ item.type_of_official }}</td>
        <tr>
        <tr>
          <td>ОСТАННЄ МIСЦЕ ПРАЦI</td>
          <td class="text-left">{{ item.last_workplace }}</td>
        </tr>
        <tr>
          <td>ПОСАДА</td>
          <td class="text-left">{{ item.last_job_title }}</td>
        </tr>
        <tr>
          <td>ДАТА НАРОДЖЕННЯ</td>
          <td class="text-left">
            {{ item.date_of_birth + 'p.' }}
          </td>
        </tr>
        <tr>
          <td>МIСЦЕ ПРОЖИВАННЯ</td>
          <td class="text-left">
            {{ item.city_of_birth_uk }}
          </td>
        </tr>
        <tr>
          <td>
            ЗВ`ЯЗКИ З:
          </td>
          <td>
            <relative-btns 
              @listenPersnsBtnState="toggleRelationBtns($event)"
              :menuIcon="menuIcon"
              :btnState="rltvCompaniesBtn"
              :relvPersPresent="relativePersonsPresent"
              :relvLegalPresent="relativeLegalPresent" />
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
  <div class="pb-3">
    
    <!-- Relative tables -->
    <pep-table 
      v-if="relativeLegalPresent"
      :tableHeaders="relativeLegalHeader"
      :tableData="relativeLegals"
      :state="rltvCompaniesBtn"/>

    <pep-table
      v-if="relativePersonsPresent"
      :tableHeaders="relativePersonsHeader"
      :personHandler="true"
      :tableData="relativePersons"
      :state="rltvPrsnBtn"/>
  </div>
</div>
</template>

<script>
import RelativeBtns from './relative-btns'
import PepTable from './pep-table'


export default {
  props: [
    'item',
    'searchIcon',
    'menuIcon'
  ],


  components: {
    RelativeBtns,
    PepTable
  },


  data: () => ({
    
    /* Table headers */
    relativePersonsHeader: [
      { text: 'ФИО', value: 'person_uk', align: 'start'},
      { text: 'Публiчна особа', value: 'is_pep', align: 'center' },
      { text: 'Тип зв`язку', value: 'relationship_type', align: 'center'},
    ],

    relativeLegalHeader: [
      { text: 'Компанiя', value: 'to_company_uk', align: 'start'},
      { text: 'ЄДРПОУ', value: 'to_company_edrpou', align: 'start'},
      { text: 'Тип зв`язку', value: 'relationship_type_uk', align: 'start' },
    ],


    /* Buttons */
    rltvPrsnBtn: false,
    rltvCompaniesBtn: false,


    /* Settings */
    showOnlyRelPepPers: true,
  }),


  methods: {
    showPersonRelations() {
      this.rltvPrsnBtn = !this.rltvPrsnBtn
      this.rltvCompaniesBtn = false
      
    },

    showLegalRelations() {
      this.rltvCompaniesBtn = !this.rltvCompaniesBtn
      this.rltvPrsnBtn = false
    },

    toggleRelationBtns(obj) {
      this.rltvPrsnBtn = obj.persnsBtn
      this.rltvCompaniesBtn = obj.legalsBtn
    }
  },


  computed: {
    /* Arrays */
    relativePersons() {
      let related = this.item.related_persons

      if(!this.item && related.lenght === 0) return []

      if(this.showOnlyRelPepPers) {
        return this.item.related_persons
          .filter(v => v.is_pep === true)

      } else return this.item.related_persons
    },

    relativeLegals() {
      let related = this.item.related_companies

      if(!this.item && related.lenght === 0) return []

      return this.item.related_companies
    },



    /* Booleans */
    relativePersonsPresent() {
      return this.relativePersons.length > 0
    },

    relativeLegalPresent() {
      return this.relativeLegals.length > 0
    },


    /* Classes */
    personBtnIcon() {
      return `rltv-person-btn ${this.rltvPrsnBtn ? 'active' : ''}`
    },

    legalBtnIcon() {
      return `rltv-person-btn ${this.rltvCompaniesBtn ? 'active' : ''}`
    },


    /* Styles */
    relativeBtnStyle() {
      return `
        border-radius: 0px; border-left: 5px solid #5f6368; 
        margin: 0 auto; min-width: 130px;`
    }
  },


  mounted() {
    console.log({ITEM: this.item})
  }
}
</script>


<style scoped>
.rltv-person-btn {
  transition: transform 0.2s ease;
}

.rltv-person-btn.active {
  transform: rotate(180deg)!important;
}
</style>