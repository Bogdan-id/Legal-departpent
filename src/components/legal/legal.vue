<template>
  <div class="node-tree">
    <!-- Legal info -->
    <ul>
      <li 
        v-if="legal.code && legal.hasOwnProperty('RNBOLegals')"
        @click.stop="toggleLegalInfo"
        class="list-item">
        <div>Iнформацiя про компанiю&nbsp;[{{showCompanyInfo ? '-' : '+'}}]</div>
        <v-fade-transition hide-on-leave>
          <div 
            v-if="showCompanyInfo"
            @click.prevent="toggleLegalInfo">
            <CompanyInfo :company="legal" />
          </div>
        </v-fade-transition>
      </li>
    </ul>
    <!-- Founder -->
    <ul v-if="legal.hasOwnProperty('ownershipType') || legal.hasOwnProperty('ownershipPercent')">
      <FounderInfo :founder="legal" />
    </ul>
    <!-- Legal verification -->
    <ul>
      <li 
        v-if="legal.hasOwnProperty('RNBOLegals')"
        @click.stop="toggleLegalVerification"
        class="list-item">
        <div>Перевiрка&nbsp;[{{showLegalVerification ? '-' : '+'}}]</div>
        <div 
          v-if="showLegalVerification"
          @click.prevent="toggleLegalVerification">
          <LegalVerification :legal="legal" />
        </div>
      </li>
    </ul>
    <!-- Signers -->
    <ul v-if="legal.signers && legal.signers.length">
      <li
        @click.stop="toggleSigners"
        class="list-item">
        <div>Пiдписанти&nbsp;[{{showSigners ? '-' : '+'}}]</div>
        <ul 
          v-if="showSigners"
          @click.prevent="toggleSigners">
          <li
            @click="toggleDescription(signerVerificationKeys, key)"
            v-for="(signer, key) in legal.signers"
            :key="'li-signer' + componentId + key">
            <span>{{ signer.name }}&nbsp;</span>
            <span>[{{ signerVerificationKeys.includes(key) ? "-" : "+" }}]</span>
            <div 
              v-if="signerVerificationKeys.includes(key)"
              @click.prevent="toggleDescription">
              <PersonVerification :person="signer" />
            </div>
          </li>
          <legal v-for="(signer, key) in legal.signers" 
            :legal="signer"
            :key="'lg-signer' + componentId + key">
            <span>{{ signer.name }}</span>
          </legal>
        </ul>
      </li>
    </ul>
    <!-- Founders -->
    <ul v-if="legal.founders && legal.founders.length">
      <li
        @click.stop="toggleFounders"
        class="list-item">
        <div>Засновники &nbsp;[{{showFounders ? '-' : '+'}}]</div>
        <ul 
          @click.prevent="toggleFounders" 
          v-if="showFounders">
          <li 
            v-for="(founder, key) in legal.founders"
            :class="{'have-nested': founder.founders}"
            @click="
              toggleDescription(founderVerificationKeys, key)
              toggleFounderKey(key)"
            :key="'li-founder' + componentId + key">
            <span>{{ founder.name.shortName || founder.name }}&nbsp;</span>
            <span>[{{ founderVerificationKeys.includes(key) ? "-" : "+" }}]</span>
            <div 
              v-if="founderVerificationKeys.includes(key)"
              @click.prevent="toggleDescription">
              <legal 
                v-if="founder.hasOwnProperty('RNBOLegals')"
                :legal="founder"
                :key="'legal-signer' + componentId + key">
              </legal>
              <PersonVerification 
                v-if="founder.hasOwnProperty('RNBOSanctions')" :person="founder"
                @click.prevent="toggleDescription" />
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import PersonVerification from './person-verification.vue'
import LegalVerification from './legal-verification.vue'
import CompanyInfo from './company-info.vue'
import FounderInfo from './FounderInfo.vue'
import { toggleDescription } from './helper.js'

export default {
  name: "legal",
  components: {
    PersonVerification,
    LegalVerification,
    CompanyInfo,
    FounderInfo,
  },
  props: {
    legal: Object
  },
  data: () => ({
    showSigners: false,
    showFounders: false,
    showLegalVerification: false,
    showCompanyInfo: false,

    showFounderKey: [],
    signerVerificationKeys: [],
    founderVerificationKeys: [],

    componentId: null,
  }),
  computed: {
    legalFounders () {
      /* eslint-disable */
      return this.legal.founders
        .filter((_, key) => this.showFounderKey.includes(key))
      /* eslint-enable */
    },
  },
  methods: {
    toggleFounders () {
      this.showFounders = !this.showFounders
    },
    toggleFounderKey (key) {
      if (this.showFounderKey.includes(key)) {
        let index = this.showFounderKey.indexOf(key)
        this.showFounderKey.splice(index, 1)
      } else this.showFounderKey.push(key)
    },
    toggleSigners () {
      this.showSigners = !this.showSigners
    },
    toggleLegalVerification() {
      this.showLegalVerification = !this.showLegalVerification
    },
    toggleLegalInfo() {
      this.showCompanyInfo = !this.showCompanyInfo
    },
    toggleDescription,
  },
  mounted() {
    this.componentId = this._uid
  },
};
</script>