const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandRequirements } = CommandStructures

module.exports = class Daily extends Command {
  constructor (client) {
    super(client)
    this.name = 'daily'
    this.category = 'economy'

    this.requirements = new CommandRequirements(this, { guildOnly: true, databaseOnly: true })
  }

  async run ({ t, author, channel }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()

    try {
      const { collectedMoney } = await this.client.modules.economy.bonus.claimDaily(author.id)
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
