const CommandError = require('../CommandError.js')

const isNull = (n) => n === null || n === undefined
const funcOrString = (f, sf, ...args) => typeof f === 'function' ? f(...args) : sf ? sf(f) : f

/**
 * @constructor
 * @param {Command} command
 */
module.exports = class CommandParameters {
  constructor (command, ...params) {
    this.command = command

    this.flags = Array.isArray(params[params.length - 1]) ? params.pop() : null
    this.parameters = params || []
  }

  /**
   * @param {CommandContext} context The command context
   * @param {Array<string>} args Array of the command args
   */
  handle (context, args) {
    this.handleFlags(context, args)
    return this.handleArguments(context, args)
  }

  /**
   * @param {CommandContext} context The command context
   * @param {Array<string>} args Array of the command args
   */
  handleFlags (context, args) {
    if (this.flags) {
      const flagCheck = (a, f) => a.startsWith('--') && (a.startsWith(`--${f.name}`) || f.aliases.includes(a.substring(2)))
      const isFlag = (a) => this.flags.find(f => flagCheck(a, f))
      const firstFlagIndex = args.findIndex(isFlag)
      if (firstFlagIndex > -1) {
        const flagsObject = {}
        const error = this.flags.map(flag => {
          const flagIndex = args.findIndex(a => flagCheck(a, flag))
          if (flagIndex > -1) {
            const missingErr = funcOrString(flag.missingError, context.t, context)

            let flagValue = args[flagIndex + 1]
            if (flag.full) {
              const cutIndex = args.findIndex((a, i) => isFlag(a) && i > flagIndex)
              flagValue = args.slice(flagIndex + 1, cutIndex === -1 ? args.length : cutIndex).join(flag.fullJoin || ' ')
            }

            const parsedFlag = this.parseParameter(context, flag, flagValue, missingErr)
            flagsObject[flag.name] = parsedFlag
          }
        }).find(e => e)

        if (error) return error
        context.setFlags(flagsObject)
        args.splice(firstFlagIndex)
      }
    }
  }

  /**
   * @param {CommandContext} context The command context
   */
  handleArguments (context, args) {
    const parsedArgs = []
    for (let i = 0; i < this.parameters.length; i++) {
      const param = this.parameters[i]

      let arg = args[i]
      if (param.full) arg = args.slice(i).join(param.fullJoin || ' ')

      const parsedArg = this.parseParameter(context, param, arg, funcOrString(param.missingError, context.t, context))
      parsedArgs.push(parsedArg)
    }
    return parsedArgs
  }

  parseParameter (context, param, arg, missingErr) {
    const parsedArg = param.parse(arg, context)
    if (isNull(parsedArg) && param.required) {
      throw new CommandError(missingErr, param.showUsage)
    }

    if (!isNull(parsedArg)) {
      if (param.whitelist) {
        const whitelist = funcOrString(param.whitelist, null, parsedArg, context)
        const whitelisted = Array.isArray(whitelist) ? whitelist.includes(parsedArg) : !!whitelist
        if (!whitelisted) {
          throw new CommandError(missingErr, param.showUsage)
        }
      }
    }

    return parsedArg
  }
}
