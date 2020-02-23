const { SwitchbladeEmbed, Command, Constants } = require('../../../')

module.exports = class ScrobblingEnabler$ extends Command {
  constructor (client) {
    super({
      name: 'enable',
      aliases: ['e'],
      parent: 'scrobbling',
      parameters: [{ type: 'boolean' }]
    }, client)
  }

  async run ({ t, author, channel }, scrobbling) {
    channel.startTyping()
    const embed = new SwitchbladeEmbed(author)
    try {
      const userConnections = await this.client.controllers.connection.getConnections(author.id)
      const lastfm = userConnections.find(c => c.name === 'lastfm')
      if (!lastfm) {
        throw new Error('NOT_CONNECTED')
      }
      const newConfig = await this.client.controllers.connection.editConfig(author.id, 'lastfm', { scrobbling })
      const scrobblingStatus = newConfig.scrobbling ? t('commons:enabled') : t('commons:disabled')
      embed.setDescription(t('commands:scrobbling.subcommands.enable.changed', { scrobblingStatus }))
      await channel.send(embed)
    } catch (e) {
      await channel.send(embed.setDescription(t('commands:scrobbling.configNotConnected', { link: `${process.env.DASHBOARD_URL}/profile` }))
        .setColor(Constants.ERROR_COLOR))
    }
    channel.stopTyping()
  }
}
