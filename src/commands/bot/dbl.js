const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandRequirements } = CommandStructures
const moment = require('moment')
const snekfetch = require('snekfetch')

module.exports = class DBL extends Command {
  constructor (client) {
    super(client)
    this.name = 'dbl'
    this.alias = ['discordbotlist', 'vote']
    this.category = 'bot'

    this.requirements = new CommandRequirements(this, { databaseOnly: true, apis: ['dbl'] })
  }

  async run ({ t, author, channel, prefix, alias, userDocument }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()

    try {
      const { collectedMoney } = await this.client.modules.economy.bonus.claimDBLBonus(author.id)
      embed.setDescription(t('commands:dbl.thanksForVoting', { count: collectedMoney }))
    } catch (e) {
      switch (e.message) {
        case 'ALREADY_CLAIMED':
          embed.setTitle(t('commands:dbl.alreadyClaimed'))
            .setDescription(t('commons:youCanDoItAgainIn', { time: e.formattedCooldown }))
            .setColor(Constants.ERROR_COLOR)
          break
        case 'NOT_VOTED':
          embed.setDescription(t('commands:dbl.howToVote', { link: `https://discordbots.org/bot/${this.client.user.id}/vote`, command: `${prefix}${alias || this.name}` }))
          break
        default:
          embed.setTitle(t('errors:generic'))
            .setColor(Constants.ERROR_COLOR)
      }
    }

    channel.send(embed).then(() => channel.stopTyping())
  }
}
