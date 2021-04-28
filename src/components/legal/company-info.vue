<template>
  <div>
    <div>Компанiя: {{ company.name.shortName }}</div>
    <div>ЄДРПОУ: {{ company.code }}</div>
    <div>Адреса: {{ company.address }}</div>
    <div>Форма правлiння: {{ company.superiorManagement }}</div>
    <div v-if="company.contacts && company.contacts.length">
      <div>Контакти</div>
      <div 
        class="ml-4"
        v-for="(item, key) in company.contacts"
        :key="key">
        <div>Телефон: {{ item.phone || "---" }}</div>
        <div v-if="item.additionalPhone">
          Телефон (додатковий): {{ item.additionalPhone }}
        </div>
        <div>Email: {{ item.email || "---"}}</div>
        <div>Сайт: {{ item.webSite || "---" }}</div>
        <div>Факс: {{ item.fax || "---" }}</div>
      </div>
    </div>
    <div>Тип контрагента: {{ company.contractorType }}</div>
    <div v-if="company.mainEconomicActivity">Основний вид дiяльностi: 
      {{ company.mainEconomicActivity.code + " " + company.mainEconomicActivity.description }}
    </div>
    <div v-if="company.economicActivities && company.economicActivities.length">
      <div>Види дiяльностi:</div>
      <div 
        class="ml-4"
        v-for="(item, key) in company.economicActivities"
        :key="key">
        <span>Код: {{ item.code }}&nbsp;&nbsp;</span>
        <span>Дiяльнiсть: {{ item.description }}</span>
      </div>
    </div>
    <div v-if="company.founders && company.founders.length">
      <div>Засновники:</div>
      <div 
        class="ml-4"
        v-for="(founder, key) in company.founders"
        :key="key">
        <div>{{ founder.name.shortName || founder.name }}</div>
        <div>Адреса: {{ founder.address }}</div>
        <div v-show="founder.ownershipPercent">
          Доля володiння (%): {{ founder.ownershipPercent }}
        </div>
        <div>
          Доля володiння (грн): {{ founder.capital }}
        </div>
      </div>
    </div>
    <div v-if="company.foundingCapital">
      Статутний капiтал: {{ company.foundingCapital.sum }}
    </div>
    <div>Форма володiння: {{ company.legalForm }}</div>
    <div v-if="company.registrationAuthorities && company.registrationAuthorities.length">
      <div>Реєстрації:</div>
      <div 
        class="ml-4"
        v-for="(registration, key) in company.registrationAuthorities"
        :key="key">
        <div>Установа: {{ registration.establishment }}</div>
        <div>ЄДРПОУ: {{ registration.code }}</div>
        <div>Тип реєстрації: {{ registration.departmentRegister }}</div>
        <div>Дата реєстрації: {{ registration.registrationDate }}</div>
        <div>Номер реєстрації: {{ registration.registrationNumber }}</div>
        <div>Код реєстрації: {{ registration.code }}</div>
      </div>
    </div>
    <div>Статус: {{ company.status }}</div>
  </div>
</template>

<script>
export default {
  props: {
    company: {type: Object},
  },
}
</script>