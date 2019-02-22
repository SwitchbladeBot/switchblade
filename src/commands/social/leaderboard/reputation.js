const { CanvasTemplates, Command, Constants } = require('../../../')
const { Attachment } = require('discord.js')

module.exports = class ReputationLeaderboard extends Command {
  constructor (client) {
    super(client, {
      name: 'reputation',
      aliases: ['rep'],
      parentCommand: 'leaderboard'
    })
  }

  async run ({ t, author, channel }) {
    channel.startTyping()

    const top = await this.client.modules.social.leaderboard('rep')
    const leaderboard = await CanvasTemplates.leaderboard({ t }, top, {
      icon: Constants.REPUTATION_SVG,
      iconWidth: 48,
      iconHeight: 48,
      title: t(`commands:${this.tPath}.title`).toUpperCase(),
      valueFunction: (u) => t('commons:reputationWithCount', { count: u.rep })
    })

    channel.send(new Attachment(leaderboard, 'leaderboard.jpg')).then(() => channel.stopTyping())
  }
}
