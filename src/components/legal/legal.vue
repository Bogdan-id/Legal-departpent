<template>
  <div class="node-tree">
    <!-- Legal verification -->
    <ul>
      <li 
        v-if="legal.code"
        @click.stop="toggleLegalVerification"
        class="list-item">
        <div><a>Перевiрка</a></div>
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
        <div><a>Пiдписанти</a></div>
        <ul 
          v-if="showSigners"
          @click.prevent="toggleSigners">
          <li
            @click="showSignerVerification(key)"
            v-for="(signer, key) in legal.signers"
            :key="'li-signer' + componentId + key">
            <div>{{ signer.name + " [" + signer.description + "]" }}</div>
            <div 
              v-if="key === signerVerificationKey"
              @click.prevent="showSignerVerification">
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
        <div><a>Засновники</a></div>
        <ul 
          @click.prevent="toggleFounders" 
          v-if="showFounders">
          <li 
            v-for="(founder, key) in legal.founders"
            :class="{'have-nested': founder.founders}"
            @click="
              showNestedLegal(key)
              toggleFounderVerification(key)"
            :key="'li-founder' + componentId + key">
            <div>{{ founder.name.shortName || founder.name }}</div>
            <div 
              v-if="founderVerificationKey === key && !founder.code"
              @click.prevent="toggleFounderVerification">
              <PersonVerification :person="founder" />
            </div>
          </li>
          <ul>
            <legal 
              v-for="(founder, key) in legalFounders" 
              :legal="founder"
              :key="'leg-signer' + componentId + key">
            </legal>
          </ul>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import PersonVerification from './person-verification.vue'
import LegalVerification from './legal-verification.vue'
export default {
  name: "legal",
  components: {
    PersonVerification,
    LegalVerification,
  },
  props: {
    legal: Object
  },
  data: () => ({
    showSigners: false,
    showFounders: false,
    showLegalVerification: false,
    showFounderKey: null,
    signerVerificationKey: null,
    founderVerificationKey: null,

    componentId: null,
  }),
  computed: {
    legalFounders () {
      if (this.showFounderKey) return this.legal.founders
        .filter((_, key) => key === this.showFounderKey)
      return []
    },
  },
  methods: {
    showNestedLegal (key) {
      if (this.showFounderKey === key) {
        this.showFounderKey = null
      } else this.showFounderKey = key
    },
    toggleFounders () {
      this.showFounders = !this.showFounders
    },
    toggleSigners () {
      this.showSigners = !this.showSigners
    },
    showSignerVerification(key) {
      if (this.signerVerificationKey === key) {
        this.signerVerificationKey = null
      } else this.signerVerificationKey = key
    },
    toggleLegalVerification() {
      this.showLegalVerification = !this.showLegalVerification
    },
    toggleFounderVerification(key) {
      if (this.founderVerificationKey === key){
        this.founderVerificationKey = null
      } else this.founderVerificationKey = key
    },
  },
  mounted() {
    this.componentId = this._uid
  },
};
</script>

<style>
 .list-item {
   font-weight: bold;
   cursor: pointer;
 }
 .have-nested {
   text-decoration: underline;
   cursor: pointer;
 }
</style>