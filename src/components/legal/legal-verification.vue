<template>
  <ul>
    <li 
      @click.stop="toggleDeclarations" 
      class="list-item">
      <div>
        <a>Санкцiї європейського союзу (Юр. особа):</a>
        <span>&nbsp;[{{legal.ESLegalSanctions.data.length}}]</span>
      </div>
      <div 
        v-show="showDeclarations"
        @click.prevent="toggleDeclarations">
        <p
          v-for="(item, key) in legal.ESLegalSanctions.data"
          :key="key">
          {{ item.text }}
        </p>
      </div>
    </li>
    <li 
      @click.stop="toggleEsSanctions" 
      class="list-item">
      <div>
        <a>Санкцiї РНБО:</a>
        <span>&nbsp;[{{legal.RNBOLegals.data.length}}]</span>
      </div>
      <div 
        v-show="showEsSanctions"
        @click.prevent="toggleEsSanctions">
        <p
          v-for="(item, key) in legal.RNBOLegals.data"
          :key="key">
          {{ item.text }}
        </p>
      </div>
    </li>
    <li 
      @click.stop="toggleUNPersonSanctions"
      class="list-item">
      <div>
        <a>Санкцiї ООН (юр. особи):</a>
        <span>&nbsp;[{{legal.UNLegalSanctions.data.length}}]</span>
      </div>
      <div 
        v-show="showUNPersonSanctions"
        @click.prevent="toggleUNPersonSanctions">
        <p
          v-for="(item, key) in legal.UNLegalSanctions.data"
          :key="key">
        </p>
      </div>
    </li>
    <li 
      @click.stop="toggleUNTerrorPersonSanctions"
      class="list-item">
      <div>
        <a>ООН (терористи)</a>
        <span>&nbsp;[{{legal.UNLegalTerrors.data.length}}]</span>
      </div>
      <div 
        v-show="showUNTerrorPersonSanctions"
        @click.prevent="toggleUNTerrorPersonSanctions">
        <p
          v-for="(item, key) in legal.UNLegalTerrors.data"
          :key="key">
          {{ item.text }}
        </p>
      </div>
    </li>
    <li
      @click.stop="toggleUSPersonSanctions" 
      class="list-item">
      <div >
        <a>Санкцiї США</a>
        <span>&nbsp;[{{legal.USLegalSanctions.data.length}}]</span>
      </div>
      <div 
        v-show="showUSPersonSanctions"
        @click.prevent="toggleUSPersonSanctions">
        <p
          v-for="(item, key) in legal.USLegalSanctions.data"
          :key="key">
          {{ item.initials }}
        </p>
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
export default {
  props: {legal: Object},
  data: () => ({
    showDeclarations: false,
    showEsSanctions: false,
    showRnboSunctions: false,
    showUNPersonSanctions: false,
    showUNTerrorPersonSanctions: false,
    showUSPersonSanctions: false,
  }),
  methods: {
    toggleDeclarations() {this.showDeclarations = !this.showDeclarations},
    toggleEsSanctions() {this.showEsSanctions = !this.showEsSanctions},
    toggleRNBOSanctions() {this.showRnboSunctions = !this.showRnboSunctions},
    toggleUNPersonSanctions() {this.showUNPersonSanctions = !this.showUNPersonSanctions},
    toggleUNTerrorPersonSanctions() {this.showUNTerrorPersonSanctions = !this.showUNTerrorPersonSanctions},
    toggleUSPersonSanctions() {this.showUSPersonSanctions = !this.showUSPersonSanctions},
  },
}
</script>