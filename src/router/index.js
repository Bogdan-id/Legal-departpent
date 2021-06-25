import Vue from 'vue'
import VueRouter from 'vue-router'
import DeclarationForm from '@/components/DeclarationForm.vue'
import BatchDataValidation from '@/components/BatchDataValidation'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'declaration-form',
    component: DeclarationForm
  },
  {
    path: '/batch-data-validation',
    name: 'batch-data-validation',
    component: BatchDataValidation,
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
