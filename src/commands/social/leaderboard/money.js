const { CanvasTemplates, Command, Constants } = require('../../../')
const { MessageAttachment } = require('discord.js')

module.exports = class MoneyLeaderboard extends Command {
  constructor (client) {
    super({
      name: 'money',
      aliases: ['balance', 'switchcoins'],
      parent: 'leaderboard'
    }, client)
  }

  async run ({ t, author, channel }) {
    channel.startTyping()

    const top = await this.client.controllers.social.leaderboard('money')
    const leaderboard = await CanvasTemplates.leaderboard({ t }, top, {
      icon: Constants.COINS_SVG,
      iconWidth: 48,
      iconHeight: 48,
      title: t(`commands:${this.tPath}.title`).toUpperCase(),
      valueFunction: (u) => t('commons:currencyWithCount_plural', { count: Math.round(u.money) })
    })

    channel.send(new MessageAttachment(leaderboard, 'leaderboard.jpg')).then(() => channel.stopTyping())
  }
}
