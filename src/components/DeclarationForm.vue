<template>
  <v-row class="text-center justify-center">
    <v-col cols="12" xl="3" lg="4" md="4"  sm="6" xs="10">
      <v-card class="mt-8 ml-5 mr-5 mb-8">
        <v-col>
          <v-card-text class="pb-0 title">
            {{ cardTitle }}
          </v-card-text>
          <v-card-actions 
            v-show="link" 
            class="justify-center pb-0">
            <v-btn 
              :href="link" 
              target="_blank" 
              small color="#e85d56"
              dark>
              Перегллянуты декларацiю
            </v-btn>
          </v-card-actions>
          <v-card-text class="pb-0">
            <v-text-field
              @input="link = null"
              v-model="lastName"
              label="Прiзвище"
              color="black">
            </v-text-field>
            <v-text-field
              @input="link = null"
              v-model="firstName"
              label="Iм`я"
              color="black">
            </v-text-field>
            <v-text-field
              @input="link = null"
              v-model="patronymic"
              label="По батьковi"
              color="black">
            </v-text-field>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn 
              @click="getDeclarantData()"
              color="grey darken-3" 
              dark small
              :loading="loading">Отримати данi</v-btn>
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
      lastName: null,
      firstName: null,
      patronymic: null,

      declarantData: null,
      link: null,

      responseEmpty: false,
      loading: false,
    }),


    methods: {
      getDeclarantData () {
        this.loading = true
        this.link = null
        this.responseEmpty = false

        fetch('https://pacific-dawn-21711.herokuapp.com/get-declarations', this.option())
          .then(res => {
            console.log(res)
            
            if(res.ok) return res.json()
            
            this.notify(res.status, res.statusText)

            throw new Error('Network response was not ok')
          })
          .then(val => {
            this.responseHandler(val)
          })
          .catch(err => {
            this.loading = false

            console.log(err)
          })
      },

      responseHandler(val) {
        this.loading = false

        let result = val.results.object_list
        let lastDeclaration = this.filterDeclarant(result)[0]

        this.link = this.getDeclarationLink(lastDeclaration)
        !this.link ? this.responseEmpty = true : false

        result.length === 0 
          ? this.notify(
            'Увага', 
            'За вказаними даними декларацiй не знайдено') 
          : false
      },

      filterDeclarant(data) {
        return data
          .filter(v => {
            return v.infocard.last_name === this.lastName.trim()
              && v.infocard.first_name === this.firstName.trim()
              && v.infocard.patronymic === this.patronymic.trim()
          })
      },

      getDeclarationLink(declaration) {
        return declaration 
          && declaration.infocard 
          && declaration.infocard.url
            ? declaration.infocard.url
            : null
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

      notify(title, text) {
        this.$snotify.simple(text, title, {
          timeout: 2000,
          showProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true
        })
      },
    },


    computed: {
      userInitials() {
        return {
          firstName: this.firstName,
          lastName: this.lastName,
          patronymic: this.patronymic
        }
      },

      cardTitle() {
        return this.link 
          ? `${this.lastName} ${this.firstName} ${this.patronymic}` 
          : 'Форма декларацiй'
      }
    },
  }
</script>
