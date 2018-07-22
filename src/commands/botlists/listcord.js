const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandRequirements } = CommandStructures
const moment = require('moment')

module.exports = class Daily extends Command {
  constructor (client) {
    super(client)
    this.name = 'listcord'

    this.requirements = new CommandRequirements(this, {databaseOnly: true})
  }

  async run ({ t, alias, author, channel, prefix, userDocument }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()

    const { ok, error, interval, value: count } = await this.client.modules.rewards.collectListcord({ user: author, doc: userDocument })
    if (ok) {
      embed.setDescription(t('commands:listcord.thanksForVoting', { count }))
    } else {
      embed.setColor(Constants.ERROR_COLOR)
      switch (error) {
        case 'IN_INTERVAL':
          const time = moment.duration(interval).format('h[h] m[m] s[s]')
          embed
            .setTitle(t('commands:listcord.alreadyClaimed'))
            .setDescription(t('commons:youCanDoItAgainIn', { time }))
          break
        case 'INVALID_VOTE':
          embed
            .setDescription(t('commands:listcord.howToVote', {
              link: `https://listcord.com/bot/${this.client.user.id}`,
              command: `${prefix}${alias || this.name}`
            }))
          break
      }
    }

    channel.send(embed).then(() => channel.stopTyping())
  }
}
