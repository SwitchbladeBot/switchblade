const CommandError = require('../CommandError.js')
const Constants = require('../../../utils/Constants.js')
const SwitchbladeEmbed = require('../../SwitchbladeEmbed.js')

const isNull = (n) => n === null || n === undefined || n === NaN

module.exports = class CommandParameters {
  constructor (command, ...params) {
    this.command = command
    this.parameters = params || []
  }

  handle (message, args) {
    const parsedArgs = []
    for (let i = 0; i < this.parameters.length; i++) {
      const param = this.parameters[i]

      let arg = args[i]
      if (param.full) arg = args.join(' ')

      const parsedArg = param.parse(arg, message)
      if (parsedArg instanceof CommandError) {
        return parsedArg
      } else if (isNull(parsedArg) && param.required) {
        return new CommandError(param.missingError, true)
      }

      if (param.full) return parsedArg
      parsedArgs.push(parsedArg)
    }

    return parsedArgs
  }
}
