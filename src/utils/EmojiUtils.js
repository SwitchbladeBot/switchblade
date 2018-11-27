const Constants = require('./Constants.js')

module.exports = class EmojiUtils {
  /**
   * Returns either a country's flag emoji based on its alpha-2 country code or an empty flag if no country is passed.
   * @param {String} [countryCode] - Alpha-2 country code
   */
  static getFlag (countryCode) {
    if (countryCode) return `:flag_${countryCode.toLowerCase()}:`
    return Constants.UNKNOWN_COUNTRY_FLAG
  }
}
