const { SwitchbladeEmbed, Command } = require('../../../')

module.exports = class Scrobbling extends Command {
  constructor (client) {
    super({
      name: 'scrobbling',
      category: 'music',
      aliases: ['scrobble', 'scrobbler', 'audioscrobbler'],
      requirements: { envVars: ['DASHBOARD_URL'] }
    }, client)
  }

  async run ({ t, author, channel, prefix }) {
    channel.startTyping()
    const embed = new SwitchbladeEmbed(author)
      .setTitle(t('commands:scrobbling.title'))
    const userConnections = await this.client.controllers.connection.getConnections(author.id)
    const lastfm = userConnections.find(c => c.name === 'lastfm')
    const link = `${process.env.DASHBOARD_URL}/profile`
    if (!lastfm) {
      channel.send(embed.setDescription(t('commands:scrobbling.notConnectedDescription', { link }))
        .then(() => channel.stopTyping()))
      return
    }
    const scrobblingStatus = lastfm.config.scrobbling ? t('commons:enabled') : t('commons:disabled')
    const config = t('commands:scrobbling.configuration.description', { link }) +
      `\n\`${prefix}scrobbling enable <true/false>\`\n\`${prefix}scrobbling percent <45-90>\``
    channel.send(embed.setTitle(t('commands:scrobbling.title'))
      .setDescription(t('commands:scrobbling.connectedDescription', { scrobblingStatus, percent: lastfm.config.percent }))
      .addField(t('commands:scrobbling.configuration.title'), config))
      .then(() => channel.stopTyping())
  }
}
