function toggleDescription (array, key) {
  if (array.includes(key)) {
    const clearedArr = array.filter(k => key !== k)
    array.splice(0)
    array.push(...clearedArr)
  } else array.push(key)
}
function getText (text, initials) {
  if (! text) return
  const initialsArr = initials.split(" ")
  let splitedString = text.split(" ")
    splitedString = splitedString.filter((item, k) => k >= 2 && !initialsArr.includes(item))
  return splitedString.join(" ")
}
function getInitials (text) {
  if (! text) return
  let splitedString = text.split(" ").filter(str => str)
  const initialsArr = splitedString.filter((_, k) => k <= 2)
  return initialsArr.join(" ")
}
function getCategoryName (data) {
  if (! data) return
  switch (true) {
    case data.includes("initials"): return "ПIБ"
    case data.includes("lastFirstName"): return "Прiзвище та iм`я"
    case data.includes("lastName"): return "Прiзвище"
    case data.includes("firstName"): return "Iм`я"
    case data.includes("patronymic"): return "По батьковi"
    default: ""
  }
}

export {
  toggleDescription,
  getCategoryName,
  getInitials,
  getText,
}