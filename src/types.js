/* eslint-disable no-unused-vars */
import {AxiosResponse} from 'axios'
/* eslint-enable no-unused-vars */

/** 
 * @typedef { object } initials
 * @property { string } lastName
 * @property { string } firstName
 * @property { string } patronymic
 * */

/**
 * @typedef {{
 *  name: string,
 *  code: ? string,
 *  address: string,
 *  capital: number,
 *  ownershipType: ? string,
 *  legalEntityInfluencer: ? string,
 *  country: ? string,
 *  type: number,
 * }} Founder
 */

/**
 * @typedef {{
 *  name: string,
 *  role: string,
 *  description: string,
 *  appointDate: ? string,
 *  raw: ? string,
 * }} Signer
 */

/** Using typeof */
/* eslint-disable no-unused-vars */
const data = {
  one: 1,
  two: "two",
}
/* eslint-enable no-unused-vars */

/**
 * @typedef {typeof data} MyData
 */

/**
 * @typedef {{
 *  phone: ? string,
 *  additionalPhone: ? string,
 *  fax: ? number,
 *  email: ? string,
 *  webSite: ? string,
 *  otherContacts: ? [],
 * }} Contact
 */

/**
 * @typedef {{
 *  code: string,
 *  establishment: string,
 *  registrationDate: string,
 *  registrationNumber: ? string,
 *  removalFromRegisterDate: ? string,
 *  removalFromRegisterNumber: ? string,
 *  departmentRegister: ? string,
 *  raw: ? string,
 * }} RegistrationAuthority
 */

/**
 * @typedef {{
 *  name: {
 *    fullName: string,
 *    shortName: string,
 *  },
 *  nameInEnglish: {
 *    fullName: string,
 *    shortName: string,
 *  },
 *  code: string | number,
 *  legalPersonName: string,
 *  legalForm: string,
 *  registrationViaReformation: ? [],
 *  branches: ? [],
 *  economicActivities: [
 *    {code: string, description: string}
 *  ],
 *  authorityInfo: string,
 *  managingGovernmentAuthority: ? [],
 *  founders: Array<Founder>,
 *  foundingCapital: {
 *    date: ? string,
 *    sum: number,
 *  },
 *  superiorManagement: {
 *    type: string,
 *  },
 *  foundingDocument: ? string,
 *  signers: Array<Signer>,
 *  deadOrMissingManagerInfo: ? string,
 *  modelStatuteMark: ? string,
 *  maxCreditorsClaimDate: ? string,
 *  bankruptcyStatus: ? number,
 *  registrationOfTerminationCancel: ? number,
 *  predecessors: ? [],
 *  assignees: ? [],
 *  contacts: Array<Contact>,
 *  registrationAfterLaw: {
 *    entryDate: string,
 *    entryNumber: string,
 *  }
 *  registrationBeforeLaw: ? {},
 *  foreclosureStartDates: ? [],
 *  mainEconomicActivity: {
 *    code: string,
 *    description: string,
 *  }
 *  terminationStatus: ? number,
 *  registrationOfTermination: ? {},
 *  financeMinistryRegistrationMaxDateOnAddressChange: ? {},
 *  status: string,
 *  actualDate: string,
 *  address: string,
 *  registrationAuthorities: Array<RegistrationAuthority>,
 *  singleTaxPayerInfo: {
 *    number: ? string,
 *    type: ? string,
 *  },
 *  contractorType: string,
 * }} EdrLegal
 */

/**
 * @typedef {{
 *  fullName: string,
 *  personInformation: string,
 *  sanctionsBasis: string | null,
 *  restrictiveMeasure: string,
 *  periodOfApplication: string,
 *  note: string | null,
 *  personCategory: string | null,
 *  source: string,
 *  documentBasis: string,
 * }} YourControlPerson
 */

/**
 * @typedef {{
 *  date: string,
 *  source: string,
 *  description: string,
 *  details: string,
 * }} YCSanctionEntity
 */
/**
 * @typedef {Array<{
 *  date: string,
 *  source: string,
 *  description: string,
 *  details: string,
 * }>} YourControlSanctions
 */

/**
 * @typedef {{
 *  data?: Array<YourControlPerson>,
 *  result?: Array<[]>,
 *  registryUpdateTime: string,
 * }} YourControlRNBOResult
 */

/**
 * @typedef {{
 *  currentDataUrl: string,
 *  status: string,
 * }} UpdateEdrLegal 
 * */

/**
 * @typedef {AxiosResponse<UpdateEdrLegal | EdrLegal>} AxiosService
 */

export default {}