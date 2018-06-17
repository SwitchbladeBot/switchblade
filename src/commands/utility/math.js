const { Command, SwitchbladeEmbed, Constants } = require('../../')
const math = require('mathjs')

module.exports = class Math extends Command {
  constructor (client) {
    super(client)
    this.name = 'math'
  }

  run (message, args, t) {
    let result
    const embed = new SwitchbladeEmbed(message.author)
    message.channel.startTyping()
    if (!args[0]) {
      embed.setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:math.noExpression'))
        .setDescription(`**${t('commons:usage')}:** ${process.env.PREFIX}${this.name} ${t('commands:math.commandUsage')}`)
    } else {
      try {
        result = math.eval(args.join(' '))
      } catch (error) {
        this.client.log(`${t('commands:math.failedCalculation')} ${args.join(' ')}\n${t('commons:error')}: ${error.stack}`, this.name)
        embed.setColor(Constants.ERROR_COLOR)
          .setTitle(t('commands:math.invalidExpression'))
          .setDescription(error.stack)
      } finally {
        if (isNaN(parseFloat(result))) {
          embed.setColor(Constants.ERROR_COLOR)
            .setTitle(t('commands:math.invalidExpression'))
            .setDescription(`**${t('commons:usage')}:** ${process.env.PREFIX}${this.name} ${t('commands:math.commandUsage')}`)
        } else {
          embed.setTitle(`${t('commands:math.result')}: \`${result}\``)
        }
      }
    }
    message.channel.send(embed).then(() => message.channel.stopTyping())
  }
}
