const { CanvasTemplates, Command, Constants } = require('../../../')
const { Attachment } = require('discord.js')

module.exports = class MoneyLeaderboard extends Command {
  constructor (client) {
    super(client, {
      name: 'money',
      aliases: ['balance', 'switchcoins'],
      parentCommand: 'leaderboard'
    })
  }

  async run ({ t, author, channel }) {
    channel.startTyping()

    const top = await this.client.modules.social.leaderboard('money')
    const leaderboard = await CanvasTemplates.leaderboard({ t }, top, {
      icon: Constants.COINS_SVG,
      iconWidth: 48,
      iconHeight: 48,
      title: t(`commands:${this.tPath}.title`).toUpperCase(),
      valueFunction: (u) => t('commons:currencyWithCount_plural', { count: u.money })
    })

    channel.send(new Attachment(leaderboard, 'leaderboard.jpg')).then(() => channel.stopTyping())
  }
}
