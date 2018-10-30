module.exports = class Parameter {
  constructor (options = {}) {
    options = Object.assign({ required: true, full: false, showUsage: true }, options)

    this.showUsage = options.showUsage

    this.whitelist = options.whitelist
    this.required = !!options.required
    this.full = !!options.full
    this.fullJoin = options.fullJoin
    this.missingError = options.missingError || 'errors:generic'

    // Flags
    this.name = options.name || 'parameter'
    this.aliases = options.aliases || []
  }

  parse (arg) {
    return arg
  }
}
