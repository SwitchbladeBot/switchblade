const Constants = require('../../utils/Constants.js')
const SwitchbladeEmbed = require('../SwitchbladeEmbed.js')

module.exports = class CommandParameters {
  constructor (command, ...params) {
    this.command = command
    this.parameters = params || []
  }

  handle (message, args) {
    const error = this.errorMessageFactory(message)

    const parsedArgs = []
    for (let i = 0; i < this.parameters.length; i++) {
      const param = this.parameters[i]
      const arg = args[i]

      if (!arg && param.required) {
        error('missing ' + i)
        return null
      }

      if (param.full) {
        return param.parse(args.join(' '), error)
      } else {
        const parsedArg = param.parse(arg, error)
        if (parsedArg) parsedArgs.push(parsedArg)
        else return null
      }
    }

    return parsedArgs
  }

  errorMessageFactory (message) {
    return (description, customize) => {
      customize = customize || ((e) => e)
      return message.channel.send(
        customize(new SwitchbladeEmbed(message.author)
          .setColor(Constants.ERROR_COLOR)
          .setTitle(description))
      ).then(() => message.channel.stopTyping())
    }
  }
}
