const PlaceholderRules = require('./PlaceholderRules')

module.exports = class PlaceholderUtils {
  static parse (text, context, whitelist, blacklist) {
    return PlaceholderRules.reduce((t, r) => {
      if (Array.isArray(whitelist) && !whitelist.includes(r.name)) return t
      if (Array.isArray(blacklist) && blacklist.includes(r.name)) return t

      const regex = r.regex || new RegExp(`{${r.name}}`, 'g')
      return t.replace(regex, r.replace.bind(null, context))
    }, text)
  }
}
