const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandRequirements } = CommandStructures
const prettyMs = require('pretty-ms')

module.exports = class Daily extends Command {
  constructor (client) {
    super(client)
    this.name = 'daily'

    this.requirements = new CommandRequirements(this, {guildOnly: true, databaseOnly: true})
  }

  async run ({ t, author, channel }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()

    const userDoc = await this.client.database.users.get(author.id)
    const now = Date.now()
    const date = userDoc.lastDaily
    if (date + 86400000 >= now) {
      const time = prettyMs(parseInt((now - (date + 86400000)) * -1), { secDecimalDigits: 0 })
      embed.setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:daily.alreadyClaimedTitle'))
        .setDescription(t('commands:daily.alreadyClaimedDescription', {time}))
    } else {
      const collectedMoney = Math.ceil(Math.random() * 2000) + 750
      userDoc.money += collectedMoney
      userDoc.lastDaily = now
      userDoc.save()
      embed.setDescription(t('commands:daily.claimedSuccessfully', {count: collectedMoney}))
    }
    channel.send(embed).then(() => channel.stopTyping())
  }
}
