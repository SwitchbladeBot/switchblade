const { Command, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class UserConnections extends Command {
  constructor (client) {
    super({
      name: 'connections',
      aliases: ['conns', 'conn', 'connection'],
      category: 'configuration',
      requirements: { databaseOnly: true }
    }, client)
  }

  async run ({ t, author, channel }) {
    const embed = new SwitchbladeEmbed(author)

    try {
      const userConnections = await this.client.controllers.connection.getConnectionsFiltered(author.id)
      const connections = userConnections.map(conn => {
        const emoji = this.getEmoji(conn.name.toLowerCase())
        return conn.connected
          ? `${emoji} ${t('commands:connections.connected', { user: `**${conn.account.user}**` })}`
          : `${emoji} [${t('commands:connections.notConnected')}](${process.env.DASHBOARD_URL}/profile)`
      })
      embed.setTitle(t('commands:connections.title'))
        .setDescription(connections)
    } catch (e) {
      embed.setColor(Constants.ERROR_COLOR)
        .setTitle(t('errors:generic'))
    }

    channel.send(embed)
  }
}
