import pdfMake from "pdfmake/build/pdfmake"
import pdfFonts from "pdfmake/build/vfs_fonts"
import { layout } from './content'
pdfMake.vfs = pdfFonts.pdfMake.vfs

function download(obj, params, fileName = 'Результат перевiрки.pdf') {
  // @ts-ignore
  return pdfMake.createPdf(docDefinition(obj, params)).download(fileName)
}
function open(obj, params) {
  // @ts-ignore
  return pdfMake.createPdf(docDefinition(obj, params)).open()
}
function openInSameWindow(obj, params) {
  // @ts-ignore
  return pdfMake.createPdf(docDefinition(obj, params)).open({}, window)
}
function print(obj, params) {
  // @ts-ignore
  return pdfMake.createPdf(docDefinition(obj, params)).print()
}
function getAsBase64(obj, params) {
  // @ts-ignore
  const pdfDocGenerator = pdfMake.createPdf(docDefinition(obj, params))
  /** @type {string} */
  return new Promise(
    resolve => { pdfDocGenerator.getBase64(v => resolve(v)) }
  )
}
function docDefinition(obj, params) {
  return {
    pageMargins: [35, 30, 35, 30],
    content: [...layout(obj, params)],
  }
}

export {
  download, 
  open, 
  openInSameWindow, 
  print, 
  getAsBase64,
}