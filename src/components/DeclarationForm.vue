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
              @click="test()"
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
          url: 'https://open-data-pep.herokuapp.com/get-public-person'
        },
        { 
          id: 2,
          text: 'E-декларації', 
          url: 'https://pacific-dawn-21711.herokuapp.com/get-declarations'
        },
      ],
      currentDB: null,

      lastName: null,
      firstName: null,
      patronymic: null,


      declarations: [],
      pep: null,
      pageUrl: null,

      resErr: 'Network response was not ok',
      loading: false,
    }),


    methods: {

      /* Requsts */

      getDeclarantData () {
        this.loading = true

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
        console.log('declaration handler')
      
        let result = val.results.object_list
        this.declarations = this.filterDeclarant(result)

        console.log(this.declarations)

        result.length === 0 
          ? this.notify(
            'Увага', 
            'За вказаними даними декларацiй не знайдено') 
          : false
      },
      // eslint-disable-next-line
      pepHandler(val) {
        this.pep = val
        this.getPepLink()
        console.log('pep handler')
      },

      option() {
        return {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          mode: 'cors',
          body: JSON.stringify(this.userInitials)
        }
      },

      switchHandler(val) {
        switch(this.currentDB.id) {
          case 1 : this.pepHandler(val);
            break;
          case 2 : this.declarationHandler(val); 
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
        this.pep = null
      },


      /* Action handlers */

      goToPage() {
        setTimeout(() => {
          this.$refs.targetLink.click()
          console.log(this.$refs.declarationSelect)
          }, 0)
      },
    },


    computed: {
      /* Objects */
      userInitials() {
        return {
          firstName: this.firstName,
          lastName: this.lastName,
          patronymic: this.patronymic
        }
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
    },
  }
</script>
