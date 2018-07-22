const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandRequirements } = CommandStructures
const moment = require('moment')

module.exports = class Daily extends Command {
  constructor (client) {
    super(client)
    this.name = 'daily'

    this.requirements = new CommandRequirements(this, {guildOnly: true, databaseOnly: true})
  }

  async run ({ t, author, channel, userDocument }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()

    const { ok, collected, interval } = await this.client.modules.economy.collectDaily({ user: author, doc: userDocument })
    if (ok) {
      embed.setDescription(t('commands:daily.claimedSuccessfully', { count: collected }))
    } else {
      const time = moment.duration(interval).format('h[h] m[m] s[s]')
      embed.setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:daily.alreadyClaimedTitle'))
        .setDescription(t('commands:daily.alreadyClaimedDescription', { time }))
    }

    channel.send(embed).then(() => channel.stopTyping())
  }
}
