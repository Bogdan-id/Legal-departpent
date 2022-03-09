<template>
  <!-- Person infor component -->
  <div class="person-info">
    <div><span class="info-label">Тип фiз. особи:</span> <span class="info-text">{{ person.contractorType}}</span></div>
    <div><span class="info-label">ФОП:</span> <span class="info-text">{{ person.name }}</span></div>
    <div><span class="info-label">Адреса:</span> <span class="info-text">{{ person.address }}</span></div>
    <div v-if="person.contacts && person.contacts.length">
      <div><span class="info-label">Контакти</span></div>
      <div 
        v-for="(item, key) in person.contacts"
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
    <div 
      v-if="person.mainEconomicActivity">
      <span class="info-label">
        Основний вид дiяльностi: 
      </span>
      <span class="info-text">{{ person.mainEconomicActivity.code + " " + person.mainEconomicActivity.description }}</span>
    </div>
    <div v-if="person.economicActivities && person.economicActivities.length">
      <div><span class="info-label">Види дiяльностi:</span></div>
      <ul>
        <li 
          v-for="(item, key) in person.economicActivities"
          :key="key">
          <span><span class="info-label">Код:</span> <span class="info-text">{{ item.code }}</span></span>&nbsp;
          <span><span class="info-label">Дiяльнiсть:</span> <span class="info-text">{{ item.description }}</span></span>
        </li>
      </ul>
    </div>
    <div v-if="person.registrationAuthorities && person.registrationAuthorities.length">
      <div><span class="info-label">Реєстрації:</span></div>
      <ul>
        <li 
          class="mb-3"
          v-for="(registration, key) in person.registrationAuthorities"
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
    <div><span class="info-label">Статус:</span> <span class="info-text">{{ person.status }}</span></div>
    <div><span class="info-label">Дата перевiрки:</span> <span class="info-text">{{ person.actualDate }}</span></div>
  </div>
</template>

<script>
export default {
  props: {person: {type: Object}},
}
</script>