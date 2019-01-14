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
    this.log(`[35mAdded to "${guild.name}" (${guild.id})`, 'Guilds')
    if (process.env.LOGGING_CHANNEL_ID) {
      this.channels.get(process.env.LOGGING_CHANNEL_ID).send(
        new SwitchbladeEmbed()
          .setColor(Constants.GUILD_ADDED_COLOR)
          .setTitle(`Added to "${guild.name}"`)
          .setDescription(`\`${guild.id}\``)
          .setFooter(`Gained ${formatter.format(guild.members.size)} members`)
      )
    }
  }

  onGuildDelete (guild) {
    this.log(`[35mRemoved from "${guild.name}" (${guild.id})`, 'Guilds')
    if (process.env.LOGGING_CHANNEL_ID) {
      this.channels.get(process.env.LOGGING_CHANNEL_ID).send(
        new SwitchbladeEmbed()
          .setColor(Constants.GUILD_LOST_COLOR)
          .setTitle(`Removed from "${guild.name}"`)
          .setDescription(`\`${guild.id}\``)
          .setFooter(`Lost ${formatter.format(guild.members.size)} members`)
      )
    }
  }
}
