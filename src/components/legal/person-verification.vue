<template>
  <ul>
    <li 
      @click.stop="toggleDeclarations" 
      class="list-item">
      <div>
        <a>Електронні декларації</a>
        <span>&nbsp;[{{person.EDeclarations.data.results.object_list.length}}]</span>
      </div>
      <div 
        v-show="showDeclarations"
        @click.prevent="toggleDeclarations">
        <p
          v-for="(item, key) in person.EDeclarations.data.results.object_list"
          :key="key">
          {{'declarations'}}
        </p>
      </div>
    </li>
    <li 
      @click.stop="toggleEsSanctions" 
      class="list-item">
      <div>
        <a>Санкцiї європейського союзу</a>
        <span>&nbsp;[Спiвпадiння за {{getCategoryName(person.ESPersonSanctions.data)}}]</span>
        <span>&nbsp;[{{person.ESPersonSanctions.data.length}}]</span>
      </div>
      <div 
        v-show="showEsSanctions"
        @click.prevent="toggleEsSanctions">
        <p
          v-for="(item, key) in person.ESPersonSanctions.data"
          :key="key">
          {{ item.text }}
        </p>
      </div>
    </li>
    <li
      @click.stop="toggleRNBOSanctions" 
      class="list-item">
      <div>
        <a>Санкцiї РНБО:</a>
        <span>&nbsp;[Спiвпадiння за {{getCategoryName(person.RNBOSanctions.data)}}]</span>
        <span>&nbsp;[{{person.RNBOSanctions.data.length}}]</span>
      </div>
      <div 
        v-show="showRnboSunctions"
        @click.prevent="toggleRNBOSanctions">
        <p 
          v-for="(item, key) in person.RNBOSanctions.data"
          :key="key">
          {{ item.text }}
        </p>
      </div>
    </li>
    <li 
      @click.stop="toggleUNPersonSanctions"
      class="list-item">
      <div>
        <a>Санкцiї ООН</a>
        <span>&nbsp;[Спiвпадiння за {{getCategoryName(person.UNPersonSanctions.data)}}]</span>
        <span>&nbsp;[{{person.UNPersonSanctions.data.length}}]</span>
      </div>
      <div 
        v-show="showUNPersonSanctions"
        @click.prevent="toggleUNPersonSanctions">
        <p
          v-for="(item, key) in person.UNPersonSanctions.data"
          :key="key">
        </p>
      </div>
    </li>
    <li 
      @click.stop="toggleUNTerrorPersonSanctions"
      class="list-item">
      <div>
        <a>ООН (терористи)</a>
        <span>&nbsp;[Спiвпадiння за {{getCategoryName(person.UNTerrorPersonSanctions.data)}}]</span>
        <span>&nbsp;[{{person.UNTerrorPersonSanctions.data.length}}]</span>
      </div>
      <div 
        v-show="showUNTerrorPersonSanctions"
        @click.prevent="toggleUNTerrorPersonSanctions">
        <p
          v-for="(item, key) in person.UNTerrorPersonSanctions.data"
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
        <span>&nbsp;[Спiвпадiння за {{getCategoryName(person.USPersonSanctions.data)}}]</span>
        <span>&nbsp;[{{person.USPersonSanctions.data.length}}]</span>
      </div>
      <div 
        v-show="showUSPersonSanctions"
        @click.prevent="toggleUSPersonSanctions">
        <p
          v-for="(item, key) in person.USPersonSanctions.data"
          :key="key">
          {{ item.initials }}
        </p>
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
export default {
  props: {person: Object},
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
    
    getCategoryName (data) {
      switch (true) {
        case data.includes("initials"): return "ПIБ"
        case data.includes("lastFirstName"): return "Прiзвищем та iм`ям"
        case data.includes("lastName"): return "Прiзвищем"
        case data.includes("firstName"): return "Iм`ям"
        case data.includes("patronymic"): return "По батьковi"
      }
    },
  },
}
</script>