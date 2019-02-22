const defVal = (o, k, d) => typeof o[k] === 'undefined' ? d : o[k]

module.exports = class Parameter {
  static parseOptions (options = {}) {
    return {
      required: defVal(options, 'required', true),
      showUsage: defVal(options, 'showUsage', true),
      full: !!options.full,
      whitelist: options.whitelist,
      fullJoin: options.fullJoin,
      missingError: options.missingError || 'errors:generic',

      // Flags
      name: options.name,
      aliases: options.aliases
    }
  }

  static _parse (arg, options, context) {
    return this.parse.call(options, arg, context)
  }

  static parse (arg) {
    return arg
  }
}
