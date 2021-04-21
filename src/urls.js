/** 
 * @param { string | number } edrpou 
 * @param { string | number } apiKey
 * */
const urlGetEdrLegalByEdrpou = (edrpou, apiKey) => `https://api.youscore.com.ua/v1/usr/${edrpou}?showCurrentData=false&apiKey=${apiKey}`

/**
 * @param { string } lastName 
 * @param { string } firstName 
 * @param { string } patronimyc 
 */
const urlGetEdrLegalByInitials = (lastName, firstName, patronimyc) => `https://api.youscore.com.ua/${lastName}-${firstName}-${patronimyc}`

/**  @param { string | number } inn */
const urlGetEdrPersonByINN = (inn) => `https://api.youscore.com.ua/${inn}`

/** @param { string } baseUrl */
const urlGetEdrPersonByInitials = (baseUrl) => `${baseUrl}/get-edr-initial`

export {
  urlGetEdrLegalByEdrpou,
  urlGetEdrLegalByInitials,
  urlGetEdrPersonByINN,
  urlGetEdrPersonByInitials,
}