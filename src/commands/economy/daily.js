const { Command, SwitchbladeEmbed, Constants } = require('../../')
const prettyMs = require('pretty-ms')

module.exports = class Daily extends Command {
  constructor (client) {
    super(client)
    this.name = 'daily'
  }

  run (message, args) {
    const embed = new SwitchbladeEmbed(message.author)
    message.channel.startTyping()
    this.client.database.users.get(message.author.id).then(data => {
      let date
      if (data.lastDaily === 0) date = Date.now() - 86400000
      else date = data.lastDaily
      if (Date.now() - date < 86400000) {
        embed.setColor(Constants.ERROR_COLOR)
          .setDescription(`You've already claimed your daily reward, you can get it again in **${prettyMs(parseInt((Date.now() - (date + 86400000)) * -1))}**`)
      } else {
        const collectedMoney = Math.floor(Math.random() * (2750 - 750 + 1)) + 750
        data.money += collectedMoney
        data.lastDaily = Date.now()
        data.save()
        embed.setDescription(`You've received **${collectedMoney}** SwitchCoins as your daily reward!`)
      }
      message.channel.send(embed).then(() => message.channel.stopTyping())
    })
  }
}
