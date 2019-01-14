const Parameter = require('./Parameter.js')
const CommandError = require('../../CommandError.js')
const Color = require('../../../../utils/Color.js')

module.exports = class ColorParameter extends Parameter {
  constructor (options = {}) {
    super(options)
  }

  parse (arg, { t }) {
    const color = new Color(arg)
    if (!color.valid) throw new CommandError(t('errors:invalidColor'))
    return color
  }
}
