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
          .setDescription(`Gained ${formatter.format(guild.members.size)} members\`\n${guild.id}\``)
          .setFooter(`Now on ${formatter.format(this.client.guilds.size)} guilds`)
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
          .setDescription(`Lost ${formatter.format(guild.members.size)} members\n\`${guild.id}\``)
          .setFooter(`Now on ${formatter.format(this.client.guilds.size)} guilds`)
      )
    }
  }
}
