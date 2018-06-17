const { Command, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class EightBall extends Command {
  constructor (client) {
    super(client)
    this.name = '8ball'
    this.aliases = ['eightball', '8b', 'magicball']
  }

  run (message, args, t) {
    const answerCount = 19
    const embed = new SwitchbladeEmbed(message.author)
    message.channel.startTyping()
    if (!args[0]) {
      embed.setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:8ball.noQuestion'))
        .setDescription(`**${t('commons:usage')}:** ${process.env.PREFIX}${this.name} ${t('commands:8ball.commandUsage')}`)
    } else {
      const result = Math.floor((Math.random() * answerCount))
      embed.setColor(Constants.EIGHTBALL_COLOR)
        .setDescription(`:grey_question: ${args.join(' ')}\n:8ball: ${t(`commands:8ball.answers.${result}`)}`)
    }
    message.channel.send(embed).then(() => message.channel.stopTyping())
  }
}
