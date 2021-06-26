import { setPersonViewName, setLegalViewName, emptyMessage, getDate } from '../../utils/utils'
/* eslint-disable */
const personTerrorsHeader = [
  { text: 'ПIБ', fontSize: 7, alignment: 'center', margin: [0, 3, 0, 2], bold: true, color: '#313131' },
  { text: 'Додаткова iнформацiя', fontSize: 7, alignment: 'center', margin: [0, 3, 0, 2], bold: true, color: '#313131' },
  { text: 'Також вiдомий як', fontSize: 7, alignment: 'center', margin: [0, 3, 0, 2], bold: true, color: '#313131' },
  { text: 'Документ', fontSize: 7, alignment: 'center', margin: [0, 3, 0, 2], bold: true, color: '#313131' },
  { text: 'Нацiональнiсть', fontSize: 7, alignment: 'center', margin: [0, 3, 0, 2], bold: true, color: '#313131' },
  { text: 'Дата внесення', fontSize: 7, alignment: 'center', margin: [0, 3, 0, 2], bold: true, color: '#313131' },
]
const personRnboHeader = [
  { text: 'ПIБ', fontSize: 7, alignment: 'center', margin: [0, 3, 0, 2], bold: true, color: '#313131' },
  { text: 'Обмеження', fontSize: 7, alignment: 'center', margin: [0, 3, 0, 2], bold: true, color: '#313131' },
  { text: 'Термiн дiї', fontSize: 7, alignment: 'center', margin: [0, 3, 0, 2], bold: true, color: '#313131' },
  { text: 'Дата завершення дії обмежень', fontSize: 7, alignment: 'center', margin: [0, 3, 0, 2], bold: true, color: '#313131' },
  { text: 'Номер указу', fontSize: 7, alignment: 'center', margin: [0, 3, 0, 2], bold: true, color: '#313131' },
  { text: 'Дата указу', fontSize: 7, alignment: 'center', margin: [0, 3, 0, 2], bold: true, color: '#313131' },
]

const legalTerrorsHeader = [
  { text: 'Органiзацiя', fontSize: 7, alignment: 'center', margin: [0, 3, 0, 2], bold: true, color: '#313131' },
  { text: 'Додаткова iнформацiя', fontSize: 7, alignment: 'center', margin: [0, 3, 0, 2], bold: true, color: '#313131' },
  { text: 'Вiдомi назви', fontSize: 7, alignment: 'center', margin: [0, 3, 0, 2], bold: true, color: '#313131' },
  { text: 'Документ', fontSize: 7, alignment: 'center', margin: [0, 3, 0, 2], bold: true, color: '#313131' },
  { text: 'Дата внесення', fontSize: 7, alignment: 'center', margin: [0, 3, 0, 2], bold: true, color: '#313131' },
]

const legalRnboHeader = [
  { text: 'Органiзацiя', fontSize: 7, alignment: 'center', margin: [0, 3, 0, 2], bold: true, color: '#313131' },
  { text: 'Обмеження', fontSize: 7, alignment: 'center', margin: [0, 3, 0, 2], bold: true, color: '#313131' },
  { text: 'Термiн дiї', fontSize: 7, alignment: 'center', margin: [0, 3, 0, 2], bold: true, color: '#313131' },
  { text: 'Дата завершення дії обмежень', fontSize: 7, alignment: 'center', margin: [0, 3, 0, 2], bold: true, color: '#313131' },
  { text: 'Номер указу', fontSize: 7, alignment: 'center', margin: [0, 3, 0, 2], bold: true, color: '#313131' },
  { text: 'Дата указу', fontSize: 7, alignment: 'center', margin: [0, 3, 0, 2], bold: true, color: '#313131' },
]

