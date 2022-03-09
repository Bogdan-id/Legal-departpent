<template>
  <!-- Links with relative persons/legals -->
  <div class="d-flex justify-center flex-wrap">
    <v-btn 
      v-show="relvPersPresent"
      @click="showPersonRelations()"
      class="white--text mt-1 mb-1"
      :style="relativeBtnStyle"
      :color="`${rltvPrsnBtn ? '#e85d56' : 'grey darken-3'}`"
      x-small>
      Фiз. особами&nbsp;
      <v-icon 
        :class="personBtnIcon">
        {{ menuIcon }}
      </v-icon>
    </v-btn>
    <v-btn 
      v-show="relvLegalPresent"
      @click="showLegalRelations()"
      class="white--text mt-1 mb-1"
      :style="relativeBtnStyle"
      :color="`${btnState ? '#e85d56' : 'grey darken-3'}`"
      x-small>
      Юр. особами&nbsp;
      <v-icon 
        :class="legalBtnIcon">
        {{ menuIcon }}
      </v-icon>
    </v-btn>
  </div>
</template>


<script>
export default {
  props: [
    'menuIcon',
    'btnState',
    'relvPersPresent',
    'relvLegalPresent'
  ],


  data: () => ({
    rltvPrsnBtn: false,
    rltvCompaniesBtn: false,
  }),


  methods: {
    showPersonRelations() {
      this.rltvPrsnBtn = !this.rltvPrsnBtn
      this.rltvCompaniesBtn = false
      
      this.toggleRelationBtn()
    },

    showLegalRelations() {
      this.rltvCompaniesBtn = !this.rltvCompaniesBtn
      this.rltvPrsnBtn = false

      this.toggleRelationBtn()
    },

    toggleRelationBtn() {
      this.$emit('listenPersnsBtnState', {
        persnsBtn: this.rltvPrsnBtn,
        legalsBtn: this.rltvCompaniesBtn
      })
    }
  },


  computed: {
    relativeBtnStyle() {
      return `
        border-radius: 0px; border-left: 5px solid #5f6368; 
        margin: 0 auto; min-width: 130px;`
    },

    legalBtnIcon() {
      return `rltv-person-btn ${this.rltvCompaniesBtn ? 'active' : ''}`
    },

    personBtnIcon() {
      return `rltv-person-btn ${this.rltvPrsnBtn ? 'active' : ''}`
    },
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