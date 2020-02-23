const { Command, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class Daily extends Command {
  constructor (client) {
    super({
      name: 'daily',
      category: 'economy',
      requirements: { databaseOnly: true }
    }, client)
  }

  async run ({ t, author, channel }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()

    try {
      const { collectedMoney } = await this.client.controllers.economy.bonus.claimDaily(author.id)
      embed.setDescription(t('commands:daily.claimedSuccessfully', { count: collectedMoney }))
    } catch (e) {
      embed.setColor(Constants.ERROR_COLOR)
      switch (e.message) {
        case 'ALREADY_CLAIMED':
          embed.setTitle(t('commands:daily.alreadyClaimedTitle'))
            .setDescription(t('commands:daily.alreadyClaimedDescription', { time: e.formattedCooldown }))
          break
        default:
          embed.setTitle(t('errors:generic'))
      }
    }

    channel.send(embed).then(() => channel.stopTyping())
  }
}