function tables(o, params) {
  if (typeof o !== 'object' || o === null) {
    throw new TypeError('invalid parameter. Should be object: ' + typeof o)
  }
  if (!params?.entity) {
    throw new ReferenceError('entity parameter required: ' + params?.entity || typeof params?.entity)
  }
  if (params?.entity !== 'legal' && params?.entity !== 'person') {
    throw new Error('params.entity should be "legal" or "person"')
  }

  const getPersonTerrorBody = (obj) => {
    return obj.validations.terrors.filter(o => typeof o === 'object' && o !== null)
      .map(o => ({
        name: setPersonViewName(obj),
        body: [
          { text: o.fullName || '---', fontSize: 8, margin: [1, 2, 1, 3] },
          { text: o.comments || '---', fontSize: 8, margin: [1, 2, 1, 3] },
          { text: o.alsoKnown || '---', fontSize: 8, margin: [1, 2, 1, 3] },
          { text: o['program-entry'] || '---', fontSize: 8, margin: [1, 2, 1, 3], alignment: 'center' },
          { text: o['nationality-list'] || '---', fontSize: 8, margin: [1, 2, 1, 3], alignment: 'center' },
          { text: getDate(o['date-entry']) || '---', fontSize: 8, margin: [1, 2, 1, 3], alignment: 'center' },
        ]
      }))
  }

  const getPersonRnboBody = (obj) => {
    return obj.validations.rnbo.filter(o => typeof o === 'object' && o !== null)
      .map(o => ({
        name: setPersonViewName(obj),
        body: [
          { text: o.name_ukr || '---', fontSize: 8, margin: [1, 2, 1, 3] },
          { text: o.restriction_type || '---', fontSize: 8, margin: [1, 2, 1, 3] },
          { text: o.restriction_period || '---', fontSize: 8, margin: [1, 2, 1, 3], alignment: 'center' },
          { text: o.restriction_end_date || '---', fontSize: 8, margin: [1, 2, 1, 3], alignment: 'center' },
          { text: o.ukaz_id || '---', fontSize: 8, margin: [1, 2, 1, 3], alignment: 'center' },
          { text: o.ukaz_date || '---', fontSize: 8, margin: [1, 2, 1, 3], alignment: 'center' },
        ]
      }))
  }

  const getLegalTerrors = (obj) => {
    return obj.validations.terrors.filter(o => typeof o === 'object' && o !== null)
      .map(o => ({
        name: setLegalViewName(obj),
        body: [
          { text: o.fullName || '---', fontSize: 8, margin: [1, 2, 1, 3] },
          { text: o.comments || '---', fontSize: 8, margin: [1, 2, 1, 3] },
          { text: o.alsoKnown || '---', fontSize: 8, margin: [1, 2, 1, 3] },
          { text: o['program-entry'] || '---', fontSize: 8, margin: [1, 2, 1, 3] },
          { text: getDate(o['date-entry']) || '---', fontSize: 8, margin: [1, 2, 1, 3] },
        ]
      }))
  }

  const getLegalRnbo = (obj) => {
    return obj.validations.rnbo.filter(o => typeof o === 'object' && o !== null)
      .map(o => ({
        name: setLegalViewName(obj),
        body: [
          { text: o.name_ukr || '---', fontSize: 8, margin: [1, 2, 1, 3] },
          { text: o.restriction_type || '---', fontSize: 8, margin: [1, 2, 1, 3] },
          { text: o.restriction_period || '---', fontSize: 8, margin: [1, 2, 1, 3] },
          { text: o.restriction_end_date || '---', fontSize: 8, margin: [1, 2, 1, 3] },
          { text: o.ukaz_id || '---', fontSize: 8, margin: [1, 2, 1, 3] },
          { text: o.ukaz_date || '---', fontSize: 8, margin: [1, 2, 1, 3] },
        ]
      }))
  }  

  const personTerrorsBody = Object.keys(o)
    .filter(k => o[k].validations.terrors)
    .map(k => getPersonTerrorBody(o[k]))
    .filter(a => a.length)
  
  const personRnboBody = Object.keys(o)
    .filter(k => o[k].validations.rnbo)
    .map(k => getPersonRnboBody(o[k]))
    .filter(a => a.length)
  
  const legalTerrorsBody = Object.keys(o)
    .filter(k => o[k].validations.terrors)
    .map(k => getLegalTerrors(o[k]))
    .filter(a => a.length)
  
  const legalRnboBody = Object.keys(o)
    .filter(k => o[k].validations.rnbo)
    .map(k => getLegalRnbo(o[k]))
    .filter(a => a.length)

  const personTerrorsTable = () => {
    if (personTerrorsBody.length && params.entity === 'person') {
      return personTerrorsBody.map(person => [
        { text: ' ', fontSize: 19 },
        { text: person[0].name, fontSize: 8, bold: true },
        { text: ' ', fontSize: 6 },
        {
          layout: {
            vLineWidth: () => 0.1,
            hLineWidth: () => 0.1,
            hLineColor: () => '#707070',
            vLineColor: () => '#707070',
          },
          text: ' ',
          table: {
            headerRows: 1,
            style: { fontSize: 6 },
            widths: [ '16.6%', '41.5%', '11.7%', '10.7%', '10.7%', '10.7%' ],
            body: 
            [
              JSON.parse(JSON.stringify(personTerrorsHeader)),
              ...person.map(v => v.body),
            ],
          }
        }
      ])
    } else return []
  }

  const personRnboTable = () => {
    if (personRnboBody.length && params.entity === 'person') {
      return personRnboBody.map(person => [
        { text: ' ', fontSize: 19 },
        { text: person[0].name, fontSize: 8, bold: true },
        { text: ' ', fontSize: 6 },
        {
          layout: {
            vLineWidth: () => 0.1,
            hLineWidth: () => 0.1,
            hLineColor: () => '#707070',
            vLineColor: () => '#707070',
          },
          table: {
            headerRows: 1,
            style: { fontSize: 6 },
            widths: [ '16.6%', '41.5%', '11.7%', '10.7%', '10.7%', '10.7%' ],
            body: 
            [
              JSON.parse(JSON.stringify(personRnboHeader)),
              ...person.map(v => v.body),
            ],
          }
        }
      ]) 
    } else return []
  }

  const legalTerrorsTable = () => {
    if (legalTerrorsBody.length && params.entity === 'legal') {
      return legalTerrorsBody.map(company => [
        { text: ' ', fontSize: 19 },
        { text: company[0].name, fontSize: 8, bold: true },
        { text: ' ', fontSize: 6 },
        {
          layout: {
            vLineWidth: () => 0.1,
            hLineWidth: () => 0.1,
            hLineColor: () => '#707070',
            vLineColor: () => '#707070',
          },
          table: {
            headerRows: 1,
            style: { fontSize: 6 },
            widths: [ '16.6%', '41.5%', '21.4%', '10.25%', '10.25%'],
            body: 
            [
              JSON.parse(JSON.stringify(legalTerrorsHeader)),
              ...company.map(v => v.body),
            ],
          }
        }
      ])
    } else return []
  }

  const legalRnboTable = () => {
    if (legalRnboBody.length && params.entity === 'legal') {
      return legalRnboBody.map(company => [
        { text: ' ', fontSize: 19 },
        { text: company[0].name, fontSize: 8, bold: true },
        { text: ' ', fontSize: 6 },
        {
          layout: {
            vLineWidth: () => 0.1,
            hLineWidth: () => 0.1,
            hLineColor: () => '#707070',
            vLineColor: () => '#707070',
          },
          table: {
            headerRows: 1,
            style: { fontSize: 6 },
            widths: [ '16.6%', '41.5%', '11.7%', '10.7%', '10.7%', '10.7%' ],
            body: 
            [
              JSON.parse(JSON.stringify(legalRnboHeader)),
              ...company.map(v => v.body),
            ],
          }
        }
      ]) 
    } else return []
  }

  const emptyMsg = [
    ' ',
    { text: emptyMessage(), fontSize: 9 }
  ]
  const zeroResult = !personTerrorsTable()?.length && !personRnboTable()?.length && !legalTerrorsTable()?.length && !legalRnboTable()?.length ? emptyMsg : ''
  
  return {
    personTerrorsTable: personTerrorsTable(),
    personRnboTable: personRnboTable(),
    legalTerrorsTable: legalTerrorsTable(),
    legalRnboTable: legalRnboTable(),
    zeroResult: zeroResult,
  }
}

export { tables }