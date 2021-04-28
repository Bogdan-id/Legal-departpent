function toggleDescription(array, key) {
  if (array.includes(key)) {
    const clearedArr = array.filter(k => key !== k)
    array.splice(0)
    array.push(...clearedArr)
  } else array.push(key)
}
function setText(text, key) {
  if (! text) return
  let splitedSting = text.split(" ").filter(str => str)
  const initialsArr = splitedSting.filter((_, k) => k <= 2)
  splitedSting = splitedSting.filter((item, k) => k >= 2 && !initialsArr.includes(item))
  const finalString = "<span>" + (parseInt(key) + 1) + ". " + initialsArr.join(" ") + " </span>" + "<span>" + splitedSting.join(" ") + "</span>"
  return finalString
}
function getCategoryName (data) {
  switch (true) {
    case data.includes("initials"): return "ПIБ"
    case data.includes("lastFirstName"): return "Прiзвищем та iм`ям"
    case data.includes("lastName"): return "Прiзвищем"
    case data.includes("firstName"): return "Iм`ям"
    case data.includes("patronymic"): return "По батьковi"
  }
}

export {
  toggleDescription,
  getCategoryName,
  setText,
}