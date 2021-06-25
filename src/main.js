'use-strict'
// @ts-check
import Vue from 'vue'
import router from './router'
// @ts-ignore
import App from './App.vue'
import vuetify from './plugins/vuetify'
import Snotify from 'vue-snotify'
import storeInstance from './store/index'
import Vuex from 'vuex'
import axios from './plugins/axios'

Vue.config.productionTip = false

Vue.use(Vuex)
Vue.use(Snotify)

const store = new Vuex.Store(storeInstance)

const vm = Vue.prototype
vm.$axios = axios(store)
vm.$store = store

new Vue({vuetify, router, render: h => h(App)}).$mount('#app')

Vue.config.errorHandler = function (err, vm, info) {
  Vue.prototype.$snotify.simple(err)
  throw {err, vm, info}
}
