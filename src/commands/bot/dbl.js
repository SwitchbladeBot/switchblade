const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandRequirements } = CommandStructures

module.exports = class DBL extends Command {
  constructor (client) {
    super(client)
    this.name = 'dbl'
    this.alias = ['discordbotlist', 'vote']
    this.category = 'bot'

    this.requirements = new CommandRequirements(this, { databaseOnly: true, apis: ['dbl'] })
  }

  async run ({ t, author, channel, prefix, alias }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()

    try {
      const { collectedMoney } = await this.client.modules.economy.bonus.claimDaily(author.id)
      embed.setDescription(t('commands:dbl.thanksForVoting', { count: collectedMoney }))
    } catch (e) {
      embed.setColor(Constants.ERROR_COLOR)
      switch (e.message) {
        case 'ALREADY_CLAIMED':
          embed.setTitle(t('commands:dbl.alreadyClaimed'))
            .setDescription(t('commons:youCanDoItAgainIn', { time: e.formattedCooldown }))
          break
        case 'NOT_VOTED':
          embed.setDescription(t('commands:dbl.howToVote', { link: `https://discordbots.org/bot/${this.client.user.id}/vote`, command: `${prefix}${alias || this.name}` }))
          break
        default:
          embed.setTitle(t('errors:generic'))
      }
    }

    channel.send(embed).then(() => channel.stopTyping())
  }
}
