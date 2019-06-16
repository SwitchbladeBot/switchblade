const Parameter = require('./Parameter.js')
const CommandError = require('../../CommandError.js')
const { URL } = require('url')

module.exports = class URLParameter extends Parameter {
  static parse (arg, { t }) {
    if (!arg) return

    try {
      return new URL(arg)
    } catch (e) {
      throw new CommandError(t('errors:invalidURL'))
    }
  }
}
