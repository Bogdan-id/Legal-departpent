<template>
  <v-row class="api-form text-center justify-center">

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
            large
            icon>
            <v-icon large>{{ mdiClose }}</v-icon>
          </v-btn>
        </v-hover>

        <!-- Modal card -->
        <v-card 
          :min-height="450" 
          :max-height="maxCardHeight"
          :style="cardOverflow">
          <v-card-text
            class="pl-2 pr-1 pt-0 custom-table">
            <div v-if="iterableItem && iterableItem.length > 0" 
              class="pt-2 pl-2 pr-2 d-flex justify-space-between">
              <div class="d-inline-block">
                {{`${currentDB.text}` }}
              </div>
              <br />
              <div class="d-inline-block">
                {{ `Всього знайдено: ${iterableItem.length}` }}
              </div>
            </div>
            <v-row 
              v-for="(item, key) in iterableItem"
              :key="key">
              <v-col>
                <v-hover 
                  #default="{ hover }" 
                  :open-delay="1">
                  <v-card :elevation="hover ? 6 : 3">
                    
                    <!-- dinamically iterable  -->
                    <public-persons
                      v-if="pepPresent" 
                      :item="item"
                      :searchIcon="mdiAccountSearch" />

                    <person-declarations 
                      v-if="declarationsPresent"
                      :item="item"
                      :searchIcon="mdiAccountSearch" />

                    <pep-by-edrpou 
                      v-if="relatedPersonPresent"
                      :item="item"
                      :searchIcon="mdiAccountSearch" />

                  </v-card>
                </v-hover>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </div>
    </v-dialog>

    <!-- form -->
    <v-col cols="12" xl="3" lg="4" md="4"  sm="6" xs="10">
      <v-card class="mt-8 ml-5 mr-5 mb-8">
        <v-col>
          <v-card-text class="pb-0 title">
            {{ 'Вiдкритi данi' }}
          </v-card-text>
          <v-card-text class="pb-0">
            <v-select
              @change="clearData()"
              v-model="currentDB"
              :items="DB"
              item-text="text"
              item-value="url"
              label="Оберiть базу"
              color="black"
              item-color="black"
              return-object>
            </v-select>
            <a 
              :href="pageUrl"
              ref="targetLink"
              style="display: none;"
              target="_blank">
            </a>
            <div v-show="notRelatedPersons">
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
            <div v-show="!notRelatedPersons">
              <v-text-field
                @input="clearData()"
                v-model="edrpou"
                label="ЄДРПОУ"
                color="black">
              </v-text-field>
            </div>
          </v-card-text>
          <v-card-actions 
            v-show="result"
            class="justify-center">
            <v-btn 
              @click="dialog = !dialog"
              color="grey darken-3"
              class="white--text"
              small>
              Переглянути результат
            </v-btn>
          </v-card-actions>
          <v-card-actions 
            v-show="!result"
            class="justify-center">
            <v-btn 
              @click="getDeclarantData()"
              color="grey darken-3"
              class="white--text"
              small
              :loading="loading"
              :disabled="!currentDB">
              Отримати данi
            </v-btn>
            <!-- <v-btn @click="test()">test</v-btn> -->
          </v-card-actions>
          
        </v-col>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
  import PublicPersons from './public-persons'
  import PersonDeclarations from './person-declarations'
  import PepByEdrpou from './pep-by-edrpou'

  /* Icons */

  import { mdiClose, mdiAccountSearch } from '@mdi/js'

  export default {
    name: 'DeclarationForm',

    components: {
      PublicPersons,
      PersonDeclarations,
      PepByEdrpou
    },

    data: () => ({
      DB: [
        {
          id: 1,
          text: 'Публiчнi особи', 
          url: 'https://pacific-dawn-21711.herokuapp.com/get-public-person'
        },
        {
          id: 2,
          text: 'Публiчнi особи за ЄДРПОУ',
          url: 'https://pacific-dawn-21711.herokuapp.com/get-related-persons'
        },
        { 
          id: 3,
          text: 'E-декларації', 
          url: 'https://pacific-dawn-21711.herokuapp.com/get-declarations'
        }
      ],

      /* Inputs */
      currentDB: null,

      lastName: null,
      firstName: null,
      patronymic: null,
      edrpou: null,

      /* Data */
      declarations: [],
      relatedPersons: [],
      pep: [],
      pageUrl: null,

      resErr: 'Network response was not ok',

      /* Booleans */
      loading: false,
      dialog: false,

      /* Icons */

      mdiClose,
      mdiAccountSearch
    }),


    methods: {
      test() {
        // console.log(this.$vuetify.breakpoint.height / 10 * 9)
      },

      /* Requsts */

      getDeclarantData () {
        this.loading = true

        console.log(this.option().body)

        fetch(this.currentDB.url, this.option())
          .then(res => {
            console.log(res)

            if(res.ok) return res.json()
            
            this.notify(res.status, res.statusText)

            throw new Error(this.resErr)
          })
          .then(val => {
            console.log(val)
            this.loading = false

            this.switchHandler(val)
          })
          .catch(err => {
            this.loading = false

            console.log(err)
          })
      },


      /* Response handlers */

      declarationHandler(val) {

        let result = val.results.object_list

        if(result.length === 0){
          this.notify(
            'Увага', 
            'За вказаними даними декларацiй не знайдено'
          )
        } else {
          this.declarations = this.filterDeclarant(result)
            .map(v => {
              let data = v.infocard
              v.infocard.initials = `${data.last_name} ${data.first_name} ${data.patronymic}`

              return v
            })

          this.nextTick(
            () => {this.dialog = !this.dialog }
          )
        }
      },

      pepHandler(val) {
        console.log(val)
        if(val) {
          this.pep = val
          this.dialog = !this.dialog
        }
      },

      relatedPersonHandler(val) {
        this.relatedPersons = val
        console.log(this.relatedPersons)
        this.dialog = !this.dialog
      },

      option() {
        return {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          mode: 'cors',
          body: this.objectController
        }
      },

      switchHandler(val) {
        switch(this.currentDB.id) {
          case 1 : this.pepHandler(val);
            break;
          case 2 : this.relatedPersonHandler(val);
            break;
          case 3 : this.declarationHandler(val); 
            break;
        }
      },


      /* Data handlers */

      filterDeclarant(data) {
        return data
          .filter(v => {
            return v.infocard.last_name === this.lastName.trim()
              && v.infocard.first_name === this.firstName.trim()
              && v.infocard.patronymic === this.patronymic.trim()
          })
      },

      
      /* Notifications */

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
        this.declarations = []
        this.relatedPersons = []
        this.pep = []
      },


      /* Action handlers */

      goToPage() {
        setTimeout(() => {
          this.$refs.targetLink.click()
          this.pageUrl = null
          }, 0)
      },

      nextTick(callback) {
        if(typeof callback === 'function') {
          setTimeout(() => { callback() }, 0)
        } else return
      }
    },


    computed: {
      /* Objects */
      objectController() {
        let obj
        this.notRelatedPersons 
          ? obj = JSON.stringify({
              firstName: this.firstName,
              lastName: this.lastName,
              patronymic: this.patronymic
            })

          : obj = JSON.stringify({edrpou: this.edrpou})
        
        return obj
      },

      /* Controllers */
      iterableItem() {
        let obj
        this.relatedPersonPresent
          ? obj = this.relatedPersons
          : this.declarationsPresent
            ? obj = this.declarations
            : this.pepPresent
              ? obj = this.pep
              : false

        return obj
      },


      /* Booleans */
      notRelatedPersons() {
        return !this.currentDB || this.currentDB && this.currentDB.id !== 2
      },

      relatedPersonPresent() {
        return this.relatedPersons.length > 0
      },

      declarationsPresent() {
        return this.declarations.length > 0
      },

      pepPresent() {
        return this.pep.length > 0
      },

      result() {
        return this.declarationsPresent || this.relatedPersonPresent || this.pepPresent
      },


      /* Styles */
      cardOverflow() {
        return `
          position: relative; overflow-x: hidden; 
          overflow-y: scroll; background: #f5f0f0`
      },

      closeAbsBtn() {
        return `
          position: absolute; top: -40px; 
          right: ${this.$vuetify.breakpoint.xs ? '-15px' : '-35px;'}`
      },

      maxCardHeight() {
        return this.$vuetify.breakpoint.height / 10 * 9
      }
    },
  }
</script>

<style>
.api-form .v-card, .v-dialog {
  overflow: visible!important;
  /* overflow-x: hidden!important; */
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
  color: #34495d!important; 
  font-size: 1rem;
  border-bottom: none!important;
}

.custom-table tbody tr td:first-child {
  font-weight: bold;
  color: rgba(0, 0, 0, 0.637);
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