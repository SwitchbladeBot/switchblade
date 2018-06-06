module.exports = class Parameter {
  constructor (options = {}) {
    options = Object.assign({required: true, full: false}, options)

    this.required = !!options.required
    this.full = !!options.full
    this.missingError = options.missingError || 'An error occured!'
    this.id = options.id || 'parameter'
  }

  parse (arg, error) {
    return arg
  }
}
