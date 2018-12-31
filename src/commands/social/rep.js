const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandParameters, UserParameter, CommandRequirements } = CommandStructures

module.exports = class Rep extends Command {
  constructor (client) {
    super(client)
    this.name = 'rep'
    this.category = 'social'

    this.requirements = new CommandRequirements(this, { onlyOldAccounts: true, databaseOnly: true })

    this.parameters = new CommandParameters(this,
      new UserParameter({ missingError: 'commands:rep.noMention', acceptBot: false })
    )
  }

  async run ({ t, author, channel }, user) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()

    if (user.id === author.id) {
      embed.setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:rep.repYourself'))
    } else {
      try {
        await this.client.modules.social.addReputation(author.id, user.id)
        embed.setTitle(t('commands:rep.reputationPoint', { user }))
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
    }

    channel.send(embed).then(() => channel.stopTyping())
  }
}
