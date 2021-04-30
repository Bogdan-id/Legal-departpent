'use-strict'
// @ts-check
/* eslint-disable no-unused-vars */
import { 
  EdrLegal,
  Founder,
  Signer,
  AxiosService,
  YourControlRNBOResult,
  YourControlSanctions,
} from '../types'
/* eslint-enable no-unused-vars */

import { 
  mdiClose, 
  mdiAccountSearch,
  mdiMenuDown,
  mdiInformation,
  mdiAxisZRotateClockwise,
  mdiWindowMinimize,
  mdiTextBoxSearchOutline,
  mdiSortAlphabeticalAscendingVariant
} from '@mdi/js' 

import { trimExceededLength } from '../utils/helper'

import { letters } from '../utils/utils'
import { transliteRule } from './translite'
/* eslint-disable no-unused-vars */
import { AxiosResponse, AxiosError, Cancel } from 'axios'
/* eslint-enable no-unused-vars */

// @ts-ignore
import LegalTree from './legal/tree.vue'
import { validationMixin } from 'vuelidate'
import { minLength, required } from 'vuelidate/lib/validators'

const legal =  {
  mixins: [validationMixin],
  components: {
    LegalTree,
  },
  name: 'DeclarationForm',
  validations() {
    const legalEdrpou = this.choosedLegal 
      ? {
          edrpou: {
            required,
            minLength: minLength(8),
          },
        } 
      : {}
    const personInn = this.personInn ? {inn: {required}} : {}
    const personInitials = this.personInitials 
      ? {
          lastName: {required},
          firstName: {required},
          patronymic: {required},
      } : {} 

    return {
      ...legalEdrpou,
      ...personInitials,
      ...personInn,
    }
  },
  data: () => ({
    apiKey: 'b00b0000a013607c3bc0acb76917a9f022f2b908',
    baseUrl: null,
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
    transliteRuleTH: [
      {text: "Українська", value: "ua", sortable: false, align: "start"},
      {text: "Початок слова (EN)", value: "en", sortable: false, align: "center"},
      {text: "В iнших поз-iях (EN)", value: "position", sortable: false, align: "center"},
      {text: "Приклад UK", value: "exampleUK", sortable: false, align: "center"},
      {text: "Приклад EN", value: "exampleEN", sortable: false, align: "center"},
    ],

    letters: letters,
    currSection: null,
    ukVersion: true,
    showRequisite: false,
    showRule: false,

    edrExpanded: [],
    edrPersonExpanded: [],
    pepExpanded: [],
    unSancExpanded: [],
    unTerrorExpanded: [],
    usSanctionExpanded: [],
    edrExpandedW: false,
    edrPersonExpandedW: false,
    pepExpandedW: false,
    unSancExpandedW: false,
    unTerrorExpandedW: false,
    usSanctionExpandedW: false,
    
    edrList: [],
    edrListPerson: [],
    pepList: [],
    eDeclarationList: [],
    rnboList: [],
    unSanctionList: [],
    unTerrorList: [],
    esSanctionList: [],
    usSanctionList: [],

    edrInitials: [],
    edrLegals: [],

    lastName: null,
    firstName: null,
    patronymic: null,
    inn: null,
    edrpou: null,
    companyName: null,

    globalObject: {},

    /* Data */
    pageUrl: null,
    searchVariant: null,
    searchType: null,

    /* Booleans */
    loading: false,
    dialog: false,

    /* Icons */
    mdiClose,
    mdiAccountSearch,
    mdiMenuDown,
    mdiInformation,
    mdiAxisZRotateClockwise,
    mdiWindowMinimize,
    mdiTextBoxSearchOutline,
    mdiSortAlphabeticalAscendingVariant,

    edrCodes: [],
    attemptsToGetNewEdrLegal: 0,
    maxAttempts: 0,
    /** @param { array } handledEdrpous - List of "edrpou" codes that have already been checked */
    handledEdrpous: [],
    yourControlTimeOut: 3000,
    legalDialog: false,
    commonErr: "Поле обов`язкове",
  }),
  methods: {
    trimExceededLength,
    /** @param {{companyName: string}} object */
    checkUsLegalSanctions(object) {
      const url = this.baseUrl + '/us-legal-sanctions'
      return this.$axios
        .post(url, object).then(res => res).catch(err => this.getRejectedKey(err))
    },
    /** @param {{companyName: string}} object */
    checkUnLegalTerrors(object) {
      const url = this.baseUrl + '/un-legal-terrors'
      return this.$axios
        .post(url, object).then(res => res).catch(err => this.getRejectedKey(err))
    },
    /** @param {{companyName: string}} object */
    checkUnLegalSanctions(object) {
      const url = this.baseUrl + '/un-legal-sanctions'
      return this.$axios
        .post(url, object).then(res => res).catch(err => this.getRejectedKey(err))
    },
    /** @param {{edrpou: string | number, companyName: string}} object */
    checkEsLegalSanctions(object) { 
      const url = this.baseUrl + '/get-eu-legal-sanctions'
      return this.$axios
        .post(url, object).then(res => res).catch(err => this.getRejectedKey(err))
    },
    /** @param {{edrpou: string | number, companyName: string}} object */
    checkRnboLegals(object) {
      const url = this.baseUrl + '/get-legal-sanctions'
      return this.$axios
        .post(url, object).then(res => res).catch(err => this.getRejectedKey(err))
    },
    /** 
     * @function checkEDeclarations - Post capitalized person object
     * @param {{lastName: string, firstName: string, patronymic: string}} object */
    checkEDeclarations(object) { 
      const url = this.baseUrl + '/get-declarations'
      return this.$axios
        .post(url, object).then(res => res).catch(err => this.getRejectedKey(err))
    },
    /** 
     * @function checkRnboPersons - Post capitalized person object
     * @param {{lastName: string, firstName: string, patronymic: string}} object */
    checkRnboPersons(object) {
      const url = this.baseUrl + '/get-person-sanctions'
      return this.$axios
        .post(url, object).then(res => res).catch(err => this.getRejectedKey(err))
    },
    /** 
     * @function checkUnPersSanctions - Post transliterated person object
     * @param {{lastName: string, firstName: string, patronymic: string}} object */
    checkUnPersSanctions(object) {
      const url = this.baseUrl + '/un-person-sanctions'
      return this.$axios
        .post(url, object).then(res => res).catch(err => this.getRejectedKey(err))
    },
    /** 
     * @function checkUsPersonSunctions - Post transliterated person object
     * @param {{lastName: string, firstName: string, patronymic: string}} object */
    checkUsPersonSunctions(object) {
      const url = this.baseUrl + '/us-person-sanctions'
      return this.$axios
        .post(url, object).then(res => res).catch(err => this.getRejectedKey(err))
    },
    /** 
     * @function checkEsPersonSunctions - Post transliterated person object
     * @param {{lastName: string, firstName: string, patronymic: string}} object */
    checkEsPersonSunctions(object) {
      const url = this.baseUrl + '/get-eu-person-sanctions'
      return this.$axios
        .post(url, object).then(res => res).catch(err => this.getRejectedKey(err))
    },
    /** 
     * @function checkUnTerrors - Post transliterated person object
     * @param {{lastName: string, firstName: string, patronymic: string}} object */
    checkUnTerrors(object) {
      const url = this.baseUrl + '/un-person-terror'
      return this.$axios
        .post(url, object).then(res => res).catch(err => this.getRejectedKey(err))
    },
    /**
     * @param {{edrpou: string | number, apiKey: string, currentData?: boolean}} object 
     * @returns {Promise<AxiosResponse<EdrLegal>>} */ 
    // eslint-disable-next-line
    getEdrLegal(object) {
      console.log('getEdrLegal', object)
      // @ts-ignore
      if (! object.edrpou) return Promise.resolve()
      if (this.attemptsToGetNewEdrLegal === this.maxAttempts) {
        this.attemptsToGetNewEdrLegal = 0
        object.currentData = true
      }
      const url = this.baseUrl + `/your-control/get-edr-legal`
      return this.$axios
        .post(url, object)
        .then(res => {
          if (res?.data?.code === "InvalidParameters") {
            this.$snotify.simple(res.data.message)
            throw new Error(res.data.message)
          }
          return res
        })
        .catch(err => this.getRejectedKey(err))
    },
    /**
     * @typedef {{status: string, resultUrl: string}} YourControlRNBOUrl */
    /** 
     * @function getResultUrl - return link with resultId 
     * @param {{lastName: string, firstName: string, middleName: string, apiKey: string}} object
     * @return {Promise<AxiosResponse<YourControlRNBOUrl>>} */
    // eslint-disable-next-line
    getResultUrl(object) {
      const url = this.baseUrl + '/your-control/rnbo/get-person-url'
      return this.$axios
        .post(url, object).then(res => res).catch(err => this.getRejectedKey(err))

      /* below temporary for debug purposes */
      // @ts-ignore
      // return Promise.resolve({data: {
      //     status: 'string',
      //     resultUrl: 'string',
      // }})
    },
    /** 
     * @param {{resultUrl: string, apiKey: string}} object
     * @return {Promise<AxiosResponse<YourControlRNBOResult>>} */ // AxiosResponse["data"]
     // eslint-disable-next-line
    getResult(object) {
      const url = this.baseUrl + '/your-control/rnbo/get-person-result'
      return this.$axios
        .post(url, object).then(res => res).catch(err => this.getRejectedKey(err))

      /* below for debug purposes */
      // // @ts-ignore
      // return Promise.resolve({data: {
      //   data: [],
      //   result: [],
      //   registryUpdateTime: [],
      // }})
    },
    
    /** 
     * @param {{edrpou: string | number, apiKey: string}} object
     * @return {Promise<AxiosResponse<YourControlSanctions>>} */
    yourControlSanctionList(object) {
      const url = this.baseUrl + '/your-control/sanctions'
      return this.$axios
        .post(url, object).then(res => res).catch(err => this.getRejectedKey(err))
    },
    /** @param {string} str */
    getLegalName(str) {
      if (! str || typeof str !== "string") return
      if (! str.includes('"')) return str

      return str.split('"').reduce(
        (a, b) => a.length > b.length ? a : b
      )
    },
    /** 
     * @param {Cancel} cancel - Axios cancel object */
    getRejectedKey (cancel) {
      if (cancel instanceof Error) throw new Error(cancel)
      if (! cancel) Promise.reject(new Error ('"getRejectedKey": "cancel"/"object" parameter required '))
      if (! cancel?.message) Promise.reject(cancel)
      if (cancel?.message) {
        const key = cancel.message
        return Promise.resolve(this.$store.state[key])
      }
    },
    /**
     * @param {EdrLegal | Founder | {}} mapedObject
     * @param {string | number } code - EDRPOU code */
    getEdrData(mapedObject, code) {
      const yourControlEdrLegal = {edrpou: code, apiKey: this.apiKey}  
      return this.getEdrLegal(yourControlEdrLegal)
        .then(res => {
          console.log('getEdrLegal RES', res)
          if (res?.data?.status === "Update in progress") {
            this.attemptsToGetNewEdrLegal ++
            return new Promise(resolve => {
              setTimeout(() => resolve(this.getEdrData(mapedObject, code)), this.yourControlTimeOut)
            })
          }
          /** @type {EdrLegal} */
          let legal, legalEnName, legalUaName
          if (res?.data) {
            legal = this.assignObject(mapedObject, JSON.parse(JSON.stringify(res.data)))
            legalEnName = this.getLegalName(legal?.nameInEnglish?.shortName)
            legalUaName = this.getLegalName(legal?.name?.shortName)
          }
          
          // casting legal.name to string
          let founderEnName, founderUaName, name
          if (legal && typeof legal.name === "string") {
            name = this.getLegalName(legal.name)
            /** @type {Founder} */
            // @ts-ignore
            founderEnName = this.transliterate(name)
            // @ts-ignore
            founderUaName = name
            // @ts-ignore
          } else if (typeof mapedObject.name === "string") {
            // @ts-ignore
            name = this.getLegalName(mapedObject.name)
            // @ts-ignore
            founderEnName = this.transliterate(name)
            // @ts-ignore
            founderUaName = name
            // @ts-ignore
          } else if (typeof mapedObject.name === "object") {
            // @ts-ignore
            name = this.getLegalName(mapedObject.name.shortName)
            // @ts-ignore
            founderEnName = this.transliterate(name)
            // @ts-ignore
            founderUaName = name
          }

          const requisites = {nameEn: legalEnName || founderEnName, nameUa: legalUaName || founderUaName}
          const object = legal || mapedObject
          // @ts-ignore
          this.checkLegal(object, requisites)
          
          if (! legal || ! legal.code) return
          const legalFounders = legal?.founders?.filter(founder => founder.name.includes('"'))
          const personFounders = legal?.founders?.filter(founder => !founder.name.includes('"'))

          if (legalFounders?.length) {
            legalFounders.map(founder => {
              const founderName = founder?.name?.split('"')[1]
              this.checkLegalFounder(founder, founderName)
            })
          }
          if (personFounders?.length) {
            personFounders.map(founder => {
              this.checkLegalPerson(founder, founder.name)
            })
          }
          if (legal.signers?.length) {
            legal.signers.map(signer => {
              this.checkLegalPerson(signer, signer.name)
            })
          }
        })
    },
    /**
     * @template T
     * @param { T } mapedObject - Object on wich nested request triggered
     * @param { string | number } code - EDRPOU code */
    async mapEdrLegal(mapedObject, code) {
      try {
        if (code && this.handledEdrpous.includes(code)) return
        await this.getEdrData(mapedObject, code)
      } catch(err) {
        this.loading = false
        console.log(err)
      }
    },
    /** @param {string} code */
    async mapGlobalLegal(code) {
      if (this.$v.$invalid) {
        this.$snotify.simple('Невiрний Код ЄДРПОУ: ' + this.edrpou)
        return
      }

      try {
        this.handledEdrpous.length = 0
        this.globalObject = {}
        this.loading = true
        await this.getEdrData(this.globalObject, code)
        this.loading = false
        // this.dialog = true
        this.legalDialog = true
        console.log(this.globalObject)
      } catch (err) {
        this.loading = false
        console.log(err)
      }
    },
    /**
     * @param {string} person
     * @param {object} [config]
     * @param {boolean} [config.capitalize]
     * @param {boolean} [config.transliterate]  */
    getPersonInitials(person, config) {
      let capitalize, transliterate 

      if (config) {
        capitalize = config.capitalize
        transliterate = config.transliterate
      }
      
      const [ lastName, firstName, patronymic ] = person.split(' ')
      if (!lastName || !firstName || lastName.length <= 1 || firstName.length <= 1) {
        throw new Error('Initials not valid: ' + `${lastName} ${firstName} ${patronymic}`)
      }

      let personObject = {
        firstName: firstName,
        lastName: lastName,
        patronymic: patronymic,
      }

      /** @param {function} handler */
      function modifyPerson(handler) {
        Object.keys(personObject).forEach(initial => {
          return personObject[initial] = handler(personObject[initial])
        })
        return personObject
      }

      switch (true) {
        case capitalize: return modifyPerson(this.capitalize)
        case transliterate: return modifyPerson(this.transliterate)
        default: return personObject
      }
    },
    /**
     * @param {Founder | Signer} mapedObject
     * @param {string} name
     */
    checkLegalPerson(mapedObject, name) {
      const capitalizedPersonObj = this.getPersonInitials(name, {capitalize: true})
      const transliteratedPersonObj = this.getPersonInitials(name, {transliterate: true})
      // const personObj = this.getPersonInitials(name)

      this.getResultUrl({
          lastName: capitalizedPersonObj.lastName, 
          firstName: capitalizedPersonObj.firstName, 
          middleName: capitalizedPersonObj.patronymic, 
          apiKey: this.apiKey
        })
        .then(res => this.getResult({resultUrl: res.data.resultUrl, apiKey: this.apiKey}))
        .then(res => this.assignObject(mapedObject, {YourControlRNBO: res}))

      this.checkEDeclarations(capitalizedPersonObj)
        .then(res => this.assignObject(mapedObject, {EDeclarations: res}))
      this.checkRnboPersons(capitalizedPersonObj)
        .then(res => this.assignObject(mapedObject, {RNBOSanctions: res}))
      this.checkUnPersSanctions(transliteratedPersonObj) 
        .then(res => this.assignObject(mapedObject, {UNPersonSanctions: res}))
      this.checkUsPersonSunctions(transliteratedPersonObj) 
        .then(res => this.assignObject(mapedObject, {USPersonSanctions: res}))
      this.checkEsPersonSunctions(transliteratedPersonObj)
        .then(res => this.assignObject(mapedObject, {ESPersonSanctions: res}))
      this.checkUnTerrors(transliteratedPersonObj)
        .then(res => this.assignObject(mapedObject, {UNTerrorPersonSanctions: res}))
    },
    /**
     * @param {Founder} founder
     * @param {string} founderName */
    checkLegalFounder (founder, founderName) {
      this.mapEdrLegal(founder, founder.code)
      this.checkEsLegalSanctions({edrpou: founder.code, companyName: this.transliterate(founderName)})
        .then(res => this.assignObject(founder, {ESLegalSanctions: res}))
      this.checkUsLegalSanctions({companyName: this.transliterate(founderName)})
        .then(res => this.assignObject(founder, {USLegalSanctions: res}))
      this.checkUnLegalTerrors({companyName: this.transliterate(founderName)})
        .then(res => this.assignObject(founder, {UNLegalTerrors: res}))
      this.checkUnLegalSanctions({companyName: this.transliterate(founderName)})
        .then(res => this.assignObject(founder, {UNLegalSanctions: res}))
      this.checkRnboLegals({edrpou: founder.code, companyName: founderName})
        .then(res => this.assignObject(founder, {RNBOLegals: res}))
      this.yourControlSanctionList({edrpou: founder.code, apiKey: this.apiKey})
        .then(res => this.assignObject(founder, {YourControlSanctions: res}))
    },
    /**
     * @param {EdrLegal} legal
     * @param {object} requisites - En/Ua
     * @param {string} requisites.nameUa
     * @param {string} requisites.nameEn */
    checkLegal (legal, requisites) {
      this.checkEsLegalSanctions({edrpou: legal.code, companyName: requisites.nameEn})
        .then(res => this.assignObject(legal, {ESLegalSanctions: res}))
      this.checkUsLegalSanctions({companyName: requisites.nameEn})
        .then(res => this.assignObject(legal, {USLegalSanctions: res}))
      this.checkUnLegalTerrors({companyName: requisites.nameEn})
        .then(res => this.assignObject(legal, {UNLegalTerrors: res}))
      this.checkUnLegalSanctions({companyName: requisites.nameEn})
        .then(res => this.assignObject(legal, {UNLegalSanctions: res}))
      this.checkRnboLegals({edrpou: legal.code, companyName: requisites.nameUa})
        .then(res => this.assignObject(legal, {RNBOLegals: res}))
      this.yourControlSanctionList({edrpou: legal.code, apiKey: this.apiKey})
        .then(res => this.assignObject(legal, {YourControlSanctions: res}))
    },
    assignObject (source, asignObject) {
      Object.entries(asignObject).forEach(entry => this.$set(source, entry[0], entry[1]))
      return source
    },
    switchHeader (list, index) {
      // initials lastFirstName lastName firstName patronymic
      switch(list[index]) {
        case 'initials': return 'спiвпадiння за ПIП';
        case 'lastFirstName': return 'спiвпадiння за Прiзвищем та Iм`ям';
        case 'lastName' : return 'спiвпадiння за Прiзвищем'; 
        case 'firstName': return 'спiвпадiння за Iм`ям'; 
        case 'patronymic': return 'спiвпадiння По батьковi'; 
      }
    },
    validLength(arr) {
      let items = [
        'initials',
        'lastFirstName',
        'lastName',
        'firstName',
        'patronymic'
      ]
      return arr
        .filter(
          v => items.includes(v)
        )
    },
    makeActive(e) {
      if(e === this.currSection) this.currSection = null 
      else this.currSection = e
    },
    btnActv(name) {
      return this.currSection === name
    },

    capitalize(str) {
      if(!str) return ''
      str = str.trim().replace(/\s+/g, ' ').split(' ')
      return str.map(text => {
        return (text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()).trim()
      }).join(' ')
    },

    /** @return {string} */
    transliterate(str) {
      if(!str) return
      let fI = {"Є": "IE", "Ї": "I", "Й": "I", "Ю": "IU", "Я": "IA"}
      str = str.toUpperCase().split("")
      str.forEach((v, i) => {
        if(Object.keys(fI).includes(v) && i !== 0) str.splice(i, 1, fI[v])
      })
      return str.join("")
        .replace(/зг/g, 'ZGH')
        .trim()
        .replace(/\s+/g, ' ')
        .split('')
        .map(char => this.letters[char] || char)
        .join("")
        .replace(/[^a-zA-Z-`\s0-9().,]/gu, '')
    },
    goToPage(url) {
      if(!url) return
      this.pageUrl = url
      setTimeout(() => {
        this.$refs.targetLink.click()
        this.pageUrl = null
        }, 0)
    },
    markText(handler, text) {
      switch(handler) {
        case 'legalHandler': return [
            this.edrpou ? text.indexOf(this.edrpou) : 0, 
            this.edrpou ? text.indexOf(this.edrpou) + this.edrpou.length : 0
          ]
        case 'personHandler': return [
            text.indexOf(this.lastName), 
            this.patronymic 
              ? text.indexOf(this.patronymic) + this.patronymic.length
              : this.firstName ? text.indexOf(this.firstName) + this.firstName.length : 0 
          ]
        case 'unLegalHandler': return [
            this.edrpou ? text.indexOf(this.edrpou) : 0, 
            this.edrpou ? text.indexOf(this.edrpou) + this.edrpou.length : 0
          ]
        case 'unPersonHandler': return [
            text.indexOf(this.transliterate(this.firstName)), 
            this.patronymic 
              ? text.indexOf(this.transliterate(this.patronymic)) + this.patronymic.length
              : this.lastName ? text.indexOf(this.transliterate(this.lastName)) + this.lastName.length : 0 
          ]
      }
    },
    markSearchedText(val /*, handler */) {
      let copy = JSON.parse(JSON.stringify(val))
      
      return copy.filter(v => v._id)
        .map(v => {
          // let arr = []
          // let text = v.text
          // let [start, end] = this.markText(handler, text)

          // arr.push(text.substring(0, start))
          // arr.push('<span class="search-text">' + text.substring(start, end) + '</span>')
          // arr.push(text.substring(end, text.length))
          // v.text = arr.join('')

          return v
        })
    },
    // listenPressKey(e) {
    //   if (e.keyCode === 13) {
    //     this.mapEdrLegal(/* clearData */ true)
    //   } else if (e.keyCode === 27) {
    //     this.dialog = false
    //   }
    // },
    setBaseUrl() {
      this.baseUrl = process.env.NODE_ENV === "development" 
        ? 'http://127.0.0.1:4000' 
        : 'https://94.131.243.7:4000'
    }
  },
  computed: {
    transliteRule() { return transliteRule },
    rnboVariant() {
      if (this.choosedPerson && this.rnboList.length > 0) return this.markSearchedText(this.rnboList, 'personHandler')
      if (this.choosedLegal && this.rnboList.length > 0) return this.markSearchedText(this.rnboList, 'legalHandler')
      return []
    },
    esVariant() {
      if (this.choosedPerson && this.esSanctionList.length > 0) return this.markSearchedText(this.esSanctionList, 'unPersonHandler')
      if (this.choosedLegal && this.esSanctionList.length > 0) return this.markSearchedText(this.esSanctionList, 'unLegalHandler')
      return []
    },
    requisites() {
      return this.choosedPerson 
        ? this.firstName && this.lastName
        : this.choosedLegal 
          ? this.edrpou || this.companyName
          : false
    },
    choosedPerson() {
      return this.searchVariant === 1
    },
    personInitials() {
      return this.searchType === "searchByInitials"
    },
    personInn() {
      return this.searchType === "searchByInn"
    },
    choosedLegal() {
      return this.searchVariant === 2
    },
    legalEdrpou() {
      return this.searchType === "searchByEdrpou"
    },
    /* Styles */
    cardOverflow() {
      return `
        position: relative; overflow-x: hidden; 
        overflow-y: scroll; background: #f5f0f0`
    },
    closeAbsBtn() {
      return `
        position: absolute; top: -35px; 
        right: ${this.$vuetify.breakpoint.xs ? '-8px' : '-28px;'}`
    },
    maxCardHeight() {
      return this.$vuetify.breakpoint.height / 10 * 9
    },
    // validations
    edrpouErr() { 
      const errors = []
      if (!this.$v.$invalid) return errors
      !this.$v.edrpou.required && errors.push('Невiрний код ЄДРПОУ')
      !this.$v.edrpou.minLength && errors.push('Не вiрна кiлькiсть знакiв')
      return errors
    }, 
    lastNameErr() {
      if (! this.$v.lastName.$error) return
      else return this.commonErr
    }, 
    firstNameErr() {
      if (! this.$v.firstName.$error) return
      else return this.commonErr
    }, 
    patronymicErr() {
      if (! this.$v.patronymic.$error) return
      else return this.commonErr
    },
    innErr() {
      if (! this.$v.inn.$error) return
      else return this.commonErr
    },
  }, 
  watch: {
    edrExpanded(val) {
      setTimeout(() => {
        if(val.length) this.edrExpandedW = true
        else this.edrExpandedW = false
      }, 0)
    },
    edrPersonExpanded(val) {
      setTimeout(() => {
        if(val.length) this.edrPersonExpandedW = true
        else this.edrPersonExpandedW = false
      }, 0)
    },
    pepExpanded(val) {
      setTimeout(() => {
        if(val.length) this.pepExpandedW = true
        else this.pepExpandedW = false
      }, 0)
    },
    unSancExpanded(val) {
      setTimeout(() => {
        if(val.length) this.unSancExpandedW = true
        else this.unSancExpandedW = false
      }, 0)
    },
    unTerrorExpanded(val) {
      setTimeout(() => {
        if(val.length) this.unTerrorExpandedW = true
        else this.unTerrorExpandedW = false
      }, 0)
    },
    usSanctionExpanded(val) {
      setTimeout(() => {
        if(val.length) this.usSanctionExpandedW = true
        else this.usSanctionExpandedW = false
      }, 0)
    },
    dialog(val) {
      if(!val) {
        this.currSection = null
        this.ukVersion = true
        this.showRequisite = false
      }
    },
    searchVariant() {
      this.searchType = null
    },
  },
  mounted() {
    window.addEventListener('keydown', this.listenPressKey)
    this.setBaseUrl()
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.listenPressKey)
  }
}

export { legal }