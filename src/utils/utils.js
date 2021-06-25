/** @return {string} */
function transliterate(str) {
    const letters = {
        ' ': ' ',
        'А': 'A',
        'Б': 'B',
        'В': 'V',
        'Г': 'H',
        'Ґ': 'G',
        'Д': 'D',
        'Е': 'E',
        'Є': 'YE',
        'Ж': 'ZH',
        'З': 'Z',
        'И': 'Y',
        'І': 'I',
        'Ї': 'YI',
        'Й': 'Y',
        'К': 'K',
        'Л': 'L',
        'М': 'M',
        'Н': 'N',
        'О': 'O',
        'П': 'P',
        'Р': 'R',
        'С': 'S',
        'Т': 'T',
        'У': 'U',
        'Ф': 'F',
        'Х': 'KH',
        'Ц': 'TS',
        'Ч': 'CH',
        'Ш': 'SH',
        'Щ': 'SHCH',
        'Ю': 'YU',
        'Я': 'YA'
    }

    if (!str) return ''
    if (typeof str !== 'string') return str
    if (str.match(/^[a-z]$/i)) {
        return str.toUpperCase()
    }
    
    let fI = {"Є": "IE", "Ї": "I", "Й": "I", "Ю": "IU", "Я": "IA"}
    str = str.toUpperCase().split("")
    str.forEach((v, i) => {
        if(Object.keys(fI).includes(v) && i !== 0) str.splice(i, 1, fI[v])
    })
    const result = str.join("")
        .replace(/зг/g, 'ZGH')
        .trim()
        .replace(/\s+/g, ' ')
        .split('')
        .map(char => letters[char] || char)
        .join("")
        .replace(/[^a-zA-Z-`\s0-9().,]/gu, '')

    return result
}

function emptyMessage() {
    const date = new Date().toLocaleDateString("RU")
    const str = (date) => `За результатами перевірки, станом на ${date} серед клієнтів відсутні особи, стосовно яких застосовані спеціальні економічні та інші обмежувальні заходи (санкції) відповідно до статті 5 Закону України "Про санкції"/ з переліку осіб, пов’язаних з провадженням терористичної діяльності або стосовно яких застосовано міжнародні санкції`
    return str(date)
}
function setPersonViewName(item) { 
    const p = item.person
    if (!p) return
    const rnbo = item?.validations?.rnbo?.length ? 'РНБО' : ''
    const terrors = item?.validations?.terrors?.length ? 'ДСФМУ' : ''
    const initials = `${p.lastName} ${p.firstName}${p.patronymic ? ' ' + p.patronymic : ''} ${p.inn ? p.inn : ''}`
    return `${initials}${rnbo && terrors ? ' (РНБО/ДСФМУ)' : rnbo ? ' (РНБО)' : terrors ? ' (ДСФМУ)' : ''}`
}
function setLegalViewName(item) {
    const l = item.company
    if (!l) return
    const rnbo = item?.validations?.rnbo?.length ? 'РНБО' : ''
    const terrors = item?.validations?.terrors?.length ? 'ДСФМУ' : ''
    const companyName = `${l.companyName ? l.companyName : ''} ${l.edrpou ? ' ' + l.edrpou : ''}`
    return `${companyName}${rnbo && terrors ? ' (РНБО/ДСФМУ)' : rnbo ? ' (РНБО)' : terrors ? ' (ДСФМУ)' : ''}`
}

const YourControlErrCodes = [
    // 'InvalidParameters',
    'Update in progress',
    'ForbiddenDueToRequestsLimit',
    'ForbiddenDueToIP',
    'ForbiddenDueToEndpoint',
    'NotFound',
]

const founderExceptions = [
    'КІНЦЕВИЙ БЕНЕФІЦІАРНИЙ ВЛАСНИК (КОНТРОЛЕР) - ВІДСУТНІЙ',
]

export {
    emptyMessage,
    transliterate,
    setPersonViewName, 
    setLegalViewName,
    YourControlErrCodes,
    founderExceptions,
}