const Constants = require('./Constants.js')

module.exports = class EmojiUtils {
  static getFlag (countryCode) {
    if (countryCode) return `:flag_${countryCode.toLowerCase()}:`
    return Constants.UNKNOWN_COUNTRY_FLAG
  }
}