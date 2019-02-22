const { Command, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class Rep extends Command {
  constructor (client) {
    super(client, {
      name: 'rep',
      aliases: ['reputation'],
      category: 'social',
      requirements: { databaseOnly: true, onlyOldAccounts: true },
      parameters: [{
        type: 'user',
        acceptBot: false,
        acceptSelf: false,
        missingError: 'commands:rep.noMention',
        errors: { acceptSelf: 'commands:rep.repYourself' }
      }]
    })
  }

  async run ({ t, author, channel }, user) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()

    try {
      await this.client.modules.social.addReputation(author.id, user.id)
      embed.setDescription(t('commands:rep.reputationPoint', { user }))
    } catch (e) {
      embed.setColor(Constants.ERROR_COLOR)
      switch (e.message) {
        case 'IN_COOLDOWN':
          embed.setTitle(t('commands:rep.alreadyGave'))
            .setDescription(t('commands:rep.againIn', { time: e.formattedCooldown }))
          break
        default:
          embed.setTitle(t('errors:generic'))
      }
    }

    channel.send(embed).then(() => channel.stopTyping())
  }
}
