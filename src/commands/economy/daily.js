const { Command, SwitchbladeEmbed, Constants } = require('../../')
const prettyMs = require('pretty-ms')

module.exports = class Daily extends Command {
  constructor (client) {
    super(client)
    this.name = 'daily'
  }

  run (message, args, t) {
    const embed = new SwitchbladeEmbed(message.author)
    message.channel.startTyping()
    this.client.database.users.get(message.author.id).then(data => {
      let date
      if (data.lastDaily === 0) date = Date.now() - 86400000
      else date = data.lastDaily
      if (Date.now() - date < 86400000) {
        const time = prettyMs(parseInt((Date.now() - (date + 86400000)) * -1), { secDecimalDigits: 0 })
        embed.setColor(Constants.ERROR_COLOR)
          .setTitle(t('commands:daily.alreadyClaimedTitle'))
          .setDescription(t('commands:daily.alreadyClaimedDescription', {time}))
      } else {
        const collectedMoney = Math.floor(Math.random() * (2750 - 750 + 1)) + 750
        data.money += collectedMoney
        data.lastDaily = Date.now()
        data.save()
        embed.setDescription(t('commands:daily.claimedSuccessfully', {count: collectedMoney}))
      }
      message.channel.send(embed).then(() => message.channel.stopTyping())
    })
  }
}
