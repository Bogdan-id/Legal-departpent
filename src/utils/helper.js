'use-strict'
// @ts-check

function trimExceededLength(elId, maxLength, callback) {
  let el = /** @type {HTMLInputElement} */ (document.getElementById(elId))
  let event = new Event('input', {bubbles: true})
  if(el.value && typeof callback === "function") {
    if(el.value !== callback(el.value)) {
      el.value = callback(el.value)
      el.dispatchEvent(event)
    }
  }
  if(el.value && el.value.length > maxLength) {
    el.value = el.value.substr(0, maxLength)
    el.dispatchEvent(event)
  }
}

export {
  trimExceededLength,
}