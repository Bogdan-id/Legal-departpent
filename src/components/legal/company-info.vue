<template>
  <div>
    <div v-if="company.name && company.shortName"><span class="info-label">Компанiя:</span> <span class="info-text">{{ company.name.shortName }}</span></div>
    <div v-if="company.code"><span class="info-label">ЄДРПОУ:</span> <span class="info-text">{{ company.code }}</span></div>
    <div v-if="company.address"><span class="info-label">Адреса:</span> <span class="info-text">{{ company.address }}</span></div>
    <div v-if="company.superiorManagement"><span class="info-label">Форма правлiння:</span> <span class="info-text">{{ company.superiorManagement }}</span></div>
    <div v-if="company.contacts && company.contacts.length">
      <div><span class="info-label">Контакти</span></div>
      <div 
        v-for="(item, key) in company.contacts"
        :key="key">
        <div><span class="info-label">Телефон:</span> <span class="info-text">{{ item.phone || "---" }}</span></div>
        <div v-if="item.additionalPhone">
          Телефон (додатковий): <span class="info-text">{{ item.additionalPhone }}</span>
        </div>
        <div><span class="info-label">Email:</span> <span class="info-text">{{ item.email || "---"}}</span></div>
        <div><span class="info-label">Сайт:</span> <span class="info-text">{{ item.webSite || "---" }}</span></div>
        <div><span class="info-label">Факс:</span> <span class="info-text">{{ item.fax || "---" }}</span></div>
      </div>
    </div>
    <div v-if="company.contractorType"><span class="info-label">Тип контрагента:</span> <span class="info-text">{{ company.contractorType }}</span></div>
    <div 
      v-if="company.mainEconomicActivity">
      <span class="info-label">
        Основний вид дiяльностi: 
      </span>
      <span class="info-text">{{ company.mainEconomicActivity.code + " " + company.mainEconomicActivity.description }}</span>
    </div>
    <div v-if="company.economicActivities && company.economicActivities.length">
      <div><span class="info-label">Види дiяльностi:</span></div>
      <ul>
        <li 
          v-for="(item, key) in company.economicActivities"
          :key="key">
          <span><span class="info-label">Код:</span> <span class="info-text">{{ item.code }}</span></span>&nbsp;
          <span><span class="info-label">Дiяльнiсть:</span> <span class="info-text">{{ item.description }}</span></span>
        </li>
      </ul>
    </div>
    <div v-if="company.founders && company.founders.length">
      <div><span class="info-label">Засновники:</span></div>
      <ul>
        <li 
          class="mb-3"
          v-for="(founder, key) in company.founders"
          :key="key">
          <div>{{ founder.name.shortName || founder.name }}</div>
          <div><span class="info-label">Адреса:</span> <span class="info-text">{{ founder.address }}</span></div>
          <div 
            v-show="founder.ownershipPercent">
            <span class="info-label">
              Доля володiння (%):
            </span> 
            <span class="info-text">{{ founder.ownershipPercent }}</span>
          </div>
          <div>
            <span class="info-label">
              Доля володiння (грн): 
            </span>
            <span class="info-text">{{ founder.capital }}</span>
          </div>
          <div>
            <span class="info-label">
              Тип володiння: 
            </span>
            <span class="info-text">{{ getOwnerType(founder.type) }}</span>
          </div>
        </li>
      </ul>
    </div>
    <div 
      v-if="company.foundingCapital">
      <span class="info-label">
        Статутний капiтал: 
      </span>
      <span class="info-text">{{ company.foundingCapital.sum }}</span>
    </div>
    <div v-if="company.legalForm">
      <span class="info-label">Форма володiння:</span> <span class="info-text">{{ company.legalForm }}</span>
    </div>
    <div v-if="company.registrationAuthorities && company.registrationAuthorities.length">
      <div><span class="info-label">Реєстрації:</span></div>
      <ul>
        <li 
          class="mb-3"
          v-for="(registration, key) in company.registrationAuthorities"
          :key="key">
          <div><span class="info-label">Установа:</span> <span class="info-text">{{ registration.establishment }}</span></div>
          <div><span class="info-label">ЄДРПОУ:</span> <span class="info-text">{{ registration.code }}</span></div>
          <div><span class="info-label">Тип реєстрації:</span> <span class="info-text">{{ registration.departmentRegister }}</span></div>
          <div><span class="info-label">Дата реєстрації:</span> <span class="info-text">{{ registration.registrationDate }}</span></div>
          <div><span class="info-label">Номер реєстрації:</span> <span class="info-text">{{ registration.registrationNumber }}</span></div>
          <div><span class="info-label">Код реєстрації:</span> <span class="info-text">{{ registration.code }}</span></div>
        </li>
      </ul>
    </div>
    <div v-if="company.registrationAfterLaw">
      <div><span class="info-label">Дата реєстрації:</span> <span class="info-text">{{ company.registrationAfterLaw.entryDate }}</span></div>
      <div><span class="info-label">Номер реєстрації:</span> <span class="info-text">{{ company.registrationAfterLaw.entryNumber }}</span></div>
    </div>
    <div v-if="company.status">
      <span class="info-label">Статус:</span> <span class="info-text">{{ company.status }}</span>
    </div>
  </div>
</template>

<script>
import { getOwnerType } from './helper'
export default {
  props: { company: { type: Object } },
  methods: {
    getOwnerType,
  }
}
</script>