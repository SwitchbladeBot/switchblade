const CommandError = require('../CommandError.js')

const isNull = (n) => n === null || n === undefined
const funcOrString = (f, sf, ...args) => typeof f === 'function' ? f(...args) : sf ? sf(f) : f

module.exports = class CommandParameters {
  constructor (command, ...params) {
    this.command = command
    this.parameters = params || []
  }

  handle (context, args) {
    const parsedArgs = []
    for (let i = 0; i < this.parameters.length; i++) {
      const param = this.parameters[i]

      let arg = args[i]
      if (param.full) arg = args.slice(i).join(param.fullJoin || ' ')

      const missingErr = funcOrString(param.missingError, context.t, context)

      const parsedArg = param.parse(arg, context)
      if (parsedArg instanceof CommandError) {
        parsedArg.showUsage = param.showUsage
        return parsedArg
      } else if (isNull(parsedArg) && param.required) {
        return new CommandError(missingErr, param.showUsage)
      }

      if (param.whitelist) {
        const whitelist = funcOrString(param.whitelist, null, parsedArg, context)
        const whitelisted = Array.isArray(whitelist) ? whitelist.includes(parsedArg) : !!whitelist
        if (!whitelisted) {
          return new CommandError(missingErr, param.showUsage)
        }
      }

      parsedArgs.push(parsedArg)
    }

    return parsedArgs.length > 1 ? parsedArgs : parsedArgs[0]
  }
}
