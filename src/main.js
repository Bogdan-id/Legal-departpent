import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import Snotify from 'vue-snotify'

Vue.config.productionTip = false

Vue.use(Snotify)

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
