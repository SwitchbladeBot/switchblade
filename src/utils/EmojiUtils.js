const { Constants } = require('../')

module.exports = class EmojiUtils {
  static getFlag (countryCode) {
    if (countryCode) `:flag_${countryCode.toLowerCase()}:`
    return Constants.UNKNOWN_COUNTRY_FLAG
  }
}