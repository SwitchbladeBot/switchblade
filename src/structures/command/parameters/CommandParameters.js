const CommandError = require('../CommandError.js')
const Parameter = require('./types/Parameter.js')

const ParameterTypes = require('./types')

const isNull = (n) => n === null || n === undefined
const funcOrString = (f, sf, ...args) => typeof f === 'function' ? f(...args) : sf ? sf(f) : f
const normalizeParam = (p) => {
  const type = ParameterTypes[p.type] || p.type
  if (!type || !(type.prototype instanceof Parameter)) throw new TypeError('Invalid parameter type')
  return { ...type.parseOptions(p), type }
}

/**
 * @constructor
 * @param {Command} command
 */
module.exports = class CommandParameters {
  static parseOptions (parameters = []) {
    return {
      flags: Array.isArray(parameters[parameters.length - 1]) ? parameters.pop().map(normalizeParam) : null,
      parameters: parameters.map(normalizeParam)
    }
  }

  /**
   * @param {CommandContext} context The command context
   * @param {Array<string>} args Array of the command args
   */
  static handle (context, options, args) {
    const opts = this.parseOptions(options)
    this.handleFlags(context, opts, args)
    return this.handleArguments(context, opts, args)
  }

  /**
   * @param {CommandContext} context The command context
   * @param {Array<string>} args Array of the command args
   */
  static handleFlags (context, opts, args) {
    if (opts.flags) {
      const flagIndex = args.findIndex(a => a.startsWith('--'))
      if (flagIndex > -1) {
        const [ , ...allFlags ] = args.splice(flagIndex).join(' ').split('--')
        const flagsObject = {}
        allFlags.map(s => s.trim().split(/[ \t]+/)).forEach(([ name, ...flagArgs ]) => {
          const flag = opts.flags.find(f => f.name === name || (f.aliases && f.aliases.includes(name)))
          if (!flag) return

          const flagValue = flagArgs.join(' ')
          const missingErr = funcOrString(flag.missingError, context.t, context)
          const parsedFlag = this.parseParameter(context, flag, flagValue, missingErr)
          flagsObject[flag.name] = parsedFlag
        })
        context.setFlags(flagsObject)
      }
    }
  }

  /**
   * @param {CommandContext} context The command context
   */
  static handleArguments (context, opts, args) {
    const parsedArgs = []

    const parseState = context.parseState = { argIndex: 0 }
    for (let i = 0; i < opts.parameters.length; i++) {
      const param = opts.parameters[i]

      let arg = args[parseState.argIndex]
      if (
        opts.parameters.length > args.length &&
        !param.required && parseState.argIndex === args.length - 1 &&
        opts.parameters.some((p, pi) => pi > i && p.required)
      ) {
        parsedArgs.push(undefined)
        continue
      }

      if (param.full) arg = args.slice(parseState.argIndex).join(param.fullJoin || ' ')

      const parsedArg = this.parseParameter(context, param, arg, funcOrString(param.missingError, context.t, context))
      parsedArgs.push(parsedArg)
      parseState.argIndex++
    }
    delete context.parseState

    return parsedArgs
  }

  static parseParameter (context, param, arg, missingErr) {
    const parsedArg = param.type._parse(arg, param, context)
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
