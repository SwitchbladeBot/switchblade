const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandRequirements } = CommandStructures
const moment = require('moment')

const DAILY_INTERVAL = 24 * 60 * 60 * 1000 // 1 day

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

    const userDoc = await this.client.database.users.get(author.id)
    const now = Date.now()
    const date = userDoc.lastDaily
    if (now - date < DAILY_INTERVAL) {
      const time = moment.duration(DAILY_INTERVAL - (now - date)).format('h[h] m[m] s[s]')
      embed.setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:daily.alreadyClaimedTitle'))
        .setDescription(t('commands:daily.alreadyClaimedDescription', { time }))
    } else {
      const collectedMoney = Math.ceil(Math.random() * 2000) + 750
      userDoc.money += collectedMoney
      userDoc.lastDaily = now
      userDoc.save()
      embed.setDescription(t('commands:daily.claimedSuccessfully', { count: collectedMoney }))
    }
    channel.send(embed).then(() => channel.stopTyping())
  }
}
