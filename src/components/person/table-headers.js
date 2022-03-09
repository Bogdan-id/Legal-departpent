/** Table header components */

export default {
  EDRTH: [
    { text: 'Назва', value: 'name.shortName', align: 'start', sortable: false},
    // { text: 'Керiвник', value: 'boss', align: 'center', sortable: false },
    { text: 'Статус', value: 'status', align: 'center', sortable: false },
    { text: 'ЄДРПОУ', value: 'code', align: 'center', sortable: false },
  ],
  EDRTHperson: [
    { text: 'ФОП', value: 'initials', align: 'start', sortable: false},
    { text: 'Статус', value: 'condition', align: 'center', sortable: false },
  ],
  EDTH: [
    { text: 'Прiзвище', value: 'infocard.last_name', align: 'start', sortable: false},
    { text: 'Iм`я', value: 'infocard.first_name', align: 'center', sortable: false },
    { text: 'По батьковi', value: 'infocard.patronymic', align: 'center', sortable: false },
    { text: 'PEP', value: 'infocard.isPep', align: 'center', sortable: false },
    { text: 'Зв`язки з PEP', value: 'infocard.family', align: 'center', sortable: false },
    { text: 'Посада', value: 'infocard.position', align: 'center', sortable: false },
    { text: 'Рiк', value: 'infocard.declaration_year', align: 'center', sortable: false},
    { text: 'Тип', value: 'infocard.document_type', align: 'center', sortable: false },
    { text: "Детально", value: 'action', align: 'center', sortable: false}
  ],
  PEPTH: [
    { text: 'ПIБ', value: 'full_name', align: 'start', sortable: false },
    { text: 'Дата нар-ння', value: 'date_of_birth', align: 'center', sortable: false},
    { text: 'Посада', value: 'last_job_title', align: 'center', sortable: false },
    { text: 'Оф. тип.', value: 'type_of_official', align: 'center', sortable: false },
    { text: "Детально", value: 'action', align: 'center', sortable: false}
  ],
  pepNestedLegal: [
    { text: "Юр. особа", value: 'to_company_uk', align: 'start', sortable: false},
    { text: "Тип зв`язку", value: 'relationship_type_uk', align: 'start', sortable: false},
    { text: "ЄДРПОУ", value: 'to_company_edrpou', align: 'start', sortable: false},
  ],
  pepNestedPerson: [
    { text: "ПIБ", value: 'person_uk', align: 'start', sortable: false},
    { text: "Тип зв`язку", value: 'relationship_type', align: 'start', sortable: false},
  ],

  UNOsancPerson: [
    { text: 'ПIБ', value: 'fullName', align: 'start', sortable: false},
    { text: 'Нацiональнiсть', value: 'nationality', align: 'center', sortable: false },
    { text: 'День н-ння', value: 'dateOfBirth', align: 'center', sortable: false },
    { text: 'Посада', value: 'designation', align: 'center', sortable: false },
  ],
  UNOsancLegal: [
    { text: 'Пiдроздiл', value: 'firstName', align: 'start', sortable: false},
    { text: 'Органiзацiя', value: 'unListType', align: 'center', sortable: false },
  ],
  UNOsancPersonNested: [
    { text: 'Також вiдомий як', value: 'ALIAS_NAME', align: 'start', sortable: false},
  ],
  UNOterrorPersonTH: [
    { text: 'ПIБ', value: 'fullName', align: 'start', sortable: false},
    { text: 'Мiсце народження', value: 'place-of-birth-list', align: 'center', sortable: false },
    { text: 'Мiсце проживання', value: 'address-list.address', align: 'center', sortable: false },
    { text: 'Дата народження', value: 'date-of-birth-list', align: 'center', sortable: false },
  ],
  UNOterrorLegalTH: [
    { text: 'Назва органiзації', value: 'fullName', align: 'start', sortable: false},
    { text: 'Адреса', value: 'address-list.address', align: 'center', sortable: false },
  ],
  usSanctionPersonTH: [
    { text: 'ПIБ', value: 'initials', align: 'start', sortable: false},
    { text: 'Дiяльнiсть', value: 'title', align: 'center', sortable: false },
  ],
  usSanctionLegalTH: [
    { text: 'Назва компанiї', value: 'lastName', align: 'start', sortable: false},
    { text: 'Контакти', value: 'remarks', align: 'center', sortable: false },
  ],
  usSanctionNested: [
    { text: 'Також вiдомий як', value: 'ALIAS_NAME', align: 'start', sortable: false},
  ],
}