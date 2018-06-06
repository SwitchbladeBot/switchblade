const ParameterError = require('./ParameterError.js')
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

      let arg = args[i]
      if (param.full) arg = args.join(' ')

      const parsedArg = param.parse(arg, error)
      if (parsedArg instanceof ParameterError) {
        error(parsedArg.message, parsedArg.showUsage)
        return null
      } else if (!parsedArg && param.required) {
        error(param.missingError, true)
        return null
      }
      parsedArgs.push(parsedArg)
    }

    return parsedArgs
  }

  errorMessageFactory (message) {
    return (title, showUsage, customize) => {
      customize = customize || ((e) => e)
      const embed = new SwitchbladeEmbed(message.author)
        .setColor(Constants.ERROR_COLOR)
        .setTitle(title)
      if (showUsage) {
        const params = this.parameters.map(p => '<' + p.id + '>').join(' ')
        embed.setDescription(`**Usage:** \`${process.env.PREFIX}${this.command.name} ${params}\``)
      }
      return message.channel.send(customize(embed))
        .then(() => message.channel.stopTyping())
    }
  }
}
