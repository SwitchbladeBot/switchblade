const { CanvasTemplates, Command, Constants } = require('../../../')
const { MessageAttachment } = require('discord.js')

module.exports = class ReputationLeaderboard extends Command {
  constructor (client) {
    super({
      name: 'reputation',
      aliases: ['rep'],
      parent: 'leaderboard'
    }, client)
  }

  async run ({ t, author, channel }) {
    channel.startTyping()

    const top = await this.client.controllers.social.leaderboard('rep')
    const leaderboard = await CanvasTemplates.leaderboard({ t }, top, {
      icon: Constants.REPUTATION_SVG,
      iconWidth: 48,
      iconHeight: 48,
      title: t(`commands:${this.tPath}.title`).toUpperCase(),
      valueFunction: (u) => t('commons:reputationWithCount', { count: Math.round(u.rep) })
    })

    channel.send(new MessageAttachment(leaderboard, 'leaderboard.jpg')).then(() => channel.stopTyping())
  }
}
