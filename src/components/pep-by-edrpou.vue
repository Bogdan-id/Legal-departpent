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
      </tbody>
    </template>
  </v-simple-table>

  <div class="pb-3">

    <!-- Reletion buttons -->
    <v-card-actions class="justify-center flex-wrap pt-4">
      <v-btn 
        @click="showLegalRelations()"
        class="white--text mt-2 mb-2"
        :style="relativeBtnStyle"
        :color="`${rltvCompaniesBtn ? '#e85d56' : 'grey darken-3'}`"
        small>
        Зв`язки з юридичними особами&nbsp;
        <v-icon 
          :class="legalBtnIcon">
          {{ menuIcon }}
        </v-icon>
      </v-btn>
      <v-btn 
        @click="showPersonRelations()"
        class="white--text mt-2 mb-2"
        :style="relativeBtnStyle"
        :color="`${rltvPrsnBtn ? '#e85d56' : 'grey darken-3'}`"
        small>
        Зв`язки з фiзичними особами&nbsp;
        <v-icon 
          :class="personBtnIcon">
          {{ menuIcon }}
        </v-icon>
      </v-btn>
    </v-card-actions>
    
    <!-- Relative persons table -->
    <v-fab-transition>
      <v-card v-show="rltvPrsnBtn" elevation="5" class="ml-2 mr-2 mb-3">
        <v-card-text>
          <v-data-table
            v-if="relativePersonsPresent"
            color="black"
            :headers="relativePersonsHeader"
            :items="relativePersons"
            :items-per-page="10"
            dense>
            <template #item.person_uk="{ item }">
              {{ item.person_uk }}
            </template>
            <template #item.is_pep="{ item }">
              {{ item.is_pep ? 'Так' : 'Нi' }}
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-fab-transition>

    <!-- Relative legals table -->
    <v-fab-transition>
      <v-card v-show="rltvCompaniesBtn" elevation="5" class="ml-2 mr-2 mb-3">
        <v-card-text>
          <v-data-table
            v-if="relativeLegalPresent"
            color="black"
            :headers="relativeLegalHeader"
            :items="relativeLegals"
            :items-per-page="10"
            dense>
            <template #item.person_uk="{ item }">
              {{ item.person_uk }}
            </template>
            <template #item.is_pep="{ item }">
              {{ item.is_pep ? 'Так' : 'Нi' }}
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-fab-transition>
  </div>
</div>
</template>

<script>
export default {
  props: [
    'item',
    'searchIcon',
    'menuIcon'
  ],


  data: () => ({
    
    /* Table headers */
    relativePersonsHeader: [
      { text: 'ФИО', value: 'person_uk', align: 'start'},
      { text: 'Публiчна особа', value: 'is_pep', align: 'center' },
      { text: 'Тип зв`язку', value: 'relationship_type', align: 'center'},
    ],

    relativeLegalHeader: [
      { text: 'Компанiя', value: 'to_company_uk', align: 'start'},
      { text: 'Тип зв`язку', value: 'relationship_type_uk', align: 'start' },
    ],


    /* Buttons */
    rltvPrsnBtn: false,
    rltvCompaniesBtn: false,


    /* Settings */
    showOnlyRelPepPers: true,
  }),


  methods: {
    test() {
      console.log(this.rltvPrsnBtn)
    },

    showPersonRelations() {
      this.rltvPrsnBtn = !this.rltvPrsnBtn
      this.rltvCompaniesBtn = false
      
    },

    showLegalRelations() {
      this.rltvCompaniesBtn = !this.rltvCompaniesBtn
      this.rltvPrsnBtn = false
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
      return `border-radius: 0px; border-left: 5px solid #5f6368; margin: 0 auto;`
    }
  },
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