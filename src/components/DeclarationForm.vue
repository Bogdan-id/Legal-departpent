<template>
  <v-row class="text-center justify-center">
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
            <v-card-actions
              v-show="pep" 
              class="justify-center pt-0">
              <v-btn
                :href="pageUrl" 
                target="_blank"
                class="white--text"
                x-small
                color="#e85d56">
                Переглянути в реєстрi
              </v-btn>
            </v-card-actions>
            <v-select
              @change="goToPage()"
              v-show="declarationsPresent"
              v-model="pageUrl"
              ref="declarationSelect"
              label="Оберiть рiк декларації"
              :items="declarations"
              item-text="infocard.declaration_year"
              item-value="infocard.url"
              color="black"
              item-color="black">
            </v-select>
            <!-- below hidden link -->
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
              <v-select
                v-show="relatedPersonsLn"
                @change="goToPage()"
                v-model="pageUrl"
                :items="relatedPersons"
                item-text="full_name"
                item-value="url"
                label="Перелiк публiчних осiб"
                color="black"
                item-color="black">
              </v-select>
            </div>
          </v-card-text>
          <v-card-actions class="justify-center">
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
  export default {
    name: 'DeclarationForm',

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
          url: 'https://pacific-dawn-21711.herokuapp.com/get-related-persons/'
        },
        { 
          id: 3,
          text: 'E-декларації', 
          url: 'https://pacific-dawn-21711.herokuapp.com/get-declarations'
        }
      ],
      currentDB: null,

      lastName: null,
      firstName: null,
      patronymic: null,
      edrpou: null,


      declarations: [],
      relatedPersons: [],
      pep: null,
      pageUrl: null,

      resErr: 'Network response was not ok',
      loading: false,
    }),


    methods: {
      // test() {
      //   console.log(this.currentDB)
      // },

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
        this.declarations = this.filterDeclarant(result)

        console.log(this.declarations)

        result.length === 0 
          ? this.notify(
            'Увага', 
            'За вказаними даними декларацiй не знайдено') 
          : false
      },

      pepHandler(val) {
        this.pep = val
        this.getPepLink()
      },

      relatedPersonHandler(val) {
        console.log('related handler')
        this.relatedPersons = val.result
        console.log(this.relatedPersons)
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

      getPepLink() {
        this.pageUrl = this.pep.result.url
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
        this.pep = null
      },


      /* Action handlers */

      goToPage() {
        setTimeout(() => {
          this.$refs.targetLink.click()
          this.pageUrl = null
          }, 0)
      },
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

      /* Text */
      cardTitle() {
        return this.declarationsPresent 
          ? `${this.lastName} ${this.firstName} ${this.patronymic}` 
          : 'Форма декларацiй'
      },

      /* Booleans */
      declarationsPresent() {
        return this.declarations.length > 0
      },

      notRelatedPersons() {
        return !this.currentDB || this.currentDB && this.currentDB.id !== 2
      },

      relatedPersonsLn() {
        return this.relatedPersons.length > 0
      }
    },
  }
</script>
