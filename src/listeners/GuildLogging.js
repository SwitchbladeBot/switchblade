const { EventListener, SwitchbladeEmbed, Constants } = require('../')

const Intl = require('intl')
Intl.__disableRegExpRestore()
const formatter = new Intl.NumberFormat('en-US')

module.exports = class GuildLogging extends EventListener {
  constructor (client) {
    super(client)
    this.events = ['guildCreate', 'guildDelete']
  }

  onGuildCreate (guild) {
    logGuildCreateOrDelete(this, guild)
  }

  onGuildDelete (guild) {
    logGuildCreateOrDelete(this, guild, true)
  }
}

function logGuildCreateOrDelete (client, guild, deleted) {
  client.logger.info(deleted ? `Removed from "${guild.name}"` : `Added to "${guild.name}"`, {
    label: 'Guilds',
    guild: {
      name: guild.name,
      id: guild.id,
      owner: {
        name: guild.owner.user.tag,
        id: guild.ownerID
      },
      createdTimestamp: guild.createdTimestamp,
      large: guild.large,
      memberCount: guild.members.size,
      region: guild.region
    }
  })

  if (process.env.LOGGING_CHANNEL_ID) {
    client.channels.get(process.env.LOGGING_CHANNEL_ID).send(
      new SwitchbladeEmbed()
        .setColor(deleted ? Constants.GUILD_LOST_COLOR : Constants.GUILD_ADDED_COLOR)
        .setTitle(deleted ? `Removed from "${guild.name}"` : `Added to "${guild.name}"`)
        .setDescription([
          `\`${guild.id}\``,
          `Owned by **${guild.owner.user.tag}** (\`${guild.ownerID}\`)`,
          `**${formatter.format(guild.members.size)}** members`,
          `\`${guild.region}\``
        ])
        .footer(`Now in ${formatter.format(client.guilds.size)} guilds`)
    )
  }
}
