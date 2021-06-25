/* eslint-disable */
import { tables } from './tables' 

const layout = (o, params) => {
  return [ 
    { text: `Результат перевiрки за ${new Date().toLocaleDateString("RU")}`, fontSize: 11 },
    ...tables(o, params).personRnboTable,
    ...tables(o, params).personTerrorsTable,
    ...tables(o, params).legalTerrorsTable,
    ...tables(o, params).legalRnboTable,
    tables(o, params).zeroResult,
  ]
}


export { layout }