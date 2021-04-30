import Vue from 'vue'
/* eslint-disable no-unused-vars */
import {AxiosResponse} from 'axios'
/* eslint-enable no-unused-vars */

export default {
  state: {},
  mutations: {
    /** 
     * @param {{}} state 
     * @param {string} key */
    createKey(state, key) {
      Vue.set(state, key, {})
    },
    /** 
     * @param {{}} state 
     * @param {{key: "string", data: AxiosResponse}} object */
    assignObject(state, object) {
      state[object.key] = object.data
    },
  },
  actions: {},
  modules: {}
}
