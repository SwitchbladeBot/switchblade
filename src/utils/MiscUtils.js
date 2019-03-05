const moment = require('moment')
const Intl = require('intl')
Intl.__disableRegExpRestore()

module.exports = class MiscUtils {
  static findArrayDuplicates (arr) {
    return arr.filter((value, index) => {
      return arr.indexOf(value) !== index
    })
  }

  static formatNumber (value, language) {
    const formatter = new Intl.NumberFormat(language)
    return formatter.format(value)
  }

  static formatDuration (duration) {
    return moment.duration(duration).format('hh:mm:ss', { stopTrim: 'm' })
  }

  static capitalizeFirstLetter (string, everyWord = false) {
    const capitalizeWord = w => w.charAt(0).toUpperCase() + w.slice(1)
    if (everyWord) return string.split(' ').map(capitalizeWord).join(' ')
    return capitalizeWord(string)
  }
}
