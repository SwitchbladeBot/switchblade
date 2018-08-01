const CommandError = require('../CommandError.js')

const isNull = (n) => n === null || n === undefined
const funcOrString = (f, sf, ...args) => typeof f === 'function' ? f(...args) : sf ? sf(f) : f

module.exports = class CommandParameters {
  constructor (command, ...params) {
    this.command = command

    this.flags = Array.isArray(params[params.length - 1]) ? params.pop() : null
    this.parameters = params || []
  }

  handle (context, args) {
    const flagsError = this.handleFlags(context, args)
    if (flagsError) return flagsError

    return this.handleArguments(context, args)
  }

  handleFlags (context, args) {
    if (this.flags) {
      const flagCheck = (a, f) => a.startsWith('--') && (a.startsWith(`--${f.name}`) || f.aliases.includes(a.substring(2)))
      const isFlag = (a) => this.flags.find(f => flagCheck(a, f))
      const firstFlagIndex = args.findIndex(isFlag)
      if (firstFlagIndex > -1) {
        const flagsObject = {}
        const error = this.flags.map(flag => {
          const flagIndex = args.findIndex(a => flagCheck(a, flag))
          if (flagIndex) {
            const missingErr = funcOrString(flag.missingError, context.t, context)

            let flagValue = args[flagIndex + 1]
            if (flag.full) {
              const cutIndex = args.findIndex((a, i) => isFlag(a) && i > flagIndex)
              flagValue = args.slice(flagIndex + 1, cutIndex === -1 ? args.length : cutIndex).join(flag.fullJoin || ' ')
            }

            const parsedFlag = this.parseParameter(context, flag, flagValue, missingErr)
            if (parsedFlag instanceof CommandError) return parsedFlag
            flagsObject[flag.name] = parsedFlag
          }
        }).find(e => e)

        if (error) return error
        context.setFlags(flagsObject)
        args.splice(firstFlagIndex)
      }
    }
  }

  handleArguments (context, args) {
    const parsedArgs = []
    for (let i = 0; i < this.parameters.length; i++) {
      const param = this.parameters[i]

      let arg = args[i]
      if (param.full) arg = args.slice(i).join(param.fullJoin || ' ')

      const parsedArg = this.parseParameter(context, param, arg, funcOrString(param.missingError, context.t, context))
      if (parsedArg instanceof CommandError) return parsedArg
      parsedArgs.push(parsedArg)
    }
    return parsedArgs
  }

  parseParameter (context, param, arg, missingErr) {
    const parsedArg = param.parse(arg, context)
    if (parsedArg instanceof CommandError) {
      parsedArg.showUsage = param.showUsage
      return parsedArg
    } else if (isNull(parsedArg) && param.required) {
      return new CommandError(missingErr, param.showUsage)
    }

    if (!isNull(parsedArg)) {
      if (param.whitelist) {
        const whitelist = funcOrString(param.whitelist, null, parsedArg, context)
        const whitelisted = Array.isArray(whitelist) ? whitelist.includes(parsedArg) : !!whitelist
        if (!whitelisted) {
          return new CommandError(missingErr, param.showUsage)
        }
      }
    }

    return parsedArg
  }
}
